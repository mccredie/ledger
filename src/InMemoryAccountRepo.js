


class InMemoryAccountRepo {
    constructor() {
        this.accounts = [];
    }

    createAccount(name, password) {
        if (validAccountCredentials(name, password)) {
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


const isValidAccountName = (accountName) => (
    typeof accountName == 'string' && accountName.match(/^[a-zA-Z0-9]{3}[a-zA-Z0-9]*$/) !== null
)

const isValidPassword = (password) => (
    typeof password == 'string' && password.match(/^.{4}.*$/) !== null
)
 
const validAccountCredentials = (accountName, password) => (
    isValidAccountName(accountName) && isValidPassword(password)
)

module.exports = { InMemoryAccountRepo };
