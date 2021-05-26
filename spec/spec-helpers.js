export const assert = (a, b) => {
    if (a) {
        console.log("\x1b[32m%s\x1b[0m", b)
    } else {
        console.log("\x1b[31m%s\x1b[0m", b)
        console.log(new Error().stack.split("\n").slice(2).join("\n"))
        process.exitCode = 1
    }
}
