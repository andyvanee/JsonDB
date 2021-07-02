import { performance } from "perf_hooks"

export const assert = (a, b) => {
    if (a) {
        console.log("\x1b[32m%s\x1b[0m", b)
    } else {
        console.log("\x1b[31m%s\x1b[0m", b)
        console.log(new Error().stack.split("\n").slice(2).join("\n"))
        process.exitCode = 1
    }
}

export class Timings {
    constructor() {
        this.timings = [["start", performance.now()]]
    }

    mark(name) {
        const first = this.timings[0]
        const prev = this.timings[this.timings.length - 1]
        const curr = [name, performance.now()]
        const displayElapsed = ((curr[1] - first[1]) / 1000).toFixed(3)
        const displayCurr = ((curr[1] - prev[1]) / 1000).toFixed(3)
        console.log(
            `${curr[0].padEnd(
                12,
                " "
            )} this:${displayCurr}s   total:${displayElapsed}s`
        )
        this.timings.push([name, performance.now()])
    }
}
