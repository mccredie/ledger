
const express = require('express');
const Router = require('express-promise-router');
const path = require('path');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const { Bank } = require('./src/Bank');
const { InMemoryLedgerRepo } = require('./src/InMemoryLedgerRepo');
const { InMemoryAccountRepo } = require('./src/InMemoryAccountRepo');

const accountRepo = new InMemoryAccountRepo();
const ledgerRepo = new InMemoryLedgerRepo(accountRepo);
const bank = new Bank(accountRepo, ledgerRepo);

const app = express();
const router = Router();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, }));
app.use(express.static(path.join(__dirname, 'public')));


// /
//  GET
// /api/login
//  POST

// /api/account
//  POST
//  GET
app.get('/api/account', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <body>
    <h1>Create Account</h1>
    <form method="post">
    <input type="text" name="accountName">Account Name</input>
    <input type="password" name="password">Password</input>
    <button>Create Account</button>
    </form>
    </body>
    `);
});

router.post('/account', async (req, res) => {
    const resp = await bank.createAccount(req.body);
    res.send(resp);
})

app.get('/api/login', (req, res) => {
    if (req.cookies.token) {
        res.send(`
        <!DOCTYPE html>
        <body>
        <h1>Login</h1>
        <form action="/api/logout" method="get">
        <button>Logout</button>
        </form>
        </body>
        `)
    } else {
        res.send(`
        <!DOCTYPE html>
        <body>
        <h1>Login</h1>
        <form method="post">
        <input type="text" name="accountName">Account Name</input>
        <input type="password" name="password">Password</input>
        <button>Login</button>
        </form>
        </body>
        `)
    }
})

app.get('/api/logout', (req, res) => {
    console.log("attempting to clear cookie");
    res.clearCookie('token', {path: '/'});
    res.redirect('/');
});

router.post('/login', async (req, res) => {
    try {
        const token = await bank.getToken(req.body);
        res.cookie('token', token, {httpOnly: true}); //Should also set secure:true, but don't want to worry about certs.
        res.redirect('/');
    } catch(e) {
        res.send({error: "Login Failed", message: e.message});
    }
})


app.use('/api', router);
// /api/balance
//  GET
// /api/transactions
//  GET
//  POST

app.listen(3000, function(){
    console.log('app listening on port 3000');
});