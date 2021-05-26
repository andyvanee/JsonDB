const uuid = () => {
    const ts = parseInt(Date.now() / 1000).toString(16)
    const hash = parseInt((Math.random() * 0xffffff).toFixed(0))
        .toString(16)
        .padStart(6, "0")
    return `${ts}${hash}`
}

export class Model {
    static get db() {
        throw `Must be implemented in subclass`
    }

    static get timestamps() {
        return true
    }

    static uuid() {
        return uuid()
    }

    static load() {
        return this.db.load()
    }

    static get all() {
        return this.db.all.map(x => new this(x))
    }

    static createFilter(conditions = null) {
        if (typeof conditions == "function") return conditions

        let filter = x => x

        if (typeof conditions == "object") {
            const entries = Object.entries(conditions)
            filter = x => {
                for (const [k, v] of entries) {
                    if (x[k] != v) return false
                }
                return true
            }
        }
        return filter
    }

    static find(conditions = null) {
        const filter = this.createFilter(conditions)
        return this.all.find(filter)
    }

    static filter(conditions = null) {
        const filter = this.createFilter(conditions)
        return this.all.filter(filter)
    }

    static create(data = {}) {
        const record = new this(data)
        record.beforeCreate()
        return record
    }

    constructor(data) {
        Object.assign(this, data)
    }

    beforeSave() {}
    beforeDelete() {}
    beforeCreate() {}

    save() {
        const db = this.constructor.db

        this.beforeSave()

        if (this.constructor.timestamps) {
            const now = new Date(Date.now()).toISOString()
            this.ctime = this.ctime || now
            this.mtime = now
        }

        if (typeof this.rowid == "number") {
            db.update(this.rowid, this)
        } else {
            this.rowid = db.nextId
            db.create(this.rowid, this)
        }
    }

    delete() {
        const db = this.constructor.db
        if (typeof this.rowid == "number") {
            this.beforeDelete()
            db.delete(this.rowid)
        }
    }
}
