const express= require('express');
const app= express();
const cookieParser= require('cookie-parser');
const path= require('path');
const expressSession= require('express-session');
const flash= require('connect-flash');

require('dotenv').config()

const productsRouter=require('./routes/productsRouter');
const usersRouter=require('./routes/usersRouter');
const ownersRouter=require('./routes/ownersRouter');
const indexRouter=require('./routes/index');

const db= require('./config/mongoose-connection')


app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(
    expressSession({
       resave: false,
       saveUninitialized: false,
       secret : "heyaaaa"
}))
app.use(flash());
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());




app.use('/owners',ownersRouter);
app.use('/users',usersRouter);
app.use('/products',productsRouter);
app.use('/',indexRouter);

app.listen(3000);