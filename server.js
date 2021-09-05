const mysql =require('mysql');

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'root',
    database:'mydb'

});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('yyes');
    else
        console.log('no');
});

app.listen(3000,()=> console.log('asd'));

