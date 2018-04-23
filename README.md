Prono
=====

Website/app to make predictions on soccer tournaments among friends for fun.

# Prequisites

A firebase account.

* polymer-cli
* firebase-cli

# Deploying

Clone the project to a temporary directory.
```
mkdir ~/tmp
cd ~/tmp
git clone https://github.com/BrechtBa/prono.git
```

Build the app with the polymer build tool:

```
cd app
polymer build
```

Deploy to firebase:
```
cd ..
firebase deploy
```