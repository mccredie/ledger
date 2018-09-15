
class Bank {
    constructor(accountsRepo, ledgerRepo, tokenAuthor) {
        this.accountsRepo = accountsRepo;
        this.ledgerRepo = ledgerRepo;
        this.tokenAuthor = tokenAuthor;
    }

    createAccount(accountName, password) {
        const account = this.accountsRepo.createAccount(accountName, password);
        return {name: account.name};
    }

    getToken(accountName, password) {
        return this.tokenAuthor.generateToken(accountName, password);
    }

    getAccount(token) {
        const {name} = this.tokenAuthor.validateToken(
            token,
            (id) => this.accountsRepo.getAccountById(id));
        return {name};
    }

    createEntry(token, type, ammount) {
        return this.tokenAuthor.validateToken(
            token,
            (id) => this.ledgerRepo.createEntry(id, {type, amount}));
    }

    deposit(token, amount) {
        return this.tokenAuthor.validateToken(
            token,
            (id) => this.ledgerRepo.createEntry(id, {type: 'deposit', amount}));
    }

    withdraw(token, amount) {
        return this.tokenAuthor.validateToken(
            token,
            (id) => this.ledgerRepo.createEntry(id, {type: 'withdrawl', amount}));
    }

    getBalance(token) {
        return this.tokenAuthor.validateToken(
            token,
            (id) => this.ledgerRepo.getBalance(id));
    }
    
    getHistory(token) {
        return this.tokenAuthor.validateToken(
            token,
            (id) => this.ledgerRepo.getEvents(id));
    }
}

module.exports = { Bank };