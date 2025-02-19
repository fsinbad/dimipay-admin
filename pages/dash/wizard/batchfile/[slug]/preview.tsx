import { batchEditWizardFileAtom, modalContentAtom } from "@/coil"
import { Button, Table } from "@/components"
import { TABLES } from "@/constants"
import { batchEdit, table } from "@/functions"
import { NEO_RECORD_BASE_FIELDS } from "@/schemes/common"
import { TableRecord } from "@/types"
import { Important, PageHeader, Regular } from "@/typo"
import { Hexile, Vexile } from "@haechi/flexile"
import { useAtom } from "jotai"
import { useRouter } from "next/router"
import { Sidebar } from "pages/dash/partial"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { CheckPreviewBar } from "./style"

const Preview = () => {
    const router = useRouter()
    const [batchFile] = useAtom(batchEditWizardFileAtom)
    const [, showModal] = useAtom(modalContentAtom)
    const [modifiedRecords, setModifiedRecords] = useState<TableRecord[]>()

    const scheme = useMemo(() => {
        if (!router.query.slug) return
        const matchedTable = TABLES.find(e => e.slug === router.query.slug)

        if (!matchedTable) {
            router.replace("/")
            throw new Error("테이블을 찾을 수 없습니다")
        }

        return matchedTable
    }, [router])

    useEffect(() => {
        ;(async () => {
            if (
                !batchFile ||
                !batchFile.alignField ||
                !scheme ||
                !batchFile.match
            )
                return

            showModal({
                title: "현재 보고있는 화면은 미리보기입니다",
                content:
                    "꼭 화면 하단의 반영하기 버튼을 눌러서 변경사항을 저장해주세요",
                button: [
                    {
                        label: "확인",
                        action() {
                            showModal(null)
                        },
                    },
                ],
            })

            const headerMatchMap = batchFile.header.reduce(
                (map, current, index) => ({
                    ...map,
                    [current]: batchFile.match![index],
                    [batchFile.match![index]]: current,
                }),
                Object.keys(NEO_RECORD_BASE_FIELDS).reduce(
                    (map, current) => ({
                        ...map,
                        [current]: current,
                    }),
                    {},
                ) as Record<string, string>,
            )

            const uniqueIds = batchFile.records.map(
                e => e[headerMatchMap[batchFile.alignField!]!],
            )

            const originRecords = await table[scheme.slug].GET({
                only: {
                    fieldName: batchFile.alignField,
                    values: uniqueIds,
                },
                amount: uniqueIds.length,
            })

            if (originRecords.records.length !== uniqueIds.length) {
                const originAlign = originRecords.records.map(
                    e => e[batchFile.alignField!],
                )

                const notfound = uniqueIds.filter(
                    unique => !originAlign.includes(unique),
                )

                showModal({
                    title: "다음 데이터를 찾을 수 없어요",
                    content: notfound.join(", "),
                    button: [
                        {
                            label: "무시하고 진행",
                            action() {
                                showModal(null)
                            },
                        },
                    ],
                })
            }

            const records: TableRecord[] = originRecords.records.map(
                (e, index) => {
                    const currentBatchRecord = batchFile.records[index]

                    const formattedBatch = Object.entries(
                        currentBatchRecord,
                    ).reduce((formatted, [batchKey, batchValue]) => {
                        const key = headerMatchMap[batchKey]

                        if (!(key in scheme.fields)) return formatted
                        const field = scheme.fields[key]

                        const formattedBatchValue =
                            field.format.parseFromString(batchValue.toString())

                        return {
                            ...formatted,
                            [key]: formattedBatchValue,
                        }
                    }, {})

                    return {
                        ...e,
                        ...formattedBatch,
                    }
                },
            )

            setModifiedRecords(records)
        })()
    }, [batchFile, scheme])

    const apply = useCallback(async () => {
        if (!batchFile) return

        const { records, alignField, match, header } = batchFile

        if (!records || !alignField || !match || !header) return

        const { affected } = await batchEdit[scheme!.slug]({
            records,
            alignField,
            match,
            header,
        })

        toast.success(`${affected}개의 데이터에 변경사항이 적용됐어요`)

        router.push(`/dash/${router.query.slug}`)
    }, [scheme])

    return (
        <Hexile fillx filly>
            <Sidebar />
            <Vexile fillx filly padding={10} gap={4} scrollx>
                <PageHeader>한 번에 수정 결과 미리 보기</PageHeader>
                {modifiedRecords && scheme && (
                    <Table scheme={scheme} records={modifiedRecords} />
                )}
                <CheckPreviewBar padding={4} y="center" x="space">
                    <Regular>위와 같이 수정됩니다</Regular>
                    <Hexile gap={2}>
                        <Button color="black">
                            <Important white>모두 취소</Important>
                        </Button>
                        <Button>
                            <Important onClick={apply} white>
                                반영하기
                            </Important>
                        </Button>
                    </Hexile>
                </CheckPreviewBar>
            </Vexile>
        </Hexile>
    )
}

export default Preview
