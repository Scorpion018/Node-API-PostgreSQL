const express = require('express')
const bodyParser = require('body-parser')
const Pool = require('pg').Pool
var cors = require('cors')
var os = require('os')
var url = require("url");
const app = express()
const port = 3000

console.log(os.freemem())
console.log(os.totalMem())

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'api',
    password: 'newpass',
    port: 5432,
})

pool.connect((err) => {
    if (err) throw err;
    console.log("Connected to postgreSQL");
});

app.set("view engine", "ejs");
app.use(cors())
app.use(express.static("public"));
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get("/", (req, res) => {
    res.sendFile("./index.html", {
        root: __dirname,
    });
});

app.get("/error", (req, res) => {
  res.sendFile("./error.html", {
      root: __dirname,
  });
});

app.get('/users', (req, res) => {
    var sql = 'select * from users';
    pool.query(sql, (err, results) => {
        if (err) {
            throw err;
        } else {
            // res.status(200).json(results.rows)
                res.render("Main", {
                    path: results.rows,
                });
        }
    })
})

app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id)
    pool.query(`SELECT * FROM users WHERE id =${id}`, (err, results) => {
        if (err) {
            throw err;
        } else {
            res.render("Main", {
                path: results.rows,
            });
        }
    })
})

app.get('*', function(req, res) {
  res.redirect('/error');
});

// app.get('/users/:id', (req, res) => {
//     const id = parseInt(req.params.id)
//     const { name, email } = req.body
//     pool.query(`UPDATE users SET name = ${name}, email = ${email} WHERE id = ${id}`, (err, results) => {
//         if (err) {
//             throw err;
//         } else {
//             response.status(200).send(`User modified with ID: ${id}`)
//             res.render("Main", {
//                 path: results.rows,
//             });
//         }
//     })
// })

// app.post('/users', db.createUser)
// app.delete('/users/:id', db.deleteUser)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})