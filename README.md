Dumb dork 
Start with
node server.js or nodemon server.js
Every image will save in public
("/") is test connection

>product
-post("/formdataupload") is to upload formdata
-get("/products")to list all product
-get("/products/:productId") list 1 product
-delete ("/products/:productId") to delete 1 product by ID
-put ("/update/:productId") update product by ID

>user
-create user('/formdatausersupload')
-get("/customers")
-get("/customers/:customerId")
-delete("/customers/:customerId")
-post("/login") to get cookie and token auten
-get("/getuser") to get userdata and role *for testing purpose*
-post("/clearuser") to logout or clear login cookie

>cart
post("/checkout") post item to cart with product id
get("/getcheckoutbyid") to see product
delete("/checkoutdelete") to delete product from cart with order_id