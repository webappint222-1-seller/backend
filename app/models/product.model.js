const multer = require("multer");
const sql = require("./db.js");


const Product = function(product) {
  this.product_name = product.product_name;
  this.band_name = product.band_name;
  this.price = product.price;
  this.product_des = product.product_des;
  this.image = product.image;
  };

  // const storage = multer.diskStorage({
  //   destination: function(request,file,callback){
  //     callback(null,'./upload/images')
  //   },

  //   filename: function(res,file,callback){
  //     callback(null,Date.now()+ file.originalname)
  //   }
  // });

  // const upload = multer({
  //   storage: storage
  // });
  
  Product.getAll = result => {
    sql.query("SELECT * FROM product", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("Product: ", res);
      result(null, res);
    });
  };
  Product.findById = (product_id, result) => {
  sql.query(`SELECT * FROM product WHERE product_id = ${product_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found product: ", res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};
// Product.create = (newProduct, result) => {
//   sql.query(`INSERT INTO product SET ?`, newProduct,upload.single('image'), (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     console.log("created product: ", { product_id: res.insertId, ...newProduct });
//     result(null, { product_id: res.insertId, ...newProduct });
//   });
// };

module.exports = Product;