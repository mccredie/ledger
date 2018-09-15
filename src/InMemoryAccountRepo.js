


class InMemoryAccountRepo {
    constructor() {
        this.accounts = [];
    }

    createAccount(name, password) {
        const account = findAccount(this.accounts, name);
        if (!account) {
            const id = this.accounts.length;
            const newAccount = {
                id: id,
                name,
                password
            };
            this.accounts.push(newAccount);
            return newAccount;
        } else {
            throw new Error('ValidationError');
        }
    }

    getAccountById(id) {
        const account = this.accounts[id];
        if (account) {
            return account;
        } else {
            throw new Error("NotFound")
        }
    }
    getAccountByName(name) {
        const account = findAccount(this.accounts, name);
        if (account) {
            return account;
        } else {
            throw new Error("NotFound");
        }
    }
}

const findAccount = (accounts, name) => accounts.find(account => (account.name === name));


module.exports = { InMemoryAccountRepo };
