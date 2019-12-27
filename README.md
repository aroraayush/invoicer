## **Invoicer -Invoicing Solution:**

A web application for small business owners and freelancers needing a simple and professional invoicing solution.

## Starting the project
Create a schema in your MySQL instance called `invoicing`
Create tables from `sqlQueries.sql` in the same order as provided in file.

#### Setting up Config
In default.json in config folder in api, change the values of `dbname` to `invoicing` and `host`, `user` and `password` to your corresponding database hostname, usermane and password

In .env in app, replace the values of PORT, API_URL and API_PORT with Server Port, API server hostname, API server port number. 
`dbname` to `invoicing` and `host`, `user` and `password` to your corresponding database hostname, usermane and password

Download and install NodeJS from `https://nodejs.org/en/download/`

#### Testing on Dev Environment
To start the server, goto api directory in terminal and run `npm install` and `npm run dev`

To start the front-end, goto app directory in terminal and run `npm install` and `npm run dev`

#### Working on Production environment Environment
Install `forever` CLI tool for ensuring that servers are always running and create logs by running `npm install -g forever`

To start the server, goto `api` directory in terminal and run `npm install` and then
 `forever start --minUptime 1000 --spinSleepTime 1000 app.js`

To start the server, goto `app` directory in terminal and run `npm install` and then
 `forever start --minUptime 1000 --spinSleepTime 1000 app.js`

### Working with Project
Open your browser and open page `localhost:4000/` (default page)
If you have changed port number in .env in app, replace 4000 in above URL with your own port

Register a user, if it is your first time working with the web application
Login with the registered Username (mobile) and Password 


## Core features

- Basic user login/registration flow

- Storing new products, viewing existing ones

- Store customer details, viewing existing customer details

- PDF invoice generation with a unique Id, View already generated invoices

## Optional Features

- Server-side validations for required body parameters sent in the request to the server
- Bar-code generation for each invoice to easily access the invoices data later on
- Sending invoice to the customer email via button click on the web site (Gmail API will be used)

**Endpoints:**

| **Endpoint** | **Request Type** |   | **Body Params** |
| --- | --- | --- | --- |
| /register | POST | Registering new user | `name`, `mobile` (username), `password`, `email`, `company_name`,`company_website` |
| /login | POST | Signing In new user | `mobile` (username), `password` |
| /customer | POST | Create new customer | `name`, `mobile` , `email`, `company_name`,`company_website` |
| /customer/{id} | GET | Showing a customer details | Id (customer\_id) |
| /product | POST | Create new product | `name`, `label` , `description`, `Rate `,`msp`,`unique_code` |
| / product/{id} | GET | Showing a product details | id (product\_id) |
| /invoice/{user\_id}/{ customer\_id} | GET | Showing an invoice for a user and a customer | user\_id, customer\_id |

## Languages &amp; Tools

Front-end- ExpressJS / HTML5, jQuery 3, Bootstrap 3, CSS

Backend- NodeJS/ Express

Database - MySQL 8

> Libraries Used-

**Font Awesome (icon)** - `https://fontawesome.com/v4.7.0/`

**Datatable** - `https://datatables.net/`

> Running the API

To run the API, Goto api folder, open terminal in directory and type `npm run start`

> Running the APP

To run the APP, Goto app folder, open terminal in directory and type `npm run start`

> Generated Invoice
![Screen Shot 2019-12-27 at 12 32 18 PM](https://user-images.githubusercontent.com/23554810/71531752-fba71480-28a4-11ea-9d7a-bc72b2e535ab.png)

