const express = require('express');
const kuzu = require('kuzu');

const app = express();
const port = 3000;

const db = new kuzu.Database("./demo_db");
const conn = new kuzu.Connection(db);

const init = async () => {
  // Create the tables
  await conn.query("CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name))");
  await conn.query("CREATE NODE TABLE City(name STRING, population INT64, PRIMARY KEY (name))");
  await conn.query("CREATE REL TABLE Follows(FROM User TO User, since INT64)");
  await conn.query("CREATE REL TABLE LivesIn(FROM User TO City)");

  // Load the data
  await conn.query('MERGE (n:User {name: "Alice", age: 25})');
  await conn.query('MERGE (n:User {name: "Bob", age: 30})');
  await conn.query('MERGE (n:User {name: "Charlie", age: 35})');
  await conn.query('MERGE (n:City {name: "London", population: 8908081})');
  await conn.query('MERGE (n:City {name: "Paris", population: 2140526})');
  await conn.query('MERGE (n:City {name: "New York", population: 8622698})');
  await conn.query('MATCH (a:User {name: "Alice"}), (b:User {name: "Bob"}) MERGE (a)-[:Follows {since: 2019}]->(b)');
  await conn.query('MATCH (a:User {name: "Bob"}), (b:User {name: "Charlie"}) MERGE (a)-[:Follows {since: 2020}]->(b)');
  await conn.query('MATCH (a:User {name: "Alice"}), (b:City {name: "London"}) MERGE (a)-[:LivesIn]->(b)');
};

app.get('/', async (req, res) => {
  const queryResult = await conn.query("MATCH (a:User)-[f:Follows]->(b:User) RETURN a.name, f.since, b.name;");

  // Get all rows from the query result
  const rows = await queryResult.getAll();

  // Print the rows
  for (const row of rows) {
    console.log(row);
  }

  res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    });