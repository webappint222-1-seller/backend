const express = require("express");
const bodyParser = require("body-parser");
// var upload = multer();
const cors = require('cors');
const app = express();
const sql = require("./app/models/db.js");
const cookieParser = require('cookie-parser')
const router = express.Router();
const { signupValidation, loginValidation } = require("./app/models/validation.js");
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(upload.array()); 
app.use(express.static('public'));
app.use(cors());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})
const corsOptions = {
  origin: 'http://localhost:8080',
  credentials: true,
};
app.use(cookieParser())
app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.json({ message: "Look like your server is working! " });
});
app.get("/uploaded", (req, res) => {
  res.json({ message: "Look like your it's working! " });
});

require("./app/routes/customer.routes.js")(app);
require("./app/routes/product.routes.js")(app);
// require("./router.js")(app);



const multer = require('multer');

const suff = Date.now();

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './public/upload')
  },

  filename: function (res, file, callback) {
    
      callback(null, suff + ".png")

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

app.post('/formdataupload', multerSigleUpload.single('image'), function (req, res) {
  console.log('file received');
  console.log(req);
  var db = "INSERT INTO `product`(`product_name`, `band_name`, `price`,`product_des`,`image`) VALUES ('" + req.body.product_name + "', '" + req.body.band_name + "', '" + req.body.price + "','" + req.body.product_des + "','" + suff + ".png" + "')";
  sql.query(db, function (err, result) {
    console.log('inserted data');
    console.log(db);
    console.log(result);
  });
  res.redirect('/');

  // app(req, res, function (err) {
  //   if (!req.file) {
  //     var db = "INSERT INTO `product`(`product_name`, `band_name`, `price`,`product_des`,`image`) VALUES ('" + req.body.product_name + "', '" + req.body.band_name + "', '" + req.body.price + "','" + req.body.product_des + "','" + "404.png" + "')";
  //     sql.query(db, function (err, result) {
  //       console.log('inserted data');
  //       console.log(db);
  //       console.log(result);
  //     });
  //   }
  //   var db = "INSERT INTO `product`(`product_name`, `band_name`, `price`,`product_des`,`image`) VALUES ('" + req.body.product_name + "', '" + req.body.band_name + "', '" + req.body.price + "','" + req.body.product_des + "','" + suff + ".png" + "')";
  //   sql.query(db, function (err, result) {
  //     console.log('inserted data');
  //     console.log(db);
  //     console.log(result);
  //   });

  // })
  // res.redirect('/');

});

app.put('/productupdate/:productId', multerSigleUpload.single('image'), function (req, res, next) {
  console.log('file received');
  console.log(req);
    var db2 = "UPDATE product SET `product_name` = '" + req.body.product_name + "', `band_name` = '" + req.body.band_name + "' , `price` = '" + req.body.price + "',product_des = '" + req.body.product_des + "',image = '"+ suff + ".png"+ "' WHERE product_id = '" + req.params.productId + "'"
    sql.query(db2, function (err, result2) {
      console.log('inserted data');
      console.log(db2);
      console.log(result2);
    });
  res.redirect('/');
});

app.post('/formdatausersupload', loginValidation, multerSigleUpload.single('image'), function (req, res) {
  console.log('file received');
  console.log(req);
  var asd = "SELECT emailaddress FROM user where emailaddress = '" + req.body.emailaddress + "'"
  sql.connect((err) => {
    sql.query(asd, function (err, result) {
      if (result == 0) {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          var db1 = "INSERT INTO user (`emailaddress`, `password`, `name`,`phonenumber`,`DOB`,`address`,`role`) VALUES ('" + req.body.emailaddress + "', '" + hash + "', '" + req.body.name + "','" + req.body.phonenumber + "','" + req.body.dob + "','" + req.body.address + "','" + 2 + "')";
          sql.query(db1, function (err, result1) {
            console.log("pass");
          });
        });
      } 
    })
  });

  // bcrypt.hash(req.body.password, 10, function (err, hash) {
  //   var db1 = "INSERT INTO user (`emailaddress`, `password`, `name`,`phonenumber`,`DOB`,`address`,`role`) VALUES ('" + req.body.emailaddress + "', '" + hash + "', '" + req.body.name + "','" + req.body.phonenumber + "','" + req.body.dob + "','" + req.body.address + "','" + 2 + "')";
  //   sql.query(db1, function (err, result1) {
  //     console.log('inserted data');
  //     console.log(db1);
  //     console.log(result1);
  //   });
  // });
  res.redirect('/');
});

app.post('/login',  multerSigleUpload.single('image'), function (req, res) {
  console.log('file received');
  console.log(req);
  var db = "SELECT * FROM user where emailaddress = '" + req.body.emailaddress + "'"
  sql.connect((err) => {
    sql.query(db, function (err, result1) {
      bcrypt.compare(req.body.password, result1[0].password, function (err, result) {
        if (result == true) {
          var token = jwt.sign({id:result1[0].user_id},'secrect',{ expiresIn: '1h' });
          console.log(token);
          res.cookie('jwt' , token , {maxAge: 900000, httpOnly: true} );
          res.status(200).json("pass");
        } else{
          return res.status(401).json("email or password is wrong")
        }
        
      });
      

    });
  });
 
  // bcrypt.compare(req.body.password, "$2a$10$VD53K9UoFs6UdhTdh7Y/9.2VAQmnqwmlJd506.mrAdIJT1BKSpknm", function (err, result) {
  //   if(result == true){
  //     var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
  //     console.log(token);
  //   }
  // });


});

app.put('/userupdate/:userId', multerSigleUpload.single('image'), function (req, res) {
  console.log('file received');
  console.log(req);
  var db4 = "UPDATE user SET `password` = '" + req.body.password + "' WHERE user_id = '" + req.params.userId + "'"

  sql.query(db4, function (err, result4) {
    console.log('inserted data');
    console.log(db4);
    console.log(result4);
  });
  res.redirect('/');
});


// app.post('/register' , multerSigleUpload.single('image'), function(req, res)  {
//   bcrypt.hash(req.body.password, 10,function(err,hash){
//     var db6 = "INSERT INTO user (name, emailaddress, password, phonenumber, DOB, address, role) VALUES ("+ req.body.name +", "+req.body.emailaddress+","+ req.body.password +","+req.body.phonenumber+","+req.body.dob+","+req.body.address+",'buyer')"
//     sql.query(db6,function (err, result) {
//       console.log('inserted data');
//       console.log(db6);
//       console.log(result);

//     });
//   });
//   var db5 = "SELECT * FROM users WHERE LOWER(emailaddress) = LOWER("+req.body.emailaddress+");"
//   res.redirect('/');
// });



app.get('/getuser', multerSigleUpload.single('image'), (req, res, next) => {
 
  const theCookie = req.cookies['jwt'];
  const decoded = jwt.verify(theCookie, 'secrect');
  if(!decoded){
    return res.status(401).send("unauthebtucated")
  }
  sql.query('SELECT * FROM user where user_id=?', decoded.id, function (error, results, fields) {
    if (error) throw error;
    res.send({  data: results[0], message: 'Fetch Successfully.' });
  });
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
