## **Invoicer -Invoicing Solution:**

A web application for small business owners and freelancers needing a simple and professional invoicing solution.
## Core features

- User authentication (jwt) for security

- Storing / Viewing products & customers and linking them

- PDF invoice generation, & printing, Managing already generated ones

###### Generated Invoice
![Screen Shot 2019-12-27 at 12 32 18 PM](https://user-images.githubusercontent.com/23554810/71531752-fba71480-28a4-11ea-9d7a-bc72b2e535ab.png)


## WIP Features
- Bar-code generation for each invoice to easily access the invoices data later on
- Gmail API Integaration (Sending invoice to the customer email via button click)

## Languages &amp; Tools

Front-end- ExpressJS / HTML5, jQuery 3, Bootstrap 3, CSS

Backend- NodeJS/ Express

Database - MySQL 8

> Libraries Used-

**Font Awesome (icon)** - `https://fontawesome.com/v4.7.0/`

**Datatable** - `https://datatables.net/`

--

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

> Running the API

To run the API, Goto api folder, open terminal in directory and type `npm run start`

> Running the APP

To run the APP, Goto app folder, open terminal in directory and type `npm run start`
