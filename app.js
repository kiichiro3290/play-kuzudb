const express = require('express');

const Database = require('./db.js');

const app = express();
const port = 3000;

const db = new Database(""); // パスを指定しないとインメモリデータベースが作成される
db.insertInitialData();
const conn = db.conn;

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