const Product = require("../models/product.model.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const product = new Product({
    // product_id: req.body.product_id,
    product_name: req.body.product_name,
    band_name: req.body.band_name,
    price: req.body.price,
    product_des: req.body.product_des,
    image: req.body.image
  });

  Product.create(product,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the products."
      });
    else res.send(data);
  });
};

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

  exports.delete = (req, res) => {
    Product.remove(req.params.productId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found product with id ${req.params.productId}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete product with id " + req.params.productId
          });
        }
      } else res.send({ message: `product was deleted successfully!` });
    });
  };
  
  exports.update = (req, res) => {

    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    console.log(req.body);
  
    Product.updateById(
      req.params.productId,
      new Product(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found products with id ${req.params.productId}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating products with id " + req.params.productId
            });
          }
        } else res.send(data);
      }
    );
  };