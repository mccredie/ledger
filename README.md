

## How to build and run

Note that this was developed using Node v10.10 (stable) running on a mac. The web client was tested using Chrome. For best results try to duplicate that setup.

Install node depencencies
```bash
> npm install
```

### Build

```bash
> npm run build
```

### Unit Tests

```bash
> npm test
```

### Run Server
```bash
> npm run serve
```

or

```bash
./server
```

or 

```bash
node ./server
```

### Run Command Line Tool

By default the command line tool will run against the server at `http://localhost:3000`. Use the `--local` option to run the cli without the server. Use the `--help` option for more info.

```bash
./cli
```

or

```bash
node ./cli
```

## Technologies Used

I tried to pick a minimal set of technologies, so as not to create a bloated
package. Where possible I used a built-in functionality instead of depending on
third packages.

For the server `express` was used for routing and generally dealing with
http. There are a couple of packages that help with parsing post bodies that
are also included.

For the web client `react` was used. However note that I took steps to avoid
including `react`, instead using a CDN copy. I also avoided introducing webpack
or any other bundler. While those are useful for larger projects, I didn't
think the added complexity was worth the effort. Babel is used to enable the
`jsx` syntax, and it does help make the resulting output slightly more
portable. A side effect of using babel, but no bundler, is that all of the UI
javascript is in a single file. This was done soley to simplify the build.

For the cli I used a library called `inquirer` to create some _fancy_ menus.  I also used `request-promise-native` for making http requests.

`jest` was used for unit testing.

## Design Overview

This whole design started with the `InMemoryAccountsRepo` and the
`InMemoryLedgerRepo`. These classes are intended to provide an interface that
could easily be reimplemented around a real database.  

The `Bank` class was developed as a Facade around the repos to perform the basic operations of the application.  The original implementation of the command line interface called an instance of the bank class dirrectly.

The `TokenAuthor` was introduced later when it became obvious that too much
of the logic for validating credentials was spread between the `Bank` and the
`InMemoryAccountsRepo`. 

The `CommandLineInterface` class was extracted from the cli, and provided the
opportunity to abstract out a `BankProxy` interface, allowing the same code
to run against either a local instance of `Bank` or a server.

Note that each class has very few dependencies. All composition is done in
the _main_ files (web server or cli code). This results in a modular design
that is easy to test and extend.

## Design Decisions

While implementing this I made a few design decisions.

I don't care about overdrafting. You can spend money you don't have. It
should be trivial to add a decorator for the Ledger repo to check the balance
and disallow withdrawls if they result in a negative balance. This would also
require a mutex on the table.

I will emulates tables similar to a RDB. This was mostly because I thought it
would be useful to show a design as I would do in production, with a repo
class wrapping all database operations. At least this keeps the state nice
and contained. Since the repos are injected into the bank class at the main
entry point, it would be trivial to implement another class with the same
interface that uses an actual database.

Money is handled as integers. It shows as dollars in both interfaces, but it
could be whatever unit is most appropriate. If you want cents, then think of
it as cents. Either way, floating point is a bad choice for currency.

## What are the components

The server specific code is all in `./server`.

The web client is all in a single file (discussed above) `./web.js`

The command line is mostly implemented in `src/CommandLineInterface.js`, but the main entry point is `./cli`

## Toward Production

So, you want to make this horizontally scalable so that it can work in
production behind an auto-scaler, or even put it into AWS lambda. This is what you need to do:

1. Get a real database, and implement the *repos* to work with that database.
This new implementation should pass the same unit tests though.
2. Make it configurable. My preference is to use environment variables (see
the 12 factor app). Currently the secret used for generating hmacs for the
tokens is randomly generated every time the server starts. It should either
be passed in, or somehow shared.
3. We should either use JWTs instead of the dumb token scheme I came up with,
or at least something that expires.

Obviously there are a load of improvements to be made to the UI, but I won't
get into those.