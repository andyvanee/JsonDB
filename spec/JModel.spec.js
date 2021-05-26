import JDB from "../index.js"
import { assert } from "./spec-helpers.js"

const db = new JDB.DB("spec/sample.jdb").load()

class SampleModel extends JDB.Model {
    static get db() {
        return db
    }

    beforeCreate() {
        this.custom = "custom"
    }

    beforeSave() {
        this.id = this.id || SampleModel.uuid()
    }
}

// returns the millisecond difference between dates
const compareDates = (a, b) => {
    const tsa = Math.round(new Date(a).getTime() / 100)
    const tsb = Math.round(new Date(b).getTime() / 100)
    return tsb - tsa
}

db.flush()
assert(SampleModel.all.length == 0, "Start with no records")

const one = SampleModel.create({ name: "one" })
assert(one.name == "one", "Property is assigned")
assert(one.rowid == null, "No rowid yet")
assert(SampleModel.all.length == 0, "Create does not save")
assert(one.custom == "custom", "beforeCreate assigned property")
assert(one.id == null, "beforeSave has not run yet")

const now = new Date(Date.now()).toISOString()
one.save()
assert(one.rowid == 0, "rowid is zero")
assert(compareDates(one.ctime, now) == 0, "ctime set")
assert(compareDates(one.mtime, now) == 0, "mtime set")
assert(typeof one.id == "string", "Id set in beforeSave")

setTimeout(() => {
    one.save()
    const diff = compareDates(one.ctime, one.mtime)
    assert(diff >= 3 && 7 >= diff, "mtime is updated")
}, 500)
