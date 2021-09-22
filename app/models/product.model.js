const sql = require("./db.js");

const Product = function(product) {
    
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
  