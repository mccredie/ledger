
// 
newAccount(name, password) -> account object
accountsrepo

//
login(username, password) -> token
logout(token)


// ledger
ledgerepo
deposit(account)
withdraw
checkbalance
history


[Bank] -> AccountRepo
       \
        Sessions
       \
        Ledger
          + createEvent(account)
          + getEvents(account)
          + checkBalance(account)


TODO:
  * [x] Get more UI, perhaps react
  * [x] Remove all async stuff, since it isn't actually needed or used.
  * [x] Consistent Error codes for backend
  * [x] cli that uses rest apis
  * [x] test cli without tmux
  * [x] command line arguments for cli
  * [x] logging for api
  * [x] Better server side validation
  * [x] CLI validation
  * [x] make cli work with password fields
  * [x] Web/Forms validation
  * [x] Handle account creation failure case on web
  * [x] minimal css styling
  * [x] More unit testing - at lest the other repo
  * [x] look into using crypto algs for password storage pbkdf2 and token hmac-sha256
  * [ ] test from scratch
  * [ ] check into github
  * [ ] README

