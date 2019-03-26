// 'use strict'
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express();

// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server
var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port http://localhost:3000", port);
});

//Initiallising connection string
var dbConfig = {
    user: "sa",
    password: "ultravga1280",
    server: "localhost",
    database: "baza4"
};

//Function to connect to database and execute query
var executeQuery = function (res, query) {
    sql.connect(dbConfig, function (err) {
        if (err) {
            console.log("Error while connecting database :- " + err);
            res.send(err);
        }
        else {
            // create Request object
            var request = new sql.Request();
            // query to the database
            request.query(query, function (err, result) {
                if (err) {
                    console.log("Error while querying database :- " + err);
                    res.send(err);
                }
                else {
                    res.send(result);
                }
            });
        }
    });
}

//GET API
app.get("/api/product", function (req, res) {
    var query = `SELECT id, name, description, price FROM [Table_products];`;
    executeQuery(res, query);
});

//POST API Pagination
app.post("/api/products", function (req, res) {
    (async function () {
        try {
            let pool = await sql.connect(dbConfig)
            let result = await pool.request()
                .query(`SELECT id, name, description, price FROM [Table_products] ORDER BY id OFFSET ((${req.body.currentPage}- 1) * ${req.body.perPage}) ROWS FETCH NEXT ${req.body.perPage} ROWS ONLY;`)

            res.send(result);
        } catch (err) {
            console.log("Error : " + err);
            res.send(err);
        }
    })()

    sql.on('error', err => {
        // ... error handler
    })

});


//GET API by id
app.get("/api/product/:id", function (req, res) {
    var query = `SELECT id, name, description, price FROM [Table_products] WHERE id = ${req.params.id};`;
    executeQuery(res, query);
});

//POST API
app.post("/api/product", function (req, res) {
    (async function () {
        try {
            let pool = await sql.connect(dbConfig)
            let result = await pool.request()
                .input('name', sql.NVarChar, req.body.product.name)
                .input('description', sql.NVarChar, req.body.product.description)
                .query(`INSERT INTO [Table_products] (name, description, price) VALUES ( @name, @description, ${req.body.product.price});`)
            //.query(`INSERT INTO [Table_products] (name, description, price) VALUES ( '${req.body.product.name}','${req.body.product.description}',${req.body.product.price});`)

            res.send(result);

            // // Stored procedure            
            // let result2 = await pool.request()
            //     .input('input_parameter', sql.Int, value)
            //     .output('output_parameter', sql.VarChar(50))
            //     .execute('procedure_name')            
            // console.dir(result2)
        } catch (err) {
            console.log("Error : " + err);
            res.send(err);
        }
    })()

    sql.on('error', err => {
        // ... error handler
    })

});

//PUT API
app.put("/api/product/:id", function (req, res) {
    (async function () {
        try {
            let pool = await sql.connect(dbConfig)
            let result = await pool.request()
                .input('name', sql.NVarChar, req.body.product.name)
                .input('description', sql.NVarChar, req.body.product.description)
                .query(`UPDATE [Table_products] SET name=@name , description=@description , price=${req.body.product.price}  WHERE id= ${req.params.id};`)
            //.query(`UPDATE [Table_products] SET name='${req.body.product.name}' , description='${req.body.product.description}' , price=${req.body.product.price}  WHERE id=${req.params.id};`)

            res.send(result);
        } catch (err) {
            console.log("Error : " + err);
            res.send(err);
        }
    })()

    sql.on('error', err => {
        // ... error handler
    })
});

// DELETE API
app.delete("/api/product/:id", function (req, res) {
    var query = `DELETE FROM [Table_products] WHERE id=${req.params.id};`;
    executeQuery(res, query);
});

//GET API by mail
app.get("/api/users/:mail", function (req, res) {
    var query = `SELECT mail, password FROM [Table_users] WHERE mail = '${req.params.mail}';`;
    executeQuery(res, query);
});

passport.use(new LocalStrategy(
    {
        usernameField: 'mail',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, mail, password, done) {
        mail = mail.toLowerCase()
        let user = []
        var dbConn = new sql.Connection(dbConfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.query(`SELECT mail FROM [Table_users] WHERE mail = '${mail}' AND password = '${password}';`).then(function (recordSet) {
                if (recordSet.length > 0) {
                    user.mail = recordSet[0].mail;
                }
                dbConn.close();
                return done(null, user)
            }).catch(function (err) {
                console.log(err);
                dbConn.close();
            });
        }).catch(function (err) {
            console.log(err);
        });

        return done(null, user)
    }
))

// POST API login
app.post("/api/login", function (req, res, next) {
    let response = {
        status: false
    }
    if (!req.body.mail) {
        response.error = 'Email can\'t be blank'
        return res.json(response)
    }
    if (!req.body.password) {
        response.error = 'Password can\'t be blank'
        return res.json(response)
    }
    passport.authenticate('local', {}, async function (err, user, info) {
        if (err) {
            return next(err)
        }
        let user1 = await outputUser(user);
        if (user1.mail !== undefined) {
            // user1.lastloginAt = Date.now()
            //req.session.user = user1
            response.status = true
            response.user = user1
            return res.json(response)
        }
    })(req, res, next)

    async function outputUser(user) {
        return {
            mail: user.mail
        }

    }
});