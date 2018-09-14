
const DEPOSIT = 'deposit';
const WITHDRAWL = 'withdrawl';


class InMemoryLedgerRepo {
    constructor(accountRepo) {
        this.accountRepo = accountRepo;
        this.ledger = [];
    }

    async createEntry(token, {type, amount}) {
        try {
            this.accountRepo.getAccount(token);
            switch(type) {
                case DEPOSIT:
                case WITHDRAWL:
                    if (isValidAmount(amount)) {
                        this.ledger.push({accountId: token.id, type, amount});
                    } else {
                        throw new Error("ValidationError");
                    }
                    break;
                default: 
                    throw new Error("ValidationError")
            }
        } catch (e) {
            throw new Error("AccessDenied");
        }
    }

    async getEvents({id}) {
       return {history: this.ledger.filter(entry => (entry.accountId == id))};
    }

    async getBalance(token) {
       const {history} = await this.getEvents(token);
       return {balance: history.reduce((total, entry) => {
            switch (entry.type) {
                case DEPOSIT:
                    total += entry.amount;
                    break;
                case WITHDRAWL:
                    total -= entry.amount;
                    break;
                default:
                    break;
            }
            return total;
       }, 0)};
    }
};

const isValidAmount = (amount) => Number.isInteger(amount) && amount >= 0;

module.exports = { InMemoryLedgerRepo };