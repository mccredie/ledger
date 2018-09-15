
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
  * [ ] Input validation / consistent
  * [ ] minimal css styling
  * [ ] More unit testing - at lest the other repo
  * [ ] Validation for cli and web
  * [ ] cli that uses rest apis
  * [ ] test cli without tmux
  * [ ] README

