const kuzu = require('kuzu');

class Database {
    constructor(path) {
        this.db = new kuzu.Database(path);
        this.conn = new kuzu.Connection(this.db);
    }

    async insertInitialData() {
        // Create the tables
        await this.conn.query("CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name))");
        await this.conn.query("CREATE NODE TABLE City(name STRING, population INT64, PRIMARY KEY (name))");
        await this.conn.query("CREATE REL TABLE Follows(FROM User TO User, since INT64)");
        await this.conn.query("CREATE REL TABLE LivesIn(FROM User TO City)");

        // Load the data
        await this.conn.query('MERGE (n:User {name: "Alice", age: 25})');
        await this.conn.query('MERGE (n:User {name: "Bob", age: 30})');
        await this.conn.query('MERGE (n:User {name: "Charlie", age: 35})');
        await this.conn.query('MERGE (n:City {name: "London", population: 8908081})');
        await this.conn.query('MERGE (n:City {name: "Paris", population: 2140526})');
        await this.conn.query('MERGE (n:City {name: "New York", population: 8622698})');
        await this.conn.query('MATCH (a:User {name: "Alice"}), (b:User {name: "Bob"}) MERGE (a)-[:Follows {since: 2019}]->(b)');
        await this.conn.query('MATCH (a:User {name: "Bob"}), (b:User {name: "Charlie"}) MERGE (a)-[:Follows {since: 2020}]->(b)');
        await this.conn.query('MATCH (a:User {name: "Alice"}), (b:City {name: "London"}) MERGE (a)-[:LivesIn]->(b)');
    };
}

module.exports = Database;