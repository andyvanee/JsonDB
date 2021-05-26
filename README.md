# json-aof-db

A simple no-dependency, disk-backed, in-memory data store using a
human-readable append-only file.

### Install

```bash
    yarn add https://github.com/andyvanee/json-aof-db.git
    # or
    npm install https://github.com/andyvanee/json-aof-db.git
```

### Basic Usage

```javascript
import JDB from "json-aof-db"

// Database definition
const userdb = new JDB.DB("users.jdb").load()

// Model definition
class User extends JDB.Model {
    static get db() {
        return userdb
    }

    beforeCreate() {
        this.role = this.role || "anonymous"
    }

    beforeSave() {
        // JDB.Model.uuid() is built-in to generate uuids similar to MongoDB
        this.id = this.id || User.uuid()
    }
}

// Usage
const user = User.create({ name: "example user" })
user.save()
user.name = "One"
user.save()

User.all.length == 1

// Find single record
User.find({ name: "One" })
User.find(u => u.name == "One")

// Filter record list
User.filter({ name: "One" })
User.filter(u => u.name == "One")
```

See spec/\*.spec.js for complete examples.
