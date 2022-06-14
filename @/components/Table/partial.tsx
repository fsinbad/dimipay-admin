import React, { forwardRef, useState } from "react"
import { useSetRecoilState } from "recoil"

import { subContentAtom } from "@/coil"
import {
    DataValue,
    Field,
    isMultipleSelect,
    Relation,
    Scheme,
    SingleRelationField,
    TableRecord,
} from "@/types"
import { Important, Regular } from "@/typo"

import { TooltipWrapper, Cell, HeaderCell } from "./style"
import { DividerLine, ModifyRecord } from ".."
import { ColorBubble } from "../atoms"
import { Hexile, Vexile } from "@haechi/flexile"

const getFieldValue = (field: Field, value: DataValue) => {
    if (field.computed) return field.computed(value)

    const typeOption = field.typeOption

    if (typeOption.type === "boolean")
        return <input type="checkbox" checked={value as boolean} />

    if (typeOption.type === "relation-single") {
        if (!value) return ""
        if ((value as Relation).target.length === 0) return <></>

        const target = (value as Relation).target[0]
        return (
            <Hexile gap={2} y="center">
                {target.color && <ColorBubble color={target.color} />}
                <Regular>{target.displayName}</Regular>
            </Hexile>
        )
    }

    if (typeOption.type === "color") {
        return (
            <Hexile gap={2} y="center">
                <ColorBubble color={value as string} />
                <Regular>{value as string}</Regular>
            </Hexile>
        )
    }

    if (typeOption.type === "relation-multiple") {
        // console.log(typeOption)
        const target = value as Relation
        return <Regular>{target.target.map((e) => e.displayName)}</Regular>
    }

    if (value instanceof Array && isMultipleSelect(typeOption)) {
        return value
            .map((v: string | number | boolean | Date) =>
                field.computed
                    ? field.computed(v)
                    : typeOption.map
                    ? typeOption.map[v.toString()]
                    : typeOption.options.find((e) => e.key === v)?.label || v
            )
            .join(", ")
    }

    // if (typeOption.type === "date") {
    //     console.log(value)
    //     return formatDate(value)
    // }

    if ("options" in typeOption)
        return typeOption.options?.find((e) => e.key === value)?.label || value

    return value
}

export const Row = forwardRef<
    HTMLTableRowElement,
    {
        selected: boolean
        onCheckboxClicked: (selected: boolean) => void
        onReloadRequested: () => void
        row: TableRecord
        scheme: Scheme
    }
>(({ row, ...props }, ref) => {
    const setSubContent = useSetRecoilState(subContentAtom)
    return (
        <tr
            ref={ref}
            onClick={() =>
                setSubContent({
                    element: (
                        <ModifyRecord
                            onReloadRequested={props.onReloadRequested}
                            data={row}
                            scheme={props.scheme}
                        />
                    ),
                    name: props.scheme.displayName + " 상세",
                })
            }
        >
            <Cell>
                <input
                    type="checkbox"
                    checked={props.selected}
                    onClick={(e) => {
                        props.onCheckboxClicked(props.selected)
                        e.stopPropagation()
                    }}
                />
            </Cell>
            {Object.keys(props.scheme.fields).map(
                (key) =>
                    key in props.scheme?.fields &&
                    !props.scheme.fields[key].invisibleInTable && (
                        <Cell key={key}>
                            <Regular>
                                {getFieldValue(
                                    props.scheme.fields[key],
                                    row[key]
                                )}
                            </Regular>
                        </Cell>
                    )
            )}
            {props.scheme.computedFields &&
                Object.keys(props.scheme.computedFields).map((key) => (
                    <Cell>
                        <Regular>{row[key]}</Regular>
                    </Cell>
                ))}
        </tr>
    )
})

export const ActionableHeaderCell: React.FC<{
    onSort(): void
    onFilter(): void
}> = (props) => {
    const [isActionsVisible, showActions] = useState(false)

    return (
        <HeaderCell onClick={() => showActions((prev) => !prev)}>
            <Regular dark={4}>{props.children}</Regular>
            {isActionsVisible && (
                <TooltipWrapper gap={3} paddingx={4} paddingy={3}>
                    <Important accent onClick={props.onSort}>
                        정렬
                    </Important>
                    <DividerLine />
                    <Important accent onClick={props.onFilter}>
                        필터
                    </Important>
                </TooltipWrapper>
            )}
        </HeaderCell>
    )
}
