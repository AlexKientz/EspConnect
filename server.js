console.log("Starting...")
const express = require('express');
const dotenv = require('dotenv');
var mysql = require('mysql2');
const connection = require('express-myconnection');
dotenv.config();

const app = express();
const port = process.env.PORT;

var con = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

con.connect(function(err){
    if (err) throw err; 
    console.log("MYSQL Connected")
})

app.get('/api/register', function(req, res){
    const { name, email, password } = req.query
    con.query('SELECT email FROM users WHERE email = ?', [email], (error, results) => {
        if(error){
            console.log(error);
        }
        if(results.length > 0){
            res.send("Email is already registred")
        } else {
            con.query("INSERT INTO `users` (`email`, `name`, `password`) VALUES ('" + email + "','" + name + "','" + password + "');"), (error, results) => {
                if(error){
                    console.log(error);
                } else {
                    res.send("Account created");
                }
            }
        }
    })
});

app.get('/api/login', function(req, res){
    const { email, passwd } = req.query
    con.query('SELECT password FROM users WHERE email = ?', [email], (error, results) => {
        if(results.length > 0){
            if(results[0].password == passwd){
                res.send("Welcome On EspConnect API.")
            }
        }
    })
})

app.get('/api/device/register', function(req, res){
    const { email, name } = req.query

    const default_state = false;

    con.query('SELECT name FROM devices WHERE email_user = ?', [email], (error, results) => {
        if(error){
            console.log(error);
        }
        if(results.length > 0){
            res.send("Device is already registred")
        } else {
            con.query("INSERT INTO `devices` (`name`, `email_user`, `status`) VALUES ('" + name + "','" + email + "','" + default_state + "');"), (error, results) => {}
            res.send("Device registred");
        }
    })
})

app.get('/api/device/login', function(req, res){
    const { email, password } = req.query

    con.query('SELECT password FROM users WHERE email = ?', [email], (error, results) => {
        if(results.length > 0){
            if(results[0].password == password){
                res.send("connected")
            } else {
                res.send("Email/Password is not valid.")
            }
        }
    })
})

app.get('/api/device/set_status', function(req, res){
    const { email, password, device, status } = req.query

    con.query('SELECT password FROM users WHERE email = ?', [email], (error, results) => {
        if(results.length > 0){
            if(results[0].password == password){
                // CONNECTED
                
                if(status == "false"){
                    con.query("UPDATE devices SET status = '" + status + "' WHERE name = '" + device + "' AND email_user = '" + email + "';"), (error, results) => {}
                    res.send("Status: " + status)
                } else if (status == "true") {
                    con.query("UPDATE devices SET status = '" + status + "' WHERE name = '" + device + "' AND email_user = '" + email + "';"), (error, results) => {}
                    res.send("Status: " + status)
                } else {
                    res.send("Invalid command")
                }
            } else {
                res.send("Email/Password is not valid.")
            }
        }
    })
})

app.get('/api/device/get_status', function(req, res){
    const { email, password, device } = req.query;

    const status = "not define"

    con.query('SELECT password FROM users WHERE email = ?', [email], (error, results) => {
        if(results[0].password == password){
            con.query('SELECT status FROM devices WHERE email_user = ? AND name = ?', [email, device], (error, r) => {
                res.send(r[0].status)
            })
            
        }
    })
})

app.get('/test', function(req, res){
    const { test } = req.query;

    res.send(test)
})
  
app.listen(port);
console.log('Server started at http://localhost:' + port); 