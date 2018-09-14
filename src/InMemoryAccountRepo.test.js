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

        repo.createAccount(accountName, 'password');
        expect(() => repo.createAccount(accountName, 'password')).toThrow(Error(`DuplicateAccount '${accountName}'`));
    })
    it("Should be able to create multiple accounts with unique names", () => {
        const repo = new InMemoryAccountRepo();
        const createdAccountIds = new Set();
        const numAccounts = 100;


        for(let i = 0; i < numAccounts; ++i) {
            const account = repo.createAccount(`accountName-${i}`, 'password');
            createdAccountIds.add(account.name); 
        }
    
        expect(createdAccountIds.size).toEqual(numAccounts);

    })
  })
  describe(".getToken", () => {
    let repo;
    const accountName = "myAccount";
    const password = "myPassword";

    beforeEach(() => {
        repo = new InMemoryAccountRepo();
        repo.createAccount(accountName, password);
    });

    it("should fail with an authentication error if the password is wrong", () => {
        expect(() => repo.getToken(accountName, 'abadpassword')).toThrow(Error("AccessDenied"));
    });
    it("should fail with an authentication error if the account doesn't exist", () => {
        expect(() => repo.getToken('newAccountThatDoesNotExist', '12345')).toThrow(Error("AccessDenied"));
    })
  })
  describe(".getAccount", () => {
    let repo;
    const accountName = "myAccount";
    const password = "myPassword";
    let existingAccount;
    beforeEach(() => {
        repo = new InMemoryAccountRepo();
        existingAccount = repo.createAccount(accountName, password);
    })
    it("should retrieve the name for an account given a token", () => {
        const token = repo.getToken(accountName, password);
        const account = repo.getAccount(token);

        expect(account).toEqual(existingAccount);
    })
    it("should thow error for invalid token", () => {
        expect(() => repo.getAccount({id: 123})).toThrow(new Error("NotFound"));
    })
  })
})