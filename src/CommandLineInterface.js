
const inquirer = require('inquirer');

class CommandLineInterface {
    constructor(bankproxy) {
        this.bank = bankproxy;
        this.token = null;
        this.ui = new inquirer.ui.BottomBar();
    }

    async run() {
        let nextAction = 'loggedOutPrompt';
        try {
            for(;;) {
                nextAction = await this[nextAction].call(this);
                if (nextAction == 'quit') {
                    break;
                }
            }
        } catch(e) {
            this.ui.log.write(`Fatal Error: ${e.message}`);
        }
    }

    async login() {
        const {accountName, password} = await inquirer.prompt([
            {
                type: 'input',
                name: 'accountName',
                message: "Name of the account to log into?",
            },
            {
                type: 'password',
                name: 'password',
                mask: '*',
                message: 'Enter account password:'
            }
        ]);
        try {
            await this.bank.login(accountName, password);
            return 'loggedInPrompt';
        } catch(e) {
            this.ui.log.write(`Error: ${e.message}`)
            return 'tryLoginAgain';
        }
    }

    async createAccount() {
        const {accountName, password} = await inquirer.prompt([
            {
                type: 'input',
                name: 'accountName',
                message: "Name the new account?",
            },
            {
                type: 'password',
                name: 'password',
                mask: '*',
                message: 'Create a password:'
            }
        ]);
        try {
            await this.bank.createAccount(accountName, password);
            return 'loggedOutPrompt';
        } catch(e) {
            this.ui.log.write(`Error: ${e.message}`)
            return 'tryCreateAccountAgain';
        }
    }

    async tryLoginAgain() {
        const {again} = await inquirer.prompt([{
            type: 'confirm', name: 'again', message: "Try Again?", default: true
        }])

        if (again) {
            return 'login';
        } else {
            return 'loggedOutPrompt';
        }
    }

    async tryCreateAccountAgain() {
        const {again} = await inquirer.prompt([{
            type: 'confirm', name: 'again', message: "Try Again?", default: true
        }]);

        if (again) {
            return 'createAccount';
        } else {
            return 'loggedOutPrompt';
        }
    }

    async logout() {
        await this.bank.logout();
        return 'loggedOutPrompt';
    }

    async loggedOutPrompt() {
        const {action} = await inquirer.prompt([{
            type: "list",
            name: 'action',
            message: "What would you like to do?",
            choices: [
                {name: 'Login to an existing account', value: 'login'},
                new inquirer.Separator(),
                {name: 'Create a new account', value: 'createAccount'},
                {name: 'Exit', value: 'quit'}
            ]
        }]);
        return action;
    }

    async loggedInPrompt() {
        const {action} = await inquirer.prompt([{
            type: "list",
            name: 'action',
            message: "What would you like to do?",
            choices: [
                {name: 'View Balance', value: 'viewBalance' },
                {name: 'Deposit', value: 'deposit' },
                {name: 'Withdraw', value: 'withdraw' },
                {name: 'View Account History', value: 'viewHistory'},
                new inquirer.Separator(),
                {name: 'Logout', value: 'logout'},
            ]
        }]);
        return action;
    }

    async deposit() {
        const {amount} = await inquirer.prompt([{
            type: 'input',
            name: 'amount',
            message: 'How much would you like to deposit?'
        }])
        await this.bank.createEntry('deposit', Number.parseInt(amount));
        return 'loggedInPrompt';
    }

    async withdraw() {
        const {amount} = await inquirer.prompt([{
            type: 'input',
            name: 'amount',
            message: 'How much would you like to withdraw?'
        }])
        await this.bank.createEntry('withdrawl', Number.parseInt(amount));
        return 'loggedInPrompt';
    }

    async viewBalance() {
        const {balance} = await this.bank.getBalance();
        this.ui.log.write(`You have $${balance}\n`);
        return 'loggedInPrompt';
    }

    async viewHistory() {
        const {history} = await this.bank.getHistory();
        let total = 0;
        const rows = history.map(({type, amount}) => {
            switch (type) {
                case 'withdrawl':
                    total -= amount;
                    return `${type}\t($${amount})\t$$${total}\n`;
                case 'deposit':
                    total += amount;
                    return `${type}\t\t$${amount}\t$$${total}\n`;
                default:
                    return `${type}\t\t--\t$${total}\n`;
            } 
        })
        this.ui.log.write("Transaction\tAmount\tBalance\n");
        this.ui.log.write(rows.join(""));
        return 'loggedInPrompt';
    }
}

module.exports = { CommandLineInterface };