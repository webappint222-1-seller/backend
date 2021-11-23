const Product = require("../models/product.model.js");



exports.findAll = (req, res) => {
    Product.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving products."
        });
      else res.send(data);
    });
  };

  exports.findOne = (req, res) => {
    Product.findById(req.params.productId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found product with id ${req.params.productId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving product with id " + req.params.productId
          });
        }
      } else res.send(data);
    });
  };

