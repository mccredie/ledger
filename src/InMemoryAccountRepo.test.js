const { InMemoryAccountRepo } = require("./InMemoryAccountRepo");

describe("InMemoryAccountRepo", () => {
  describe(".createAccount", () => {
    it("should return the name of the created account upon success", async () => {
        expect.assertions(1);
        const repo = new InMemoryAccountRepo();
        const accountName = "myAccount";
        const account = await repo.createAccount(accountName, 'password');

        expect(account.name).toEqual(accountName);
    });
    it("should return an id of the created account upon success", async () => {
        expect.assertions(1);
        const repo = new InMemoryAccountRepo();
        const account = await repo.createAccount('myAccount', 'password');

        expect(account.id).toBeDefined();
    });
    it("Should reject request if the account already exists", async () => {
        expect.assertions(1);
        const repo = new InMemoryAccountRepo();
        const accountName = "myAccount";

        await repo.createAccount(accountName, 'password');
        await expect(repo.createAccount(accountName, 'password')).rejects.toEqual(Error(`DuplicateAccount '${accountName}'`));
    })
    it("Should be able to create multiple accounts with unique ids", async () => {
        expect.assertions(1);
        const repo = new InMemoryAccountRepo();
        const createdAccountIds = new Set();
        const numAccounts = 100;


        for(let i = 0; i < numAccounts; ++i) {
            const account = await repo.createAccount(`accountName-${i}`, 'password');
            createdAccountIds.add(account.id); 
        }
    
        expect(createdAccountIds.size).toEqual(numAccounts);

    })
  })
  describe(".login", () => {
    let repo;
    const accountName = "myAccount";
    const password = "myPassword";
    let existingAccount;

    beforeEach(async () => {
        repo = new InMemoryAccountRepo();
        existingAccount = await repo.createAccount(accountName, password);
    });

    it("should return an account object with an id that matches the created account", async () => {
        expect.assertions(1);
        const account = await repo.login(accountName, password);
        expect(account.id).toEqual(existingAccount.id);
    });
    it("should fail with an authentication error if the password is wrong", async () => {
        expect.assertions(1);
        await expect(repo.login(accountName, 'abadpassword')).rejects.toEqual(Error("AccessDenied"));
    });
    it("should fail with an authentication error if the account doesn't exist", async () => {
        expect.assertions(1);
        await expect(repo.login('newAccountThatDoesNotExist', '12345')).rejects.toEqual(Error("AccessDenied"));
    })
  })
})