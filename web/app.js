'use strict';

class App extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            accountName: null,
            balance: null,
            history: []
        }
        
        this.handleUpdateAccount = this.handleUpdateAccount.bind(this);
    }

    componentDidMount() {
        this.getAccount();
    }

    render() {
        if (this.isLoggedIn()) {
            return <div>
                <p>Logged In as User <em>{this.state.accountName}</em> <a href="/logout">Logout</a></p>
                {this.renderAccountDetails()}
            </div>;
        } else {
            let message = null;
            if (this.props.fragment == 'loginfailed') {
                message = <p><span>Login Failed</span></p>
            }
            return <div>
                {message}
                <LoginAccountForm />
                <CreateAccountForm />
            </div>;
        }
    }

    renderAccountDetails() {
        return [
            <History history={this.state.history} />,
            <br />,
            <Balance balance={this.state.balance} />,
            <br />,
            <TransactionForm onAccountUpdated={this.handleUpdateAccount}></TransactionForm>
        ];
    }

    getAccount() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/account', true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        xhr.send();

        xhr.onloadend = (e) => {
            const resp = JSON.parse(xhr.response);
            if (resp.name) {
                this.setState({accountName: resp.name});
                this.handleUpdateAccount();
            }
        };
    }

    handleUpdateAccount() {
        this.getBalance();
        this.getHistory();
    }

    getBalance() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/balance', true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        xhr.send();

        xhr.onloadend = (e) => {
            const resp = JSON.parse(xhr.response);
            if (typeof resp.balance !== 'undefined') {
                this.setState(resp);
            }
        };
    }

    getHistory() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/transactions', true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        xhr.send();

        xhr.onloadend = (e) => {
            const resp = JSON.parse(xhr.response);
            if (typeof resp.history !== 'undefined') {
                this.setState(resp);
            }
        };
    }

    isLoggedIn() {
        return !!this.state.accountName;
    }

}

class LoginAccountForm extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
        <div>
          <h2>Login</h2>
          <form action="/login" method="post" >
            <label for="accountName">Account Name: </label>
            <input type="text" name="accountName"></input>
            <label for="password">Password: </label>
            <input type="password" name="password"></input>
            <button>Login</button>
          </form>
        </div>);
    }
}

class CreateAccountForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            accountName: "",
            password: "",
            createdAccounts: []
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAccountNameChange = this.handleAccountNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }
    render() {
        return (
        <div>
          <h2>Create Account</h2>
          <form action="/api/account" method="post" onSubmit={this.handleSubmit}>
            <label for="accountName">Account Name: </label>
            <input type="text" name="accountName" onChange={this.handleAccountNameChange} value={this.state.accountName}></input>
            <label for="password">Password: </label>
            <input type="password" name="password" onChange={this.handlePasswordChange} value={this.state.password}></input>
            <button>Create Account</button>
          </form>
          {this.renderCreated()}
        </div>);
    }
    renderCreated() {
        if (this.state.createdAccounts.length) {
            return (<div>
                <h2>Created Accounts</h2>
                <ul>
                    {this.state.createdAccounts.map(name => <li>{name}</li>)}
                </ul>
            </div>);
        }
    }
    handleAccountNameChange(e) {
        this.setState({accountName: e.target.value});
    }
    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }
    handleSubmit(e) {
        // stop the regular form submission
        e.preventDefault();

        // collect the form data while iterating over the inputs
        var data = {
            accountName: this.state.accountName,
            password: this.state.password
        };

        // construct an HTTP request
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/account', true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        // send the collected data as JSON
        xhr.send(JSON.stringify(data));

        xhr.onloadend = (e) => {
            const account = JSON.parse(xhr.response);
            this.setState({createdAccounts: this.state.createdAccounts.concat([account.name]), accountName: "", password: ""});
        };
    }
}

class TransactionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'deposit',
            amount: 0
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
    }
    render() {
        return (
        <div>
          <h2>Create Transaction</h2>
          <form onSubmit={this.handleSubmit}>
            <label for="type">Transaction Type: </label>
            <select name="type" onChange={this.handleTypeChange}>
              <option value="deposit">Deposit</option>
              <option value="withdraw">Withdraw</option>
            </select>
            <label for="amount">Amount: </label>
            <input type="number" name="amount" min="1" step="1" onChange={this.handleAmountChange}></input>
            <button>Create Transaction</button>
          </form>
        </div>);
    }
    handleTypeChange(e) {
        this.setState({type: e.target.value});
    }
    handleAmountChange(e) {
        this.setState({amount: parseInt(e.target.value)});
    }
    handleSubmit(e) {
        // stop the regular form submission
        e.preventDefault();

        // collect the form data while iterating over the inputs
        var data = {
            type: this.state.type,
            amount: this.state.amount
        };

        // construct an HTTP request
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/transactions', true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        // send the collected data as JSON
        xhr.send(JSON.stringify(data));

        xhr.onloadend = (e) => {
            this.props.onAccountUpdated();
        };
    }
}

const Balance = ({balance}) => (
    <div>Balance <em>{balance}</em></div>
);

const History = ({history}) => {
    let runningTotal = 0;
    return <table>
        <tr>
            <th>#</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Balance</th>
        </tr>
        {history.map((entry, i) => {
            switch(entry.type) {
                case 'withdrawl':
                    runningTotal -= entry.amount;
                    break;
                case 'deposit':
                    runningTotal += entry.amount;
                    break;
            }
            return <tr key={i}>
                <td>{i}</td>
                <td>{entry.type}</td>
                <td>${entry.amount}</td>
                <td>${runningTotal}</td>
            </tr>
        })}
    </table>;
}

const fragment = window.location.hash.substr(1);
let domContainer = document.querySelector('#app_container');
ReactDOM.render(<App fragment={fragment}/>, domContainer);