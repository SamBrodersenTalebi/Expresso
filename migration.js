//import sqlite3 
const sqlite3 = require('sqlite3');

//open database.sqlite file as sqlite3 database object
const db = new sqlite3.Database('./database.sqlite');

//create Employee table if it doesn't exist 
//run the file by running node migration.js in terminal
db.serialize(()=>{
    db.run(`DROP TABLE IF EXISTS Employee`);
    db.run(`CREATE TABLE Employee   (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        wage INTEGER NOT NULL,
        is_current_employee INTEGER DEFAULT 1
    )`);
});