
const { Bank } = require('./src/Bank');
const { InMemoryLedgerRepo } = require('./src/InMemoryLedgerRepo');
const { InMemoryAccountRepo } = require('./src/InMemoryAccountRepo');
const { CommandLineInterface } = require('./src/CommandLineInterface');


const main = () => {
    const accountRepo = new InMemoryAccountRepo();
    const ledgerRepo = new InMemoryLedgerRepo(accountRepo);
    const bank = new Bank(accountRepo, ledgerRepo);

    const cli = new CommandLineInterface(bank);

    cli.run();
}

if (require.main == module) {
    main();
}