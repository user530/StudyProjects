// Express
const express = require(`express`);
const app = express();

// Body-parser
const bodyParser = require(`body-parser`);

// Cookie parser
const cookieParser = require(`cookie-parser`);

// Multer (file upload)
const multer = require(`multer`);

// Path (for file browsing)
const path = require(`path`);

// Port number
const port = 8087;

// Setup body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Setup JSON functionality
app.use(bodyParser.json());

// Setup static resources (CSS + IMG)
app.use(express.static(__dirname + `/public`));

// Prepare multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/public/img/recipes/`);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + path.extname(file.originalname));
  },
});

// Setup the multer
app.use(
  multer({
    storage: storage,
    limits: {
      fileSize: 50000000, // 500 kb file limit
    },
    fileFilter: (req, file, cb) => {
      const types = /jpeg|jpg|png|gif|webp/;
      const extNameTest = types.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mymTypeTest = types.test(file.mimetype);
      if (extNameTest && mymTypeTest) cb(null, true);
      else cb(`Error: Images only!`);
    },
  }).single(`recipe_img`)
);

// Setup cookie parser to work with cookies
app.use(cookieParser());

// Routing script
require(`./routes/main`)(app);

// Server setup
// Template folder
app.set(`views`, `${__dirname}\\views`);
// Rendering engine
app.set(`view engine`, `ejs`);
// Set rendering engine to render html pages
app.engine(`html`, require(`ejs`).renderFile);
// Activate server
app.listen(port, () => {
  console.log(`Server is up and running at port ${port}`);
});

// DB config
const dbConfig = require(`./config/configDB`).dbConfig;

// Connect to the database
require(`./core/functions`).dbConnection(dbConfig);
