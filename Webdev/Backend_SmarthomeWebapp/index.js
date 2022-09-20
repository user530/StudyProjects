// Express
const express = require(`express`);
const app = express();

// Body-parser
const parser = require(`body-parser`);

// Cookie-parser
const cookieParser = require(`cookie-parser`);

// Mysql
const mysql = require(`mysql`);

// Express sanitizer
const sanitizer = require(`express-sanitizer`);

// MD5
const md5 = require(`md5`);

// Setup body-parser
app.use(parser.urlencoded({ extended: true }));

// Setup cookie-parser
app.use(cookieParser(`cookie key`));

// Setup express sanitizer
app.use(sanitizer());

// Connect public resources (styles, images,etc)
app.use(express.static(__dirname + `/public`));

// Port
const port = 8089;

const dbconfig = {
  host: `localhost`,
  user: `root`,
  password: ``,
  database: `express_project`,
};

// Routing script
require(`./routes/main`)(app);

// Setup server
// Set template folder
app.set(`views`, `${__dirname}\\views`);
// Set rendering engine
app.set(`view engine`, `ejs`);
// Setup rendering engine to render html pages
app.engine(`html`, require(`ejs`).renderFile);
// Activate server
app.listen(port, () => {
  console.log(`Express server is up and running at port ${port}.`);
});

// Database connection function
function databaseConnection() {
  // Create connection / Recreate, because we can't reuse the old one
  let connection = mysql.createConnection(dbconfig);
  // Connect to database
  connection.connect((err) => {
    // Check for problems
    if (err) {
      // Signal connection problem
      console.error(`Problem with database connection!`, err.message);
      // Try to re-establish connection
      setTimeout(databaseConnection, 2000);
    }
    // Signal if case of success
    console.log(`Database connection established successfully.`);
  });

  // Error event handler
  connection.on(`error`, (err) => {
    // Signal error
    console.log(`Database connectiont error!`, err.message);
    // If connection was lost
    if (err.code === `PROTOCOL_CONNECTION_LOST`) {
      // try to recconect
      console.log(`Attempting to reconnect...`);
      databaseConnection();
    }
    // in case of other error
    else {
      // throw it
      throw err;
    }
  });

  // Make database available from everywhere
  global.db = connection;
}

// Initial database connection
databaseConnection();
