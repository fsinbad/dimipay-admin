import { Token } from "@/typo"
import { forwardRef, Ref } from "react"
import { UseFormRegisterReturn } from "react-hook-form"
import { InputWraper, LogicalInput } from "./style"

export const Input: React.FC<{
    placeholder: string
    name: string
    hideContent?: boolean
    hooker?: UseFormRegisterReturn
}> = forwardRef((props, ref) => (
    <label>
        <InputWraper gap={1.5} padding={3}>
            <Token>{props.name}</Token>
            <LogicalInput
                {...props.hooker}
                placeholder={props.placeholder}
                {...(props.hideContent && {
                    type: "password",
                })}
            />
        </InputWraper>
    </label>
))
