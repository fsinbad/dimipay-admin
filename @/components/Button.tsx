import { MAIN_ACCENT, styled } from "@/stitches.config"

export const Button = styled("button", {
    length: 0,
    backgroundColor: "$accent",
    border: "none",
    outline: "none",
    padding: "2rem 4rem",
    borderRadius: "2rem",
    color: "white !important",
    gap: "2rem",
    alignSelf: "stretch",
    high: "accent",
    animated: true,
    display: "flex",
    placeItems: "center",
    textAlign: "center",
    "&:focus": {
        boxShadow: "inset 0rem 0rem 0px 1rem black",
    },
    variants: {
        big: {
            true: {
                padding: "4rem 6rem",
                gap: "3rem",
            },
        },
        color: {
            black: {
                backgroundColor: "$dark1",
                high: "black",
                "&:focus": {
                    boxShadow: `inset 0rem 0rem 0px 1rem ${MAIN_ACCENT}`,
                },
            },
        },
        disabled: {
            true: {
                backgroundColor: "$dark4",
                high: "none",
            },
        },
        block: {
            true: {
                display: "block",
            },
        },
        fillx: {
            true: {
                width: "100%",
            },
        },
        fit: {
            true: {
                width: "fit-content",
                alignSelf: "revert",
            },
        },
    },
})
