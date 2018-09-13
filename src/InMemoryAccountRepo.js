


class InMemoryAccountRepo {
    constructor() {
        this.accounts = [];
    }

    async createAccount(name, password) {
        const account = findAccount(this.accounts, name);
        if (!account) {
            const id = this.accounts.length;
            this.accounts.push({
                id: id,
                name,
                password
            });
            return {name};
        } else {
            throw new Error(`DuplicateAccount '${name}'`);
        }
    }

    async hasAccount(id) {
        return !!this.accounts[id];
    }

    async getToken(name, password) {
        const account = findAccount(this.accounts, name);
        if (account && this.accounts[account.id].password === password) {
            return {id: account.id};
        } else {
            throw new Error("AccessDenied");
        }
    }
}

const findAccount = (accounts, name) => accounts.find(account => (account.name === name));


module.exports = { InMemoryAccountRepo };


