
class TokenAuthor {
    constructor(accountRepo) {
        this.accountRepo = accountRepo;
    }

    validateToken(token, cb) {
        let account;
        try {
            account = this.accountRepo.getAccountById(token.id);
        } catch(e) {
            throw new Error("AccessDenied");
        }
        return cb(account.id);
    }

    generateToken(accountName, password) {
        const account = this.accountRepo.getAccountByName(accountName);
        if (account.password == password) {
            return {id: account.id};;
        }
    }
}

module.exports = { TokenAuthor };