import fs from "fs/promises"
import { Timings } from "../spec/spec-helpers.js"
import JDB from "../index.js"
const dbpath = "benchmark/load.jdb"
const COUNT = process.env.COUNT || 100000

const stringOfLength = len => [...Array(len)].map(() => `X`).join``

// Async wrapper
;(async () => {
    const timings = new Timings()
    const db = new JDB.DB(dbpath).load()
    db.flush()
    timings.mark("flush")

    const name = stringOfLength(30)
    const bio = stringOfLength(900)

    for (let i = 0; i < COUNT; i++) {
        db.create(db.nextId, { name, bio })
    }

    timings.mark("create")
    db.load()
    timings.mark("load")

    console.log(`${COUNT} records loaded`)
    const { size } = await fs.lstat(dbpath)
    console.log(`${(size / 1000 / 1000).toFixed(1)} MB file size`)

    fs.unlink(dbpath)
})()
