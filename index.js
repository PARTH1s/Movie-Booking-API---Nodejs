const express = require('express');  
const bodyParser = require('body-parser');
const env = require('dotenv');
const cors = require('cors')
const mongoose = require('mongoose'); 

env.config();
const app = express();  

app.use(cors())

// configuring body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
 
app.get('/', (req, res) => {
    res.send('Home');
})

app.listen(process.env.PORT, async () => {
    // this callback gets execcuted, once we successfully start the server on the given port
    console.log(`Server started on Port ${process.env.PORT} !!`);

    try {
        if(process.env.NODE_ENV == 'production') {
            await mongoose.connect(process.env.PROD_DB_URL); // connected to the mongo server
        } else {
            await mongoose.connect(process.env.DB_URL); // connected to the mongo server
        }
        
        console.log("Successfully connected to mongo");
    } catch (err) {
        console.log("Not able to connect mongo", err);
    }
});