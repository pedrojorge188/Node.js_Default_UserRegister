const express = require('express');
const mysql = require('mysql');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({path: './.env'});

const app = express(); 

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//DB :: CONNECT ......
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});
db.connect((error)=>{
    if(error){
        console.log(error);
    }else{
        console.log('Mysql connected ...');
    }
});

// call router to this file 
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));



//some view configs
app.set('view engine', 'hbs');
const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));

// SERVER CONFIG ... 
app.listen('8080', ()=>{
    console.log("Server on PORT:8080 => STATUS : SUCESS");
});