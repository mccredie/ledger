
const crypto = require('crypto');

class TokenAuthor {
    constructor(accountRepo, secret) {
        this.accountRepo = accountRepo;
        this.secret = secret;
    }

    validateToken(token, cb) {
        if (token && token.hmac && token.hmac == generateHmac(this.secret, token.id)) {
            return cb(token.id);
        } else {
            throw new Error("AccessDenied");
        }
    }

    generateToken(accountName, password) {
        const {id, salt, iterations, keylen, digest, key} = this.accountRepo.getAccountByName(accountName);
        const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
        const hmac = generateHmac(this.secret, id);
        if (derivedKey == key) {
            return {id, hmac};;
        }
    }
}

const generateHmac = (secret, value) => (
    crypto.createHmac('sha256', secret)
                    .update(JSON.stringify(value))
                    .digest('hex')
);

module.exports = { TokenAuthor };