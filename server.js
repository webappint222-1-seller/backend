const express = require("express");
const bodyParser = require("body-parser");
// var upload = multer();
const cors = require('cors');
const app = express();
const sql = require("./app/models/db.js");
const cookieParser = require('cookie-parser')
const { signupValidation, loginValidation } = require("./app/models/validation.js");
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const fs = require('fs');
// const https = require('https');
const status = require('http-status');
const ImgurStorage = require('multer-storage-imgur');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "https://www.utastore.team/");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // res.header('Access-Control-Allow-Credentials', true);
  next();
});
// const options = {
//   key: fs.readFileSync('etc/key.pem'),
//   cert: fs.readFileSync('etc/cert.pem')
// };

const whitelist = "https://www.utastore.team/";
const corsOptions = {
  origin: (origin, callback, res) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(status[401] + " you dont have right to enter this page")
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
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



const multer = require('multer');

const showDatepicker = (por) => {
  var por = Date.now() + ".png";
  return por;
};
console.log(showDatepicker());
app.get('/test', function (req, res, next) {
  console.log(showDatepicker());
});


// const storage = multer.diskStorage({
//   destination: function (request, file, callback) {
//     callback(null, './public/upload')
//   },
//   filename: function (res, file, callback) {
//     callback(null, suff + file.originalname)
//   }
// });

const multerSigleUpload = multer({
  storage: ImgurStorage({ clientId: 'e9e3586f3198f4e' })
});
app.use('/upload', express.static('public'));


app.post('/formdataupload', multerSigleUpload.single('image'), function (req, res) {
  if (!req.cookies['jwt']) {
    return res.status(401).send("must login")
  } else {
    const theCookie = req.cookies['jwt'];
    const decoded = jwt.verify(theCookie, 'secrect');
    if (!decoded) {
      return res.status(401).send("unauthebtucated")
    }
    sql.connect((err) => {
      sql.query('SELECT * FROM user where user_id=' + decoded.id, function (error, results) {
        if (results[0].role == 1) {
          var db = "INSERT INTO `product`(`product_name`, `band_name`, `price`,`product_des`,`image`) VALUES ('" + req.body.product_name + "', '" + req.body.band_name + "', '" + req.body.price + "','" + req.body.product_des + "','" +  req.file.link + "')";
          sql.query(db, function (err, result) {
            console.log('inserted data');
            console.log(db);
            console.log(result);
            console.log(req.file);
          });
        } else{ res.status(401).json({data: 0})}
      });
    });
  }
  res.redirect('/');
});




app.put('/productupdate/:productId', multerSigleUpload.single('image'), function (req, res, next) {
  var db = "UPDATE product SET `product_name` = '" + req.body.product_name + "', `band_name` = '" + req.body.band_name + "' , `price` = '" + req.body.price + "',product_des = '" + req.body.product_des + "',image = '" + req.file.link + "' WHERE product_id = '" + req.params.productId + "'"
  sql.query(db, function (err, result) {
    console.log(db);
    console.log(result);
    console.log(req.file.link);
  });
  res.redirect('/');
});

app.delete('/products/:productId', multerSigleUpload.single('image'), (req, res) => {
  var db = "delete from orderdetail_has_product where product_product_id='" + req.params.productId + "'"
  sql.query(db, function (err, result) {
    console.log(db);
    console.log(result);
  });
  var db1 = "delete from product where product_id='" + req.params.productId + "'"
  sql.query(db1, function (err, result) {
    console.log(db1);
    console.log(result);
  });
  res.redirect('/');
});

app.post('/formdatausersupload', signupValidation, multerSigleUpload.single('image'), function (req, res) {
  console.log('file received');
  console.log(req);
  var asd = "SELECT emailaddress FROM user where emailaddress = lower('" + req.body.emailaddress + "')"
  sql.connect((err) => {
    sql.query(asd, function (err, result) {
      if (result == 0) {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          var db1 = "INSERT INTO user (`emailaddress`, `password`, `name`,`phonenumber`,`DOB`,`address`,`role`) VALUES (LOWER('" + req.body.emailaddress + "'), '" + hash + "', '" + req.body.name + "','" + req.body.phonenumber + "','" + req.body.dob + "','" + req.body.address + "','" + 2 + "')";
          sql.query(db1, function (err, result1) {
            console.log("pass");
          });
        });
      } else {
        res.status(400).json("something when wrong");
      }
    })
  });
});



app.post('/login', multerSigleUpload.single('image'), function (req, res) {
  console.log('file received');
  console.log(req);
  var db = "SELECT * FROM user where emailaddress = lower('" + req.body.emailaddress + "')"
  sql.connect((err) => {
    sql.query(db, function (err, result1) {
      console.log(result1);
      if (result1[0] != null) {
        bcrypt.compare(req.body.password, result1[0].password, function (err, result) {
          if (result == true) {
            var token = jwt.sign({ id: result1[0].user_id }, 'secrect', { expiresIn: '1d' });
            console.log(token);
            console.log(result1);
            res.cookie('jwt', token, { maxAge: 24 * 60 * 60 * 1000 });
            res.status(200).json({data: 1});
          } else {
            res.status(401).json({data: 0})
          }
        });
      }
      else {
        res.status(401).json({data: 0})
      }
    });
  });
});

// app.get('/getalluser', multerSigleUpload.single('image'), function (req, res) {
//   // if (!req.cookies['jwt']) {
//   //   return res.status(401).send("must login")
//   // } else {
//     const theCookie = req.cookies['jwt'];
//     const decoded = jwt.verify(theCookie, 'secrect');
//   //   if (!decoded) {
//   //     return res.status(401).send("unauthebtucated")
//   //   }
//     sql.connect((err) => {
//       sql.query('SELECT * FROM user where user_id=' + decoded.id, function (error, results) {
//         if (results[0].role == 1) {
//           var db = "SELECT * FROM user"
//           sql.query(db, function (err, result) {
//             res.status(200).send(result);
//           });
//         } else {
//           return res.status(401).send("must be admin to see all user")
//         }
//       });
//     });
//   // }
//   res.redirect('/');
// });


app.get('/getuser', multerSigleUpload.single('image'), (req, res, next) => {
  if (!req.cookies['jwt']) {
    return res.status(401).send("must login")
  } else {
    const theCookie = req.cookies['jwt'];
    const decoded = jwt.verify(theCookie, 'secrect');
    if (!decoded) {
      return res.status(401).send("unauthebtucated")
    }
    sql.query('SELECT * FROM user where user_id=?', decoded.id, function (error, results) {
      if (error) throw error;
      res.send({ data: results[0].name, message: results[0].phonenumber });
    });
  }
});

app.get('/getalluser', function (req, res) {
  var db = "SELECT * FROM user"
  sql.query(db, function (err, result) {
    res.send(result);
  })
});

app.post('/searchproduct', multerSigleUpload.single('image'), function (req, res) {
  var db = "SELECT * FROM product WHERE product_name LIKE LOWER('%" + req.body.product_name + "%');"
  sql.query(db, function (err, result) {
    console.log(db);
    res.send(result);
  })
});


app.put('/updateuserinfo/:userid', multerSigleUpload.single('image'), function (req, res) {
  var db = "UPDATE user SET name = '" + req.body.name + "', phonenumber = '" + req.body.phonenumber + "', DOB = '" + req.body.dob + "', address = '" + req.body.address + "' WHERE user_id = '" + req.params.userid + "'";
  sql.query(db, function (err, result) {
    console.log('inserted data');
    console.log(db);
    console.log(result);
  });
  res.redirect('/');
});

app.delete('/deleteuserinfo/:userid', multerSigleUpload.single('image'), function (req, res) {
  var db = "delete orderdetail_has_product  from orderdetail_has_product  join orderdetail  where orderdetail.order_id = orderdetail_has_product.orderdetail_order_id and orderdetail.user_user_id = '"+ req.params.userid +"' ;"
  sql.query(db, function (err, result) {
    console.log(db);
    console.log(result);
    var db1 = "delete from orderdetail where user_user_id = '"+ req.params.userid +"' ;"
    sql.query(db1, function (err, result1) {
      console.log(db1);
      console.log(result1);
      var db2 = "Delete from user where user_id = '"+ req.params.userid +"' ;"
      sql.query(db2, function (err, result2) {
        console.log(db2);
        console.log(result2);
      });
    });
  });
  res.redirect('/');
});

app.post('/clearuser', multerSigleUpload.single('image'), (req, res, next) => {
  res.status(202).clearCookie('jwt').send('cookie cleared');
});

app.post('/checkout', multerSigleUpload.single('image'), (req, res, next) => {
  if (!req.cookies['jwt']) {
    return res.status(401).send("must login to see cart")
  } else {
    const theCookie = req.cookies['jwt'];
    const decoded = jwt.verify(theCookie, 'secrect');
    console.log(decoded);
    if (!decoded) {
      return res.status(401).send("unauthebtucated")
    }
    var db2 = "INSERT INTO `orderdetail`( `order_price`, `order_quantity`,`user_user_id`) VALUES ('" + req.body.order_price + "', '" + req.body.order_quantity + "','" + decoded.id + "')";
    sql.query(db2, function (err, result2) {
      console.log(db2);
      console.log(result2);
    });
    var db = "select order_id from orderdetail where order_id=(select max(order_id) from orderdetail);"
    sql.query(db, function (err, result) {
      var plus = result[0].order_id + 1;
      var a = req.body.order_price * req.body.order_quantity
      var db1 = "INSERT INTO `orderdetail_has_product`(`orderDetail_order_id`, `product_product_id`, `total_price_product_id`,`total_quantity_product_id`) VALUES ('" + result[0].order_id + "','" + req.body.product_id + "', '" + a + "','" + req.body.order_quantity + "')";
      sql.connect((err) => {
        sql.query(db1, function (err, result1) {
          console.log(db1);
          console.log(result1);
        });
      });
    });
  }
  res.redirect('/');
});


app.delete('/checkoutdelete/:delete1', multerSigleUpload.single('image'), (req, res) => {
  var db = "delete from orderdetail_has_product where orderDetail_order_id=" + req.params.delete1
  sql.query(db, function (err, result) {
    console.log(db);
    console.log(result);
  });
});

app.put('/checkoutedit/:editid', multerSigleUpload.single('image'), (req, res, next) => {
  var db = "UPDATE orderdetail SET  order_quantity = '" + req.body.order_quantity + "' WHERE order_id = " + req.params.editid
  sql.query(db, function (err, result) {
    console.log(db);
    console.log(result);
    var db2 = "UPDATE orderDetail_has_product SET  total_quantity_product_id = '" + req.body.order_quantity + "' , total_price_product_id ='" + req.body.total_price_product_id + "' WHERE (orderDetail_order_id = '" + req.params.editid + "')"
    sql.query(db2, function (err, result2) {
      console.log(db2);
      console.log(result2);
    });
  });
  res.redirect('/');
});

// app.post('/checkout', multerSigleUpload.single('image'), (req, res, next) => {
//   if (!req.cookies['jwt']) {
//     return res.status(401).send("must login to see cart")
//   } else {
//     const theCookie = req.cookies['jwt'];
//     const decoded = jwt.verify(theCookie, 'secrect');
//     console.log(decoded);
//     if (!decoded) {
//       return res.status(401).send("unauthebtucated")
//     }
//     var db = "select order_id from orderdetail where order_id=(select max(order_id) from orderdetail);"
//     sql.query(db, function (err, result) {
//       console.log(db);
//       console.log(result);
//       var db2 = "INSERT INTO `orderdetail`( `order_price`, `order_quantity`,`user_user_id`) VALUES ('" + req.body.order_price + "', '" + req.body.order_quantity + "','" + decoded.id + "')";
//       sql.query(db2, function (err, result2) {
//         console.log(db2);
//         console.log(result2);
//       });
//       var plus = result[0].order_id + 1;
//       var a = req.body.order_price * req.body.order_quantity
//       var db1 = "INSERT INTO `orderdetail_has_product`(`orderDetail_order_id`, `product_product_id`, `total_price_product_id`,`total_quantity_product_id`) VALUES ('" + plus + "','" + req.body.product_id + "', '" + a + "','" + req.body.order_quantity + "')";
//       sql.connect((err) => {
//         sql.query(db1, function (err, result1) {
//           console.log(db1);
//           console.log(result1);
//         });
//       });
//     });
//   }
//   res.redirect('/');
// });

app.get('/getcheckout', multerSigleUpload.single('image'), (req, res, next) => {
  var db = "SELECT * FROM product p, orderdetail od, orderdetail_has_product odh WHERE od.order_id = odh.orderDetail_order_id AND p.product_id = odh.product_product_id";
  sql.connect((err) => {
    sql.query(db, function (err, result1) {
      for (let index = 0; index < result1.length; index++) {
        var element = result1[index].product_name;
        console.log(element);
      }
      console.log(result1);
      res.send(result1);
    });
  });
});

app.get('/getcheckoutbyid', multerSigleUpload.single('image'), (req, res, next) => {
  const theCookie = req.cookies['jwt'];
  const decoded = jwt.verify(theCookie, 'secrect');
  var db = "SELECT * FROM product p, orderdetail od, orderdetail_has_product odh WHERE od.order_id = odh.orderDetail_order_id AND p.product_id = odh.product_product_id and od.user_user_id = " + decoded.id;
  sql.connect((err) => {
    sql.query(db, function (err, result1) {
      res.send(result1);
      console.log(result1);
      console.log("kay");
    });
  });
});




app.post('/orderhasproduct', multerSigleUpload.single('image'), (req, res, next) => {
  // const theCookie = req.cookies['jwt'];
  // const decoded = jwt.verify(theCookie, 'secrect');
  var db = "INSERT INTO `orderdetail_has_product`( `orderDetail_order_id`, `product_product_id`,`total_price_product_id`,`total_quantity_product_id`) VALUES ('" + req.body.orderDetail_order_id + "', '" + req.body.product_product_id + "','" + req.body.total_price_product_id + "', '" + req.body.total_quantity_product_id + "')";
  sql.query(db, function (err, result) {
    console.log('inserted data');
    console.log(db);
    console.log(result);
  });
  res.redirect('/');
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
// https.createServer(options, app).listen(PORT);