

const request = require('request-promise-native');


class RemoteBankProxy {
    constructor(url) {
        const j = request.jar();
        this.request = request.defaults({jar: j, simple: false, json: true});
        this.url = url;
    }

    async createAccount(accountName, password) {
        return await this.request.post(`${this.url}/api/account`, {body: {accountName, password}});
    }

    async login(accountName, password) {
        await this.request.post(`${this.url}/login`, {body: {accountName, password}});
        const account = await this.getAccount();
        if (!account.name) {
            throw new Error("NotFound");
        }
    }
    
    async logout() {
        await this.request.get(`${this.url}/logout`);
    }

    async getAccount() {
        return await this.request.get(`${this.url}/api/account`);
    }

    async createEntry(type, amount) {
        return await this.request.post(`${this.url}/api/transactions`, {body: {type, amount}});
    }

    async getBalance() {
        return await this.request.get(`${this.url}/api/balance`);
    }
    
    async getHistory() {
        return await this.request.get(`${this.url}/api/transactions`);
    }
}

module.exports = { RemoteBankProxy };