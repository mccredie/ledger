
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


router.get('/account', async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const account = await bank.getAccount(token);
            res.send(account);
        } catch(e) {
            res.clearCookie("token", {path: "/"});
            res.status(401);
            res.send({error: 'AccessDenied'})
        }
    }
});

router.post('/account', async (req, res) => {
    res.send(await bank.createAccount(req.body));
})


app.get('/logout', (req, res) => {
    res.clearCookie('token', {path: '/'});
    res.redirect('/');
});

app.post('/login', async (req, res) => {
    try {
        const token = await bank.getToken(req.body);
        res.cookie('token', token, {httpOnly: true}); //Should also set secure:true, but don't want to worry about certs.
        res.redirect('/');
    } catch(e) {
        res.status(401);
        res.send({error: "Login Failed", message: e.message});
    }
})

router.get('/balance', async (req, res) => {
    const token = req.cookies.token;
    const balance = await bank.getBalance(token);
    res.send(balance);
})

router.get('/transactions', async (req, res) => {
    const token = req.cookies.token;
    const history = await bank.getHistory(token);
    res.send(history);
})

router.post('/transactions', async (req, res) => {
    const token = req.cookies.token;
    let resp;
    if (req.body.type == 'deposit') {
        resp = await bank.deposit(token, req.body.amount);
    }
    else if (req.body.type == 'withdraw') {
        resp = await bank.withdraw(token, req.body.amount);
    } else {
        res.status(400);
        resp({error: 'InvalidOperation'})
    }
    res.send(resp);
})

app.use('/api', router);

app.listen(3000, function(){
    console.log('app listening on port 3000');
});