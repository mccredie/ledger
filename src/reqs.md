
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
  Get more UI, perhaps react
  Error codes for backend
  More unit testing
  Validation for cli and web
  README

