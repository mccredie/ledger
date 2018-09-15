
const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const { Bank } = require('./src/Bank');
const { InMemoryLedgerRepo } = require('./src/InMemoryLedgerRepo');
const { InMemoryAccountRepo } = require('./src/InMemoryAccountRepo');
const { TokenAuthor } = require('./src/TokenAuthor');

const accountRepo = new InMemoryAccountRepo();
const ledgerRepo = new InMemoryLedgerRepo(accountRepo);
const tokenAuthor = new TokenAuthor(accountRepo);
const bank = new Bank(accountRepo, ledgerRepo, tokenAuthor);

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, }));
app.use(express.static(path.join(__dirname, 'public')));

const setErrorResponse = (error, res) => {
    switch(error.message) {
        case 'AccessDenied':
            res.status(401);
            res.send({error: 'AccessDenied'});
            break;
        case 'NotFound':
            res.status(404);
            res.send({error: 'NotFound'});
            break;
        case 'ValidationError':
            res.status(400);
            res.send({error: 'ValidationError'});
            break;
        default:
            res.status(500);
            res.send({error: 'InternalError'});
            break;
    }
}


app.get('/api/account', (req, res) => {
    const token = req.cookies.token || {};
    try {
        const account = bank.getAccount(token);
        res.send(account);
    } catch(e) {
        setErrorResponse(e, res);
    }
});

app.post('/api/account', (req, res) => {
    try {
        const {accountName, password} = req.body;
        res.send(bank.createAccount(accountName, password));
    } catch(e) {
        setErrorResponse(e, res);
    }
})


app.get('/logout', (req, res) => {
    try {
        res.clearCookie('token', {path: '/'});
        res.redirect('/');
    } catch(e) {
        setErrorResponse(e, res);
    }
});

app.post('/login', (req, res) => {
    try {
        const { accountName, password } = req.body;
        const token = bank.getToken(accountName, password);
        res.cookie('token', token, {httpOnly: true}); //Should also set secure:true, but don't want to worry about certs.
        res.redirect('/');
    } catch(e) {
        if (e.message == 'NotFound') {
            res.redirect('/#loginfailed');
        } else {
            setErrorResponse(e, res);
        }
    }
})

app.get('/api/balance', (req, res) => {
    const token = req.cookies.token || {};
    try {
        const balance = bank.getBalance(token);
        res.send(balance);
    } catch(e) {
        setErrorResponse(e, res);
    }
})

app.get('/api/transactions', (req, res) => {
    const token = req.cookies.token || {};
    try {
        const history = bank.getHistory(token);
        res.send(history);
    } catch(e) {
        setErrorResponse(e, res);
    }
})

app.post('/api/transactions', (req, res) => {
    const token = req.cookies.token || {};
    try {
        const {type, amount} = req.body;
        res.send(bank.createEntry(token, type, amount));
    } catch(e) {
        setErrorResponse(e, res);
    }
})

app.listen(3000, function(){
    console.log('app listening on port 3000');
});