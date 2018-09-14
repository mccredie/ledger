
class Bank {
    constructor(accountsRepo, ledgerRepo) {
        this.accountsRepo = accountsRepo;
        this.ledgerRepo = ledgerRepo;
    }

    createAccount({accountName, password}) {
        return this.accountsRepo.createAccount(accountName, password);
    }

    getAccount(token) {
        return this.accountsRepo.getAccount(token);
    }

    getToken({accountName, password}) {
        return this.accountsRepo.getToken(accountName, password);
    }

    deposit(token, amount) {
        return this.ledgerRepo.createEntry(token, {type: 'deposit', amount});
    }

    withdraw(token, amount) {
        return this.ledgerRepo.createEntry(token, {type: 'withdrawl', amount});
    }

    getBalance(token) {
        return this.ledgerRepo.getBalance(token);
    }
    
    getHistory(token) {
        return this.ledgerRepo.getEvents(token);
    }
}

module.exports = { Bank };