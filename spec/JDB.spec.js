import JDB from "../index.js"
import { assert } from "./spec-helpers.js"
const dbpath = "spec/jdb.jdb"

const db = new JDB.DB(dbpath).load()
db.flush()
let one = db.create(db.nextId, { name: "one", attr: "other" })
const two = db.create(db.nextId, { name: "two" })
const three = db.create(db.nextId, { name: "three" })

assert(db.all.length == 3, "Should have three records")

db.delete(two.rowid)
assert(db.all.length == 2, "Should have two records")

db.update(one.rowid, { name: "one-modified" })
assert(db.all.length == 2, "Should have two records")

one = db.all.find(r => r.rowid == one.rowid)
assert(one.name == "one-modified", "Should match updated name")

const findTwo = db.all.find(r => r.rowid == two.rowid)
assert(findTwo === undefined, "Deleted row could not be found")

const handleTwo = new JDB.DB(dbpath).load()
assert(handleTwo.all.length == 2, "Second read handle works")
