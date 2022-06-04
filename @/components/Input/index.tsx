import { numberInputIcon } from "@/assets"
import { Description, Regular, Token } from "@/typo"
import { Hexile } from "@haechi/flexile"
import { useState } from "react"
import { UseFormRegisterReturn } from "react-hook-form"
import { LoadSVG } from ".."
import { InputWraper, LogicalInput } from "./style"

const TYPE_ICON_MAP: Record<string, string> = {
    number: numberInputIcon,
}

export const TEXT_INPUT_COMPATIBLE_TYPES = [
    "string",
    "number",
    "date",
    "password",
    "color",
] as const

export const Input: React.FC<{
    placeholder: string
    name: string
    error?: string
    value?: string
    disabled?: boolean
    hideContent?: boolean
    defaultValue?: string
    hooker?: UseFormRegisterReturn
    type?: typeof TEXT_INPUT_COMPATIBLE_TYPES[number]
}> = (props) => {
    const commonProps = {
        disabled: props.disabled,
        defaultValue: props.defaultValue,
        placeholder: props.placeholder,
        value: props.value,
        ...props.hooker,
        ...(props.hideContent && {
            type: "password",
        }),
    }
    const [currentColor, setColor] = useState<string>()

    return (
        <label>
            <InputWraper
                gap={1.5}
                padding={3}
                disabled={props.disabled}
                hasError={typeof props.error === "string"}
            >
                <Hexile gap={1} y="center">
                    {props.type && TYPE_ICON_MAP[props.type] && (
                        <LoadSVG
                            src={TYPE_ICON_MAP[props.type]}
                            width={5}
                            height={5}
                            alt="입력창 아이콘"
                        />
                    )}
                    <Token>{props.name}</Token>
                </Hexile>
                {
                    {
                        ["string"]: <LogicalInput {...commonProps} />,
                        ["number"]: (
                            <LogicalInput
                                {...commonProps}
                                onInput={(e) => {
                                    e.currentTarget.value =
                                        e.currentTarget.value.replace(
                                            /[^0-9]/g,
                                            ""
                                        )
                                }}
                            />
                        ),
                        ["date"]: (
                            <LogicalInput
                                {...commonProps}
                                type="datetime-local"
                            />
                        ),
                        ["password"]: (
                            <LogicalInput {...commonProps} type="password" />
                        ),
                        ["color"]: (
                            <Hexile y="center">
                                <LogicalInput
                                    {...commonProps}
                                    type="color"
                                    colorchip
                                    onChange={(e) => {
                                        props.hooker?.onChange(e)
                                        setColor(e.currentTarget.value)
                                    }}
                                />
                                <Hexile fillx>
                                    <Regular>{currentColor}</Regular>
                                </Hexile>
                            </Hexile>
                        ),
                    }[props.type || "string"]
                }
                {props.error && <Token color="error">{props.error}</Token>}
            </InputWraper>
        </label>
    )
}
