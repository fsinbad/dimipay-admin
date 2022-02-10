import { Scheme, SLUG, TableRecord } from "@/types"
import { User } from "@prisma/client"
import { DELETE_SELECTED_RECORDS_ACTION } from "./common"

export const USER_SCHEME: Scheme = {
    name: "사용자",
    tableName: SLUG.user,
    fields: {
        id: {
            display: "#",
            readOnly: true,
            autoGenerative: true,
            additional: {
                type: "number",
            },
        },
        student_id: {
            display: "교내관리번호",
            description:
                "학번이 아닌 중앙데이터베이스 관리용 번호입니다. 임의로 변경할 시 시스템에 오류가 발생할 수 있습니다.",
            required: true,
            validateFunc(data) {
                if (data < 0) return "교내관리번호는 0 이상이여야 합니다"
            },
            additional: {
                type: "number",
            },
        },
        username: {
            display: "ID",
            required: true,
            additional: {
                type: "string",
            },
            validateFunc(data: string) {
                if (data.length < 2) return "ID는 2글자 이상이여야 합니다"

                if (data.length > 20) return "ID는 20글자 이하이여야 합니다"

                if (!/^[a-zA-Z0-9!@#$%^&*()]+$/.test(data))
                    return "ID는 영문과 숫자만, 특수문자 사용할 수 있습니다"
            },
        },
        profile_image: {
            display: "프로필 이미지",
            invisibleInTable: true,
            additional: {
                type: "string",
            },
            required: true,
        },
        roles: {
            display: "유형",
            required: true,
            validateFunc(data: string[]) {
                if (data.includes("S") && data.includes("T"))
                    return "학생과 교사 권한을 동시에 부여할 수 없습니다"
            },
            additional: {
                type: "multiple",
                options: [
                    {
                        label: "S",
                        color: "#E54444",
                    },
                    {
                        label: "T",
                        color: "#E5E544",
                    },
                    {
                        label: "A",
                        color: "#44A2E5",
                    },
                ],
                map: {
                    S: "학생",
                    T: "교사",
                    A: "관리자",
                },
            },
        },
        created_at: {
            display: "가입일",
            readOnly: true,
            autoGenerative: true,
            additional: {
                type: "date",
            },
            invisibleInTable: true,
        },
        updated_at: {
            display: "마지막 정보 수정",
            readOnly: true,
            autoGenerative: true,
            additional: {
                type: "date",
            },
            invisibleInTable: true,
        },
    },
    actions: [
        DELETE_SELECTED_RECORDS_ACTION,
        {
            button: {
                color: "accent",
                label: "거래 중지",
            },
            func(selectedRecords: TableRecord[]) {
                alert(
                    (selectedRecords as User[])
                        .map((e) => e.accountName)
                        .join(",") + "라네요. 글 내려주세요."
                )
            },
        },
    ],
}
