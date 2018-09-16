const { InMemoryAccountRepo } = require("./InMemoryAccountRepo");

describe("InMemoryAccountRepo", () => {
  describe(".createAccount", () => {
    it("should return the name of the created account upon success", () => {
        const repo = new InMemoryAccountRepo();
        const accountName = "myAccount";
        const account = repo.createAccount(accountName, 'password');

        expect(account.name).toEqual(accountName);
    });
    it("Should throw error if the account already exists", () => {
        const repo = new InMemoryAccountRepo();
        const accountName = "myAccount";
        const password = "password"

        repo.createAccount(accountName, password);
        expect(() => repo.createAccount(accountName, password)).toThrow(Error('ValidationError'));
    })
    it("Should be able to create multiple accounts with unique names", () => {
        const repo = new InMemoryAccountRepo();
        const createdAccountIds = new Set();
        const numAccounts = 100;


        for(let i = 0; i < numAccounts; ++i) {
            const account = repo.createAccount(`accountName${i}`, 'password');
            createdAccountIds.add(account.name); 
        }
    
        expect(createdAccountIds.size).toEqual(numAccounts);

    })
  })
  describe(".getAccountById", () => {
    let repo;
    const accountName = "myAccount";
    const password = "myPassword";
    let existingAccount;
    beforeEach(() => {
        repo = new InMemoryAccountRepo();
        existingAccount = repo.createAccount(accountName, password);
    })
    it("should retrieve the account given a id", () => {
        const account = repo.getAccountById(existingAccount.id);
        expect(account).toEqual(existingAccount);
    })
    it("should thow error for invalid id", () => {
        expect(() => repo.getAccountById(123)).toThrow(new Error("NotFound"));
    })
  })
  describe(".getAccountByName", () => {
    let repo;
    const accountName = "myAccount";
    const password = "myPassword";
    let existingAccount;
    beforeEach(() => {
        repo = new InMemoryAccountRepo();
        existingAccount = repo.createAccount(accountName, password);
    })
    it("should retrieve the account given a id", () => {
        const account = repo.getAccountByName(accountName);
        expect(account).toEqual(existingAccount);
    })
    it("should thow error for invalid id", () => {
        expect(() => repo.getAccountByName("borf")).toThrow(new Error("NotFound"));
    })
  })
})