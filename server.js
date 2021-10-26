const express = require("express");
const bodyParser = require("body-parser");

// var upload = multer();
const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(upload.array()); 
app.use(express.static('public'));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})


app.get("/", (req, res) => {
  res.json({ message: "Look like your server is working! " });
});

require("./app/routes/customer.routes.js")(app);
require("./app/routes/product.routes.js")(app);



const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(request,file,callback){
    callback(null,'./app/upload/images')
  },

  filename: function(res,file,callback){
    callback(null,Date.now()+ file.originalname)
  }
});

const multerSigleUpload = multer({
  storage: storage
});



//route for single file upload
app.post("/singleFile", multerSigleUpload.single('singleImage'), function(req, res) {
    const file = req.file
    if (!file) {
        return res.end("Please choose file to upload!");
    }
    req.app.locals.uploadStatus = true;
    res.redirect('/');
});



const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
