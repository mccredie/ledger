

const request = require('request-promise-native');


class RemoteBankProxy {
    constructor(url) {
        const j = request.jar();
        this.request = request.defaults({jar: j, simple: false, json: true});
        this.url = url;
    }

    async createAccount(accountName, password) {
        const account = await this.request.post(`${this.url}/api/account`, {body: {accountName, password}});
        if (account.error) {
            throw new Error(account.error);
        }
        return account;
    }

    async login(accountName, password) {
        await this.request.post(`${this.url}/login`, {body: {accountName, password}});
        const account = await this.getAccount();
        if (account.error) {
            throw new Error(account.error);
        }
    }
    
    async logout() {
        await this.request.get(`${this.url}/logout`);
    }

    async getAccount() {
        const account = await this.request.get(`${this.url}/api/account`);
        if (account.error) {
            throw new Error(account.error);
        }
        return account;
    }

    async createEntry(type, amount) {
        const entry = await this.request.post(`${this.url}/api/transactions`, {body: {type, amount}});
        if (entry.error) {
            throw new Error(entry.error);
        }
        return entry;
    }

    async getBalance() {
        const balance = await this.request.get(`${this.url}/api/balance`);
        if (balance.error) {
            throw new Error(balance.error);
        }
        return balance;
    }
    
    async getHistory() {
        const history = await this.request.get(`${this.url}/api/transactions`);
        if (history.error) {
            throw new Error(history.error);
        }
        return history;
    }
}

module.exports = { RemoteBankProxy };