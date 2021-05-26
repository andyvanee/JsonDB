# JSON DB

A simple no-dependency, disk-backed, in-memory data store using a
human-readable append-only file.

### Install

```bash
    yarn add https://github.com/andyvanee/JsonDB.git
    # or
    npm install https://github.com/andyvanee/JsonDB.git
```

### Basic Usage

```javascript
import JsonDB from "jsondb"

// Database definition
const userdb = new JsonDB.DB("users.jsondb").load()

// Model definition
class User extends JsonDB.Model {
    static get db() {
        return userdb
    }

    beforeCreate() {
        this.role = this.role || "anonymous"
    }

    beforeSave() {
        // JsonDB.Model.uuid() is built-in to generate uuids similar to MongoDB
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
