
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
  * [ ] Better server side validation
  * [ ] Web/Forms validation
  * [ ] CLI validation
  * [ ] minimal css styling
  * [ ] More unit testing - at lest the other repo
  * [ ] make cli work with password fields
  * [ ] logging for api
  * [ ] look into removing cookie parser and url parser (I think they are built into express)
  * [ ] README

