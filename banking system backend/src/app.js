const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter =  require('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');
const transactionRouter = require('./routes/transaction.routes');


const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL ,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Welcome to the Banking System API');
});

app.use('/api/auth', authRouter);
app.use('/api/account', accountRouter);
app.use('/api/transactions', transactionRouter);


module.exports = app;