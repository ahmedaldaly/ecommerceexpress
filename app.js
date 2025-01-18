const express = require ('express');
const path = require ('path')
const ejs  = require ('ejs')
const app = express ()
const cors = require('cors');
const connectDb =require ('./config/db')
require('dotenv').config ();
connectDb()
const port = process.env.Port
app.use (express.json())
// تحديد فولدر الملفات الثابته زي الصور
app.use(express.static(path.join(__dirname, 'image')));
app.set ('view engine','ejs');
app.set ('views', 'views');

app.use(cors());
// Routes
app.use ('/api/vi/oddorder', require('./Routes/order'))
app.use ('/api/vi/auth', require('./Routes/auth'))
app.use ('/api/vi/users', require('./Routes/user'))
app.use ('/api/vi/product', require('./Routes/product'))
app.use ('/api/vi/search', require('./Routes/search'))
app.use ('/api/vi/category', require('./Routes/category'))
app.use ('/api/vi/favorites', require('./Routes/favorites'))
app.use ('/api/vi/paypal', require('./Routes/paypal'))
app.listen (port, (err)=> {
    if (err) {
        return console.log(err) ;
    }
    console.log(`server is running in port ${port}`)
})
// connection DB