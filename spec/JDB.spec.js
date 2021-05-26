import JsonDB from "../index.js"
import { assert } from "./spec-helpers.js"

const db = new JsonDB.DB("spec/sample.jsondb").load()
db.flush()
let one = db.create(db.nextId, { name: "one" })
const two = db.create(db.nextId, { name: "two" })
const three = db.create(db.nextId, { name: "three" })

assert(db.all.length == 3, "Should have three records")

db.delete(two.rowid)
assert(db.all.length == 2, "Should have two records")

db.update(one.rowid, { name: "one-modified" })
assert(db.all.length == 2, "Should have two records")

one = db.all.find(r => r.rowid == one.rowid)
assert(one.name == "one-modified", "Should match updated name")

const handleTwo = new JsonDB.DB("spec/sample.jsondb").load()
assert(handleTwo.all.length == 2, "Second read handle works")
