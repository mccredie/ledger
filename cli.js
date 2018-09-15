
const { Bank } = require('./src/Bank');
const { LocalBankProxy } = require('./src/LocalBankProxy');
//const { RemoteBankProxy } = require('./src/RemoteBankProxy');
const { InMemoryLedgerRepo } = require('./src/InMemoryLedgerRepo');
const { InMemoryAccountRepo } = require('./src/InMemoryAccountRepo');
const { CommandLineInterface } = require('./src/CommandLineInterface');
const { TokenAuthor } = require("./src/TokenAuthor");


const main = () => {
    const accountRepo = new InMemoryAccountRepo();
    const ledgerRepo = new InMemoryLedgerRepo(accountRepo);
    const tokenAuthor = new TokenAuthor(accountRepo);
    const bank = new Bank(accountRepo, ledgerRepo, tokenAuthor);
    const bankproxy = new LocalBankProxy(bank);

    const cli = new CommandLineInterface(bankproxy);
    // const cli = new CommandLineInterface(new RemoteBankProxy('http://localhost:3000'))

    cli.run();
}

if (require.main == module) {
    main();
}