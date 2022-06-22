import { Scheme, SLUG } from "@/types"
import { DELETE_SELECTED_RECORDS_ACTION, RECORD_BASE_FIELDS } from "./common"

export const DISCOUNT_POLICY: Scheme = {
    displayName: "할인 정책",
    tableName: SLUG.discountPolicy,
    fields: {
        ...RECORD_BASE_FIELDS,
        percentRate: {
            displayName: "할인율 (%)",
            typeOption: {
                type: "number",
                default: 0,
                suffix: "%",
            },
            required: false,
            description: "최소 1%부터 99%까지 설정할 수 있습니다",
            validateFunc(_data) {
                if (_data === '' || _data === undefined) return true
                const data = +(_data as string)
                if (data >= 1 && data <= 99) return true
                return "할인율은 1%부터 99%까지 설정할 수 있습니다"
            }
        },
        fixedPrice: {
            displayName: "정가 할인",
            typeOption: {
                type: "number",
                suffix: "원",
            },
            required: false,
        },
        Event: {
            displayName: "연계 이벤트",
            typeOption: {
                type: "relation-single",
                target: SLUG.event,
                displayNameField: "title",
            },
        },
        targetCategory: {
            displayName: "할인 카테고리",
            typeOption: {
                type: "relation-multiple",
                target: SLUG.category,
                displayNameField: "name",
            },
        },
    },
    actions: [DELETE_SELECTED_RECORDS_ACTION],
}
