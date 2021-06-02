Prono
=====

Website/app to make predictions on soccer tournaments among friends for fun.

# Prequisites

A firebase account.

* firebase-cli  `npm install -g firebase-tools`


# Deploying

Clone the project to a temporary directory.
```
mkdir ~/tmp
cd ~/tmp
git clone https://github.com/BrechtBa/prono.git
```

Build the app:

```
cd app
npm run-script build
```

Deploy to firebase:
```
cd ..
firebase deploy
```
