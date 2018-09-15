
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
  * [ ] Web/Forms validation
  * [ ] minimal css styling
  * [ ] More unit testing - at lest the other repo
  * [ ] look into removing cookie parser and url parser (I think they are built into express)
  * [ ] README

