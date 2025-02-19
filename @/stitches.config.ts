import { createStitches } from "@stitches/react"

export const MAIN_ACCENT = "#2EA4AB"

export const DARKS = {
    dark1: "#2C3939",
    dark2: "#566161",
    dark3: "#808888",
    dark4: "#ABB0B0",
    dark5: "#D5D7D7",
    dark6: "#F4F5F5",
}

export const {
    styled,
    css,
    globalCss,
    keyframes,
    getCssText,
    theme,
    createTheme,
    config,
} = createStitches({
    theme: {
        colors: {
            accent: MAIN_ACCENT,
            error: "#FF9393",
            positive: "#6291D7",
            negative: "#D76263",
            ...DARKS,
        },
        shadows: {
            accent: "#2EA4AB5C",
            black: "#0000001F",
        },
    },
    utils: {
        elevated: (condition: boolean) => ({
            boxShadow: condition ? "0px 1rem 2rem 0px #0000001F" : "none",
        }),
        high: (color: "accent" | "black" | string) => ({
            boxShadow: `0px 1rem 2rem 0px $${color}`,
        }),
        animated: () => ({
            transition: "500ms cubic-bezier(0,.67,0,.99)",
        }),
        card: (border: "grey" | string) => ({
            elevated: true,
            backgroundColor: "white",
            border: `0.5rem solid ${border === "grey" ? `$dark5` : border}`,
            borderRadius: "2rem",
        }),
    },
})
