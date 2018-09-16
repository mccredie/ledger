
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

const LoginAccountForm = () => ( 
    <div>
        <h2>Login</h2>
        <form action="/login" method="post" >
        <label for="accountName">Account Name: </label>
        <input type="text" name="accountName"></input>
        <label for="password">Password: </label>
        <input type="password" name="password"></input>
        <button>Login</button>
        </form>
    </div>
);

class CreateAccountForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            accountName: "",
            password: "",
            createdAccount: null,
            error: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAccountNameChange = this.handleAccountNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleInvalidPassword = this.handleInvalidPassword.bind(this);
        this.handleInvalidAccount = this.handleInvalidAccount.bind(this);
    }
    render() {
        return (
        <div>
          <h2>Create Account</h2>
          <form action="/api/account" method="post" onSubmit={this.handleSubmit}>
            <label for="accountName">Account Name: </label>
            <input type="text" name="accountName" required={true} pattern="^\w{4}\w*$" onInvalid={this.handleInvalidAccount} onChange={this.handleAccountNameChange} value={this.state.accountName}></input>
            <label for="password">Password: </label>
            <input type="password" name="password" required={true} pattern="^.{4}.*$" onInvalid={this.handleInvalidPassword} onChange={this.handlePasswordChange} value={this.state.password}></input>
            <button>Create Account</button>
          </form>
          {this.state.error? <p><em>Error Creating Account</em></p>: null}
          {this.renderCreated()}
        </div>);
    }
    renderCreated() {
        if (this.state.createdAccount) {
            return <div className="account-added">Account Added: <em>{this.state.createdAccount}</em></div>;
        }
    }
    handleAccountNameChange(e) {
        e.target.setCustomValidity("");
        this.setState({accountName: e.target.value});
    }
    handlePasswordChange(e) {
        e.target.setCustomValidity("");
        this.setState({password: e.target.value});
    }
    handleInvalidAccount(e) {
        e.target.setCustomValidity("The account name must be at least 4 characters long and consist of only letters, numbers or underscore ('_')");
    }
    handleInvalidPassword(e) {
        e.target.setCustomValidity("The password must be at least 4 characters long")
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
            if (account.error) {
                this.setState({error: true, accountName: "", password: "", createdAccount: null});
            } else {
                this.setState({createdAccount: account.name, accountName: "", password: "", error: false});
            }
        };
    }
}

class TransactionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'deposit',
            amount: 1
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
              <option value="withdrawl">Withdraw</option>
            </select>
            <label for="amount">Amount: </label>
            <input type="number" name="amount" min="1" step="1" value={this.state.amount} onChange={this.handleAmountChange}></input>
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
    <div>Balance <em>${balance}</em></div>
);

const History = ({history}) => {
    let runningTotal = 0;
    return <table className="transactions">
        <thead>
            <tr>
                <th>#</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Balance</th>
            </tr>
        </thead>
        <tbody>
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
        </tbody>
    </table>;
}

const fragment = window.location.hash.substr(1);
let domContainer = document.querySelector('#app_container');
ReactDOM.render(<App fragment={fragment}/>, domContainer);