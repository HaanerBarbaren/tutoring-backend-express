// Imports
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const app = express();

const PORT = 5000;
dotenv.config();
app.use(cors());

// Daten aus der .env Datei
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;

// Datenbank einstellen
const db = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database,
});

// Verbinden
db.connect((err: any) => {
  if (err) console.log(err);
  else console.log("Connected to database!");
});

app.get("/", (req: any, res: any) => {
  res.send("...");
});

// Nachhilfelehrer finden
app.get("/find", (req: any, res: any) => {
  const { subject, grade } = req.body;
  let sqlCommand: string = `SELECT * FROM angebote WHERE subject = ('${subject}') AND grade >= ('${grade}')`;
  db.query(sqlCommand, (err: any, results: any) => {
    if (err) return res.send(err);
    return res.json({ data: results });
  });
});

const checkIfEmailIsValid = (email: string): boolean => {
    if (email.split("@")[1] === "gymhaan.de" && email.split("@")[0].split(".")[0].length > 0 && email.split("@")[0].split(".")[1].length > 0) return true;
    return false;
}

// Account erstellen
app.post("/user/create", (req: any, res: any) => {
    const {email} = req.body;
    
    if (!checkIfEmailIsValid(email)) return res.send({msg: "Invalide E-Mail"});
    
    let sqlCommand: string = `INSERT INTO users (email) VALUES('${email}')`;
    db.query(sqlCommand, (err: any) => {
        if (err) return res.send(err);
        return res.send({msg: "Account wurde erstellt", code: 200})
    })

    // TODO: hash oder so erzeugen fuers verifizieren
});

// Account verifizieren
app.post("/user/verify", (req: any, res: any) => {
    const {email, hash} = req.body;
    let sqlCommand = `UPDATE users SET authorized = 1 WHERE email = '${email}' AND hash = '${hash}'`;
    db.query(sqlCommand, (err: any) => {
        if (err) return res.send(err);
        return res.send({msg: "Account wurde verifiziert", code: 200});
    })
})


app.listen(8080, () => console.log("server running on port 8080"));
