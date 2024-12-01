const ANSI_COLOR_CODES = {
    regular: {
        black: "\u001b[0;30m",
        red: "\u001b[0;31m",
        green: "\u001b[0;32m",
        yellow: "\u001b[0;33m",
        blue: "\u001b[0;34m",
        purple: "\u001b[0;35m",
        cyan: "\u001b[0;36m",
        white: "\u001b[0;37m",
    },
    bold: {
        black: "\u001b[1;30m",
        red: "\u001b[1;31m",
        green: "\u001b[1;32m",
        yellow: "\u001b[1;33m",
        blue: "\u001b[1;34m",
        purple: "\u001b[1;35m",
        cyan: "\u001b[1;36m",
        white: "\u001b[1;37m",
    },
    underline: {
        black: "\u001b[4;30m",
        red: "\u001b[4;31m",
        green: "\u001b[4;32m",
        yellow: "\u001b[4;33m",
        blue: "\u001b[4;34m",
        purple: "\u001b[4;35m",
        cyan: "\u001b[4;36m",
        white: "\u001b[4;37m",
    },
    background: {
        black: "\u001b[40m",
        red: "\u001b[41m",
        green: "\u001b[42m",
        yellow: "\u001b[43m",
        blue: "\u001b[44m",
        purple: "\u001b[45m",
        cyan: "\u001b[46m",
        white: "\u001b[47m",
    },
}

export const utils = {
    info: (message) => console.log(`${ANSI_COLOR_CODES.bold.blue}[INFO] ${message}${ANSI_COLOR_CODES.regular.white}`),
    warn: (message) => console.log(`${ANSI_COLOR_CODES.bold.yellow}[WARN] ${message}${ANSI_COLOR_CODES.regular.white}`),
    danger: (message) => console.log(`${ANSI_COLOR_CODES.background.red}[INFO] ${message}${ANSI_COLOR_CODES.regular.white}`),
}