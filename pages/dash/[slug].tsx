import { useCallback, useEffect, useMemo, useState } from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import HashLoader from "react-spinners/HashLoader"
import { Hexile, Vexile } from "@haechi/flexile"
import { useRouter } from "next/router"
import { NextPage } from "next"

import { Button, LoadSVG, MiniInput, Table } from "@/components"
import { NewRecord } from "@/components/Subcontent/NewRecord"
import { addIcon, closeIcon, downloadIcon } from "@/assets"
import { FilterItem } from "@/functions/useFilter/partial"
import { selectedRowAtom, subContentAtom } from "@/coil"
import { Important, PageHeader, Regular } from "@/typo"
import { MiniSelect } from "@/components/MiniSelect"
import { MAIN_ACCENT } from "@/stitches.config"
import { table, useFilter } from "@/functions"
import { SLUG, TableRecord } from "@/types"
import { TABLES } from "@/constants"

import { SubcontentWrapper } from "./style"
import { Sidebar } from "./partial"

const TableViewer: NextPage = () => {
    const slug = useRouter().query.slug as SLUG
    const [subcontent, setSubcontent] = useRecoilState(subContentAtom)
    const setSelectedRow = useSetRecoilState(selectedRowAtom)
    const setSubContent = useSetRecoilState(subContentAtom)

    const scheme = useMemo(
        () => TABLES.find((table) => table.slug === SLUG[slug]),
        [slug]
    )

    const [sortField, setSortField] = useState<string | null>(
        scheme?.defaultSort?.field || null
    )
    const [sortDirection, setSortDirection] = useState<"123" | "321" | null>(
        scheme?.defaultSort?.order || null
    )
    const [fullRecordAmount, setFullRecordAmount] = useState<number>()
    const [currentCursor, setCurrentCursor] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    const [pageSize, setPageSize] = useState(15)

    const {
        filter,
        addFilter,
        clearFilter,
        element: filterElement,
        opened: filterOpened,
        ...filterOptions
    } = useFilter(scheme)

    const [records, setRecords] = useState<TableRecord[]>()

    const load = useCallback(() => {
        if (!scheme) return
        setLoading(true)

        if (filterOptions.filterTargetTable !== scheme?.name) return

        table[scheme.slug]
            .GET({
                filter,
                amount: pageSize,
                skip: currentCursor ? currentCursor : 0,
                sort:
                    sortField && sortDirection
                        ? [
                              {
                                  field: sortField,
                                  order: sortDirection,
                              },
                          ]
                        : undefined,
            })
            .then((e) => {
                setRecords(e.records)
                setFullRecordAmount(e.amount)
                setLoading(false)
            })
    }, [filter, scheme, sortField, sortDirection, filterOptions, pageSize])

    useEffect(() => {
        setRecords(undefined)
        clearFilter()
        setCurrentCursor(0)
        load()
    }, [scheme])

    useEffect(() => {
        load()
    }, [filter, sortField, sortDirection, currentCursor, pageSize])

    return (
        <Hexile fillx filly>
            <Sidebar />
            {scheme ? (
                <Vexile fillx filly padding={10} gap={4} scrollx relative>
                    <Hexile x="space">
                        <PageHeader>{scheme.name}</PageHeader>
                        <Hexile gap={2}>
                            <Button color="black">
                                <LoadSVG
                                    src={downloadIcon}
                                    alt="다운로드 아이콘"
                                    height={4}
                                    width={4}
                                />
                                <Important white>다운로드</Important>
                            </Button>
                            <Button
                                onClick={() => {
                                    setSubContent({
                                        element: (
                                            <NewRecord
                                                onReloadRequested={load}
                                                scheme={scheme}
                                            />
                                        ),
                                        name: scheme.name + " 만들기",
                                    })
                                }}
                            >
                                <LoadSVG
                                    src={addIcon}
                                    alt="추가 아이콘"
                                    height={4}
                                    width={4}
                                />
                                <Important white>추가</Important>
                            </Button>
                        </Hexile>
                    </Hexile>
                    {records ? (
                        <Table
                            isLoading={loading}
                            records={records}
                            scheme={scheme}
                            onReloadRequested={load}
                            addFilter={addFilter}
                            enablePagination={
                                !!(
                                    fullRecordAmount &&
                                    fullRecordAmount > pageSize &&
                                    records.length === pageSize
                                )
                            }
                            nextPage={() => {
                                setCurrentCursor((e) => e + pageSize)
                            }}
                            setSort={(fieldName: string) => {
                                if (sortField === fieldName) {
                                    if (sortDirection === "123") {
                                        setSortDirection("321")
                                        return
                                    }
                                    if (sortDirection === "321") {
                                        setSortDirection(null)
                                        setSortField(null)
                                        return
                                    }
                                }

                                setSortField(fieldName)
                                setSortDirection("123")
                            }}
                            sortField={sortField}
                            sortDirection={sortDirection}
                        />
                    ) : (
                        <Vexile fillx filly x="center" y="center">
                            <HashLoader color={MAIN_ACCENT} />
                        </Vexile>
                    )}

                    {fullRecordAmount !== undefined && (
                        <Hexile gap={8} x="left" y="center">
                            <Hexile y="center" gap={2}>
                                <Important
                                    color="dark3"
                                    onClick={() =>
                                        setCurrentCursor((e) => e - pageSize)
                                    }
                                >
                                    ←
                                </Important>
                                <MiniInput
                                    type="number"
                                    onChange={(e) => setCurrentCursor(+e)}
                                    value={currentCursor.toString()}
                                />
                                <Important color="dark3">/</Important>
                                <Important color="dark3">
                                    {fullRecordAmount}
                                </Important>

                                <Important
                                    onClick={() =>
                                        setCurrentCursor((e) => e + pageSize)
                                    }
                                    color="dark3"
                                >
                                    →
                                </Important>
                            </Hexile>
                            <Hexile gap={2} y="center">
                                <Regular color="dark3">
                                    한 페이지에 보여줄 갯수
                                </Regular>
                                <MiniSelect
                                    options={[
                                        {
                                            label: "15",
                                            key: 15,
                                        },
                                        {
                                            label: "30",
                                            key: 30,
                                        },
                                        {
                                            label: "500",
                                            key: 500,
                                        },
                                    ]}
                                    onChange={(e) => setPageSize(+e)}
                                    selected={{
                                        label: pageSize.toString(),
                                    }}
                                />
                            </Hexile>
                        </Hexile>
                    )}
                    {/* dummy for space */}
                    {filterOpened && (
                        <div style={{ visibility: "hidden" }}>
                            <FilterItem
                                disabled
                                field={Object.values(scheme.fields)[0]}
                                filter={["", undefined, undefined]}
                                updateFilter={() => {}}
                            />
                        </div>
                    )}
                    {filterElement}
                </Vexile>
            ) : (
                <Vexile fillx filly x="center" y="center">
                    <HashLoader color={MAIN_ACCENT} />
                </Vexile>
            )}
            {subcontent && (
                <SubcontentWrapper paddingx={6} paddingy={10} gap={6}>
                    <Hexile x="space">
                        <PageHeader>{subcontent.name}</PageHeader>
                        <LoadSVG
                            alt="닫기 버튼"
                            height={3}
                            width={3}
                            src={closeIcon}
                            onClick={() => {
                                setSelectedRow(null)
                                setSubcontent(null)
                            }}
                        />
                    </Hexile>
                    {subcontent.element}
                </SubcontentWrapper>
            )}
        </Hexile>
    )
}

export default TableViewer
