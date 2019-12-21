const config = require('config');
const mysql = require("mysql");
const assert = require('assert');
const AssertionError = assert.AssertionError;
const {compareSync, hashSync} = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "BN93RYK3HTYOCPG0GBS8";

const connectionPool = mysql.createPool({
    host: config.get('database.host'),
    user: config.get('database.user'),
    password: config.get('database.password'),
    database: config.get('database.dbname'),
    connectionLimit: 2
});

class User {
    /**
     * It stores a new user data in the DB
     * @param req request object
     * @param res response object
     */
    addUser(req, res) {

        try {
            assert(req.body.name, 'Name is required');
            assert(req.body.mobile, 'Mobile is required');
            assert(req.body.password, 'Password is required');
            assert(req.body.confirmPassword, 'Confirm Password is required');
            assert(req.body.companyName, 'Company Name is required');
            assert(req.body.type_id, 'User Type is required');
            assert(req.body.company_address, 'Company Address is required');

            assert.strictEqual(req.body.password, req.body.confirmPassword, "Password and Confirm Password don't match");

            let name = req.body.name;
            let mobile = req.body.mobile;
            let password = req.body.password;
            let companyName = req.body.companyName;
            let company_website = req.body.company_website ? req.body.company_website : "";;
            let type_id = req.body.type_id;
            let company_address = req.body.company_address;
            let email = req.body.hasOwnProperty('email') ? req.body.email : "";

            const hashedPassword = hashSync(password, 10);  // 10 - number of rounds

            connectionPool.query(`INSERT IGNORE into invoicer.user(name, mobile, password, company_name, 
       company_website, email,type_id,company_address) VALUES(?,?,?,?,?,?,?,?)`, [
                name, mobile, hashedPassword, companyName, company_website, email, type_id,company_address], function (error, result, fields) {
                if (error) {
                    res.status(500).send({
                        status: "error",
                        code: error.code,
                        message: error.sqlMessage
                    });
                } else if (result.insertId > 0) {
                    res.status(200).send({
                        status: "success",
                        data: "",
                        message: "User added successfully"
                    });
                } else {
                    res.status(500).send({
                        status: "error",
                        message: "A user with same mobile number already exists"
                    });
                }
            });
        } catch (e) {
            if (e instanceof AssertionError) {
                console.log(req.url, "-", __function, "-", "AssertionError : ", e.message);
                res.status(500).send({
                    status: "AssertionError",
                    message: e.message
                });
            } else {
                console.log(req.url, "-", __function, "-", "Error : ", e.message);
                res.status(500).send({
                    status: "error",
                    message: e.message
                });
            }
        }
    }

    /**
     * This function allows login operation
     * @param req request object
     * @param res response object
     * @return Returns the user data if username and password, returns error type & message in case of error
     */
    loginUser(req, res) {
        try {

            assert(req.body.username, 'Username is required');
            assert(req.body.password, 'Password is required');

            let username = req.body.username;
            let password = req.body.password;

            connectionPool.query(`SELECT id,password FROM invoicer.user where mobile = ?`, username,
                function (error, result, fields) {
                    if (error) {
                        res.status(500).send({
                            status: "error",
                            code: error.code,
                            message: error.sqlMessage
                        });
                    } else {
                        if (result.length > 0) {

                            // Matching Password
                            if (compareSync(password, result[0].password)) {
                                // Passwords matched

                                // create a JWT token
                                const token = jwt.sign({id: result.id}, JWT_SECRET, {
                                    expiresIn: 86400 // expires in 24 hours
                                });
                                connectionPool.query(`UPDATE invoicer.user SET auth_token = ? , expiry_time = (SELECT DATE_ADD(NOW(), INTERVAL 24 HOUR)) WHERE id = ?`, [token, result[0].id], function (error2, result2, fields2) {
                                    if (error) {
                                        res.status(500).send({
                                            status: "error",
                                            code: error.code,
                                            message: error.sqlMessage
                                        })
                                    } else {
                                        res.header('auth-token', token);
                                        res.status(200).send({
                                            status: "success",
                                            data:token,
                                            message: "Login successful"
                                        });
                                    }
                                })
                            } else {
                                res.status(401).send({
                                    status: "error",
                                    message: "Incorrect Password"
                                });
                            }
                        } else {
                            res.status(422).send({
                                status: "error",
                                message: "Username not registered"
                            });
                        }
                    }
                });
        } catch (e) {
            if (e instanceof AssertionError) {
                console.log(req.url, "-", __function, "-", "AssertionError : ", e.message);
                res.status(500).send({
                    status: "AssertionError",
                    message: e.message
                });
            } else {
                console.log(req.url, "-", __function, "-", "Error : ", e.message);
                res.status(500).send({
                    status: "error",
                    message: e.message
                });
            }
        }
    }

    /**
     * This function signs the user out of the application.
     * @param req request object
     * @param res response object
     * @return Returns logout message
     */
    logoutUser(req, res) {
        connectionPool.query(`UPDATE invoicer.user SET auth_token = ? WHERE id = ?`, ["", req.user_id], function (error2, result2, fields2) {
            if (error2) {
                res.status(500).send({
                    status: "error",
                    code: error2.code,
                    message: error2.sqlMessage
                })
            } else {
                res.status(200).send({
                    status: "success",
                    message: "Logged out successfully"
                });
            }
        })
    }

    /**
     * This function check if the auth_token is valid or not
     * @param req request object
     * @param res response object
     * @return Returns error if auth token invalid else lets the flow control to execute
     */
    authenticateToken(req, res, next) {
        const token = req.headers['authorization'];
        try {
            connectionPool.query(`SELECT id, expiry_time FROM invoicer.user where auth_token = ?;`, token, function(error, result, fields) {
                if (error) {
                    res.status(500).send({
                        status: "error",
                        code: error.code,
                        message: error.sqlMessage
                    });
                } else if(result.length > 0){
                    req.user_id = result[0].id;
                    next();
                }
                else {
                    res.status(401).send({
                        status: "error",
                        err_code: "UNAUTHORIZED",
                        message: "User is not logged in"
                    });
                }
            });
        }
        catch (e) {
            res.status(400).send({
                status: "error",
                err_code: "TOKEN_EXPIRED",
                message: "User is not logged in"
            });
        }
    }
}

module.exports = User;
