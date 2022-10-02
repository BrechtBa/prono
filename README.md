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
npm run build
```

Login to firebase and set the active project to your project:

```
cd ..
firebase login
firebase use --add 
```

Deploy to firebase:

```
firebase deploy
```

# running the backend

```
cd backend
node index.js
```
