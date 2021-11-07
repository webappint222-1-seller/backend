const sql = require("./db.js");

const Customer = function(customer) {
  this.emailaddress = customer.emailaddress;
  this.password = customer.password;
  this.name = customer.name;
  this.phonenumber = customer.phonenumber;
  this.dob = customer.dob;
  this.address = customer.address;
  this.role = customer.role;
};

Customer.create = (newCustomer, result) => {
  sql.query("INSERT INTO user SET ?", newCustomer, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { user_id: res.insertId, ...newCustomer });
    result(null, { user_id: res.insertId, ...newCustomer });
  });
};

Customer.findById = (user_id, result) => {
  sql.query(`SELECT * FROM user WHERE user_id = ${user_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

Customer.getAll = result => {
  sql.query("SELECT * FROM user", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("customers: ", res);
    result(null, res);
  });
};


Customer.updateById = (user_id, customer, result) => {
  sql.query(
    "UPDATE user SET emailaddress = ?, password = ?, name = ? , phonenumber = ? , DOB = ?, address = ? WHERE user_id = ?",
    [customer.emailaddress, customer.password, customer.name, customer.phonenumber,customer.dob,customer.address ,user_id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", { user_id: user_id, ...customer });
      result(null, { user_id: user_id, ...customer });
    }
  );
};

Customer.remove = (user_id, result) => {
  sql.query("DELETE FROM user WHERE user_id = ?", user_id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with user_id: ", user_id);
    result(null, res);
  });
};

Customer.removeAll = result => {
  sql.query("DELETE FROM user", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} user`);
    result(null, res);
  });
};

module.exports = Customer;
