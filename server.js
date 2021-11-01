const express = require("express");
const bodyParser = require("body-parser");

// var upload = multer();
const app = express();
const sql = require("./app/models/db.js");
// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(upload.array()); 
app.use(express.static('public'));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})


app.get("/", (req, res) => {
  res.json({ message: "Look like your server is working! " });
});

app.get("/uploaded", (req, res) => {
  res.json({ message: "Look like your it's working! " });
});

require("./app/routes/customer.routes.js")(app);
require("./app/routes/product.routes.js")(app);



const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './public/upload')
  },

  filename: function (res, file, callback) {
    callback(null, file.originalname)
  }
});

const multerSigleUpload = multer({
  storage: storage
});
app.use('/upload', express.static('public'));


// app.post("/singleFile", multerSigleUpload.single('singleImage'), function (req, res) {
//   const file = req.file
//   const body = req.body
//   req.app.locals.uploadStatus = true;
//   res.redirect('/uploaded');
// });

app.post('/formdataupload', multerSigleUpload.single('profile'), function (req, res) {
  console.log('file received');
  console.log(req);
  var db = "INSERT INTO `product`(`product_name`, `band_name`, `price`,`product_des`,`image`) VALUES ('" + req.body.product_name + "', '" + req.body.band_name + "', '" + req.body.price + "','" + req.body.product_des + "','" + req.file.originalname + "')";
  sql.query(db, function (err, result) {
    console.log('inserted data');
    console.log(db);
    console.log(result);
  });
  res.redirect('/uploaded');
});

app.post('/formdatausersupload', multerSigleUpload.single('profile') ,function (req, res) {
  console.log('file received');
  console.log(req);
  var db = "INSERT INTO `user` (`emailaddress`, `password`, `name`,`phonenumber`,`DOB`,`address`,`role`) VALUES ('" + req.body.emailaddress + "', '" + req.body.password + "', '" + req.body.name + "','" + req.body.phonenumber + "','" + Date.now() + "','" + req.body.address + "','" + req.body.role + "')";
  sql.query(db, function (err, result) {
    console.log('inserted data');
    console.log(db);
    console.log(result);
  });
  res.redirect('/uploaded');
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
