const sql = require("./db.js");

const Product = function(product) {
  this.product_id = product.product_id;
  this.product_name = product.product_name;
  this.band_name = product.band_name;
  this.price = product.price;
  this.product_des = product.product_des;
  };

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
  sql.query(`SELECT * FROM product WHERE id = ${product_id}`, (err, res) => {
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