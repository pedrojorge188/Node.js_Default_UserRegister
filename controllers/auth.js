const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

exports.register = (req, res) =>{

    // const of data in form
    const {name , email, password, passwordConfirm } = req.body;

    db.query('select email from users where email = ? ', [email], async (error, results) =>{
        if(error){
            console.log(error);
        }

        if(results.length > 0 ){
            return res.render('register' , {
                error: 'Email is already used'
            });
        } else if(password !== passwordConfirm){
            return res.render('register', {
                error: 'Password confirm : Fail'
            });
        }

        // Process to hash PSW using dependence named bcrypt.js
        let hashedPassword = await bcrypt.hash(password, 8);

        db.query('insert into users set ?', {name: name, email: email, password: hashedPassword}, (error, results) =>{
            if(error){
                console.log(error)
            }else {
                console.log(results)
                return res.render('register', {
                   message: 'User Registado ' 
                });
            }
        });
    });

}
