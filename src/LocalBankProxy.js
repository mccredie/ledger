
class LocalBankProxy {
    constructor(bank) {
        this.bank = bank;
        this.token = null;
    }

    async createAccount(accountName, password) {
        return this.bank.createAccount(accountName, password);
    }

    async login(accountName, password) {
        this.token = this.bank.getToken(accountName, password)
    }
    
    async logout() {
        this.token = null;
    }

    async getAccount() {
        return this.bank.getAccount(this.token)
    }

    async createEntry(type, amount) {
        return this.bank.createEntry(this.token, type, amount);
    }

    async getBalance() {
        return this.bank.getBalance(this.token);
    }
    
    async getHistory() {
        return this.bank.getHistory(this.token);
    }
}

module.exports = { LocalBankProxy };