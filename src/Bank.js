
class Bank {
    constructor(accountsRepo, ledgerRepo) {
        this.accountsRepo = accountsRepo;
        this.ledgerRepo = ledgerRepo;
    }

    async createAccount({accountName, password}) {
        return await this.accountsRepo.createAccount(accountName, password);
    }

    async getAccount(token) {
        return await this.accountsRepo.getAccount(token);
    }

    async getToken({accountName, password}) {
        return await this.accountsRepo.getToken(accountName, password);
    }

    async deposit(token, amount) {
        return await this.ledgerRepo.createEntry(token, {type: 'deposit', amount});
    }

    async withdraw(token, amount) {
        return await this.ledgerRepo.createEntry(token, {type: 'withdrawl', amount});
    }

    async getBalance(token) {
        return await this.ledgerRepo.getBalance(token);
    }
    
    async getHistory(token) {
        return await this.ledgerRepo.getEvents(token);
    }
}

module.exports = { Bank };