const config = require('config');
const mysql = require("mysql");
const assert = require('assert');
const AssertionError = assert.AssertionError;

const connectionPool = mysql.createPool({
    host: config.get('database.host'),
    user: config.get('database.user'),
    password: config.get('database.password'),
    database: config.get('database.dbname'),
    connectionLimit: 2,
    multipleStatements: true,
});

class Invoice {

    /**
     * This methods inserts a new invoice data to the DB
     * @param req request object
     * @param res response object
     * @return Returns error if error inserting invoice data, else return success message
     */
    addInvoice(req, res) {
        try {
            assert(req.body.inv_number, "Invoice Number is required");
            assert(req.body.customer_id, "Customer Name is required");
            assert(req.body.inv_date, "Invoice Date is required");
            assert(req.body.due_date, "Due Date is required");
            assert(req.body.total_amt, "Total Amount is required");
            assert(req.body.due_amt, "Due Amount is required");
            assert(req.body.products, "Please select atleast one product");

            const columnList = ['inv_number', 'customer_id', 'inv_date', 'due_date', 'total_amt', 'due_amt', 'user_id'];
            const columnValuesList = ['?', '?', '?', '?', '?', '?', '?'];
            const columnValues = [req.body.inv_number, req.body.customer_id, req.body.inv_date, req.body.due_date, req.body.total_amt, req.body.due_amt, req.user_id];

            if (req.body.hasOwnProperty('state_id')) {
                columnList.push('state_id');
                columnValues.push(req.body.state_id);
                columnValuesList.push('?');
            }
            if (req.body.hasOwnProperty('tax_val')) {
                columnList.push('tax_val');
                columnValues.push(req.body.tax_val);
                columnValuesList.push('?');
            }
            if (req.body.hasOwnProperty('discount')) {
                columnList.push('discount');
                columnValues.push(req.body.discount);
                columnValuesList.push('?');
            }
            if (req.body.hasOwnProperty('shipping_charge')) {
                columnList.push('shipping_charge');
                columnValues.push(req.body.shipping_charge);
                columnValuesList.push('?');
            }
            if (req.body.hasOwnProperty('prepaid_amt')) {
                columnList.push('prepaid_amt');
                columnValues.push(req.body.prepaid_amt);
                columnValuesList.push('?');
            }
            if (req.body.hasOwnProperty('notes')) {
                columnList.push('notes');
                columnValues.push(req.body.notes);
                columnValuesList.push('?');
            }
            if (req.body.hasOwnProperty('terms')) {
                columnList.push('terms');
                columnValues.push(req.body.terms);
                columnValuesList.push('?');
            }

            connectionPool.query(`INSERT INTO invoicer.invoice (${columnList.join(', ')}) VALUES 
                                (${columnValuesList.join(', ')});`, columnValues, function (error, result, fields) {
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        res.status(422).send({
                            status: "error",
                            message: "Invoice with this Order Number already exists"
                        });
                    } else {
                        res.status(500).send({
                            status: "error",
                            code: error.code,
                            message: error.sqlMessage
                        });
                    }
                } else if (result.insertId > 0) {
                    let columnValuesStr = "";
                    req.body.products.forEach(data => {
                        columnValuesStr += ` (${result.insertId},${data.product_id},${data.quantity},${data.rate}),`
                    });
                    columnValuesStr = columnValuesStr.slice(0, -1);
                    connectionPool.query(`INSERT INTO invoicer.invoice_product (invoice_id,product_id,quantity,rate) VALUES 
                                    ${columnValuesStr};`, function (error, result, fields) {
                        if (error) {
                            if (error.code === 'ER_DUP_ENTRY') {
                                res.status(422).send({
                                    status: "error",
                                    message: "Invoice with this Product already exists"
                                });
                            } else {
                                res.status(500).send({
                                    status: "error",
                                    code: error.code,
                                    message: error.sqlMessage
                                });
                            }
                        } else if (result.insertId > 0) {
                            res.status(200).send({
                                status: "success",
                                data: "",
                                message: "Invoice added successfully"
                            });
                        } else {
                            res.status(422).send({
                                status: "error",
                                message: "Invoice with this product already exists"
                            });
                        }
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
     * This function returns all the invoices of a user
     * @param req request object
     * @param res response object
     * @return Returns the list of invoices if they exists else returns blank result with 204 statuscode.
     *         Returns error type & message in case of error
     */
    getInvoices(req, res) {
        try {
            assert(req.user_id, 'User Id not found');

            connectionPool.query(`SELECT cst.name customer_name,
                                         inv.id,
                                         inv.due_amt,
                                         inv.inv_number,
                                         inv.inv_date,
                                         inv.due_date,
                                         inv.created_on
                                  FROM invoicer.invoice inv,
                                       invoicer.customer cst
                                  WHERE inv.customer_id = cst.id
                                    AND inv.user_id = ?`, req.user_id,
                function (error, result, fields) {
                    if (error) {
                        res.status(500).send({
                            status: "error",
                            code: error.code,
                            message: error.sqlMessage
                        });
                    } else {
                        if (result.length > 0) {
                            res.status(200).send({
                                status: "success",
                                data: result,
                                length: result.length
                            });
                        } else {
                            res.status(204).send();
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
     * This function returns a single invoice as per the invoice id
     * @param req request object
     * @param res response object
     * @return Returns a invoice if it exists. Returns error in case of error
     */
    getInvoice(req, res) {
        try {
            assert(req.params.invoice_id, 'Invoice Id not provided');
            assert(req.user_id, 'User not logged in');

            connectionPool.query(`SELECT inv.*, ip.*, pr.name product_name, cst.name customer_name, cst.email customer_email, cst.company_name customer_company_name, usr.mobile user_mobile,usr.email user_email,usr.name user_name,usr.company_name user_company_name,usr.company_address user_company_address
                                  FROM invoicer.invoice inv, invoicer.invoice_product ip, invoicer.product pr, invoicer.customer cst, invoicer.user usr
                                  where inv.id = ip.invoice_id and pr.id = ip.product_id and inv.customer_id = cst.id and usr.id = inv.user_id and  inv.id = ? and inv.user_id = ?;`,
                [req.params.invoice_id, req.user_id], function (error, result, fields) {
                    if (error) {
                        res.status(500).send({
                            status: "error",
                            code: error.code,
                            message: error.sqlMessage
                        });
                    } else {
                        if (result.length > 0) {
                            delete result[0]['user_id'];
                            res.status(200).send({
                                status: "success",
                                data: result[0],
                                length: result.length
                            });
                        } else {
                            res.status(204).send();
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
     * This function deletes a single invoice as per the invoice id
     * @param req request object
     * @param res response object
     * @return Returns true if invoice deleted successfully. Returns error in case of error
     */
    deleteInvoice(req, res) {
        try {
            assert(req.params.id, 'Invoice Id not provided');
            assert(req.user_id, 'User not logged in');

            connectionPool.query(`DELETE
                                  FROM invoicer.invoice
                                  where id = ?
                                    and user_id = ?`,
                [req.params.id, req.user_id], function (error, result, fields) {
                    if (error) {
                        res.status(500).send({
                            status: "error",
                            code: error.code,
                            message: error.sqlMessage
                        });
                    } else {
                        if (result.affectedRows > 0) {
                            res.status(200).send({
                                status: "success",
                                data: result[0],
                                length: result.length
                            });
                        } else {
                            res.status(204).send();
                        }
                    }
                });
        } catch (e) {
            console.log(req.url, "-", __function, "-", "Error : ", e.message);
            res.status(500).send({
                status: "error",
                message: e.message
            });
        }
    }
}

module.exports = Invoice;
