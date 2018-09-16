
const { InMemoryLedgerRepo } = require("./InMemoryLedgerRepo");

const oneDollarDeposit = {type: 'deposit', amount: 1};
const threeDollarWithdrawl = {type: 'withdrawl', amount: 3};

describe("InMemoryLedgerRepo", () => {
    it("I should be able to depost $1 10 times and see a balance of $10", () => {
        const repo = new InMemoryLedgerRepo();
        const accountId = 1;

        for(let i = 0; i < 10 ; ++i) {
            repo.createEntry(accountId, oneDollarDeposit);
        }

        expect(repo.getBalance(accountId).balance).toEqual(10);
    })


    it("should be able to do a set of deposits and withdrawls and get the correct ammount", () => {
        const repo = new InMemoryLedgerRepo();
        const accountId = 1;

        for(let i = 0; i < 10 ; ++i) {
            // net + $2 per loop
            repo.createEntry(accountId, oneDollarDeposit);
            repo.createEntry(accountId, oneDollarDeposit);
            repo.createEntry(accountId, oneDollarDeposit);
            repo.createEntry(accountId, oneDollarDeposit);
            repo.createEntry(accountId, oneDollarDeposit);
            repo.createEntry(accountId, threeDollarWithdrawl);
        }

        expect(repo.getBalance(accountId).balance).toEqual(20);
    });


    it("should have the same number of entries in history as entries created", () => {
        const repo = new InMemoryLedgerRepo();
        const accountId = 1;

        for(let i = 0; i < 10 ; ++i) {
            // 3 entries per loop
            repo.createEntry(accountId, oneDollarDeposit);
            repo.createEntry(accountId, oneDollarDeposit);
            repo.createEntry(accountId, threeDollarWithdrawl);
        }

        expect(repo.getEvents(accountId).history).toHaveLength(30);
    });

    it("should show a negative balance if withdrawn past 0", () => {
        const repo = new InMemoryLedgerRepo();
        const accountId = 1;

        repo.createEntry(accountId, threeDollarWithdrawl);

        expect(repo.getBalance(accountId).balance).toEqual(-3);
    });

    it("should have a 0 balance if no entries", () => {
        const repo = new InMemoryLedgerRepo();
        const accountId = 1;

        expect(repo.getBalance(accountId).balance).toEqual(0);
    });

    it("should have no events in history if no entries added", () => {
        const repo = new InMemoryLedgerRepo();
        const accountId = 1;

        expect(repo.getEvents(accountId).history).toHaveLength(0);
    });

    it("should have the correct balance on two accounts with multiple transactions", ()=> {
        const repo = new InMemoryLedgerRepo();
        const account1 = 1;
        const account2 = 2;

        repo.createEntry(account1, oneDollarDeposit);
        repo.createEntry(account2, oneDollarDeposit);
        repo.createEntry(account1, oneDollarDeposit);
        repo.createEntry(account2, oneDollarDeposit);
        repo.createEntry(account1, oneDollarDeposit);

        expect(repo.getBalance(account1).balance).toEqual(3);
        expect(repo.getBalance(account2).balance).toEqual(2);
    });

    it("should throw validation error when type is not deposit or withdrawl", () => {
        const repo = new InMemoryLedgerRepo();
        expect(() => repo.createEntry(1, {type: "blah", amount: 10})).toThrow(new Error("ValidationError"));
    });

    it("should throw validation error when amount is not a number", () => {
        const repo = new InMemoryLedgerRepo();
        expect(() => repo.createEntry(1, {type: "deposit", amount: "amt"})).toThrow(new Error("ValidationError"));
    });

    it("should throw validation error when amount is not an integer", () => {
        const repo = new InMemoryLedgerRepo();
        expect(() => repo.createEntry(1, {type: "deposit", amount: 1.2})).toThrow(new Error("ValidationError"));
    });

    it("should throw validation error when amount is a negative integer", () => {
        const repo = new InMemoryLedgerRepo();
        expect(() => repo.createEntry(1, {type: "deposit", amount: -1})).toThrow(new Error("ValidationError"));
    });
});
