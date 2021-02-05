const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const dotenv = require('dotenv');

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

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body

        db.query('select * from users where email = ?', [email], async (error, results)=>{
            if(!results || !(await bcrypt.compare(password, results[0].password) )){
                res.status(401).render('login', {
                    error: 'Email or password incorrect',
                });
            }else {
                const id = results[0].id;

                const token = jwt.sign({id: id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JSW_EXPIERS_IN
                });

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000 // CONVERTO TO MILISECONDS
                    ),
                    httpOnly: true 
                }

                res.cookie('token', token, cookieOptions);
                res.redirect('/home');
            }
        });

    } catch (error) {
        console.log(error)
    }
    
}

        