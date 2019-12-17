# Authorisation in express

The following are instructions on user authentication and authorisation in express. General steps such as setting up MongoDB, models, views, controllers, and routes will not be included in this guide.

## 1. Configuration

Before we can develop our other functionality, we must have a working connection to a Mongo database. Create a file called ```connect.js``` in the ```database``` directory. In this file we will
- require in mongoose
- connect to a database we specify in .env
    - access environment variables using ```process.env.DB_HOST```, first include ```require('dotenv').config()``` in app.js
- use the node promise library
- log any error with the connection to the console

```Javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', console.log);
```

### 1.1 Schema and model

There is a minor difference from previous projects because we will now include ```mongoose-bcrypt``` in the user schema to encrypt our passwords.

Any field on the schema may be encrypted, but we will only encrypt password. We set ```bcrypt: true``` in the schema and ```UserSchema.plugin(require('mongoose-bcrypt'))``` at the bottom.

```Javascript
const UserSchema = new Schema(
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        bcrypt: true
    }
)
UserSchema.plugin(require('mongoose-bcrypt'));
```

When password is encrypted, mongoose-bcrypt gives us access to the encryptPassword, verifyPassword, and verifyPasswordSync methods. If a different variable, say 'secret' was encrypted, these methods would be encryptSecret, verifySecret, and verifySecretSync.

### 1.2 Configure passport strategies

The following modules must be installed:
- passport
- passport-local

Create a config directory. Then we follow the passport docs to create a 'local' strategy. 

## 2. User creation

### 2.1 The form for user creation

### 2.2 Entering the user into the database

## 3. User login

### 3.1 Render login page

### 3.2 Check login information

## 4. Restricted access

Having users authenticate themselves is only important if we are intending on restricting the access of un-authenticated users. Therefore the first thing we will do for this app is set up two pages, one called 'public' which will be accessible to everyone, and one called 'private' which will only be accessible to authenticated users.

For public, nothing special is required.

For private, we restrict access by placing middleware (passport) in our router. Passport  authenticates using a JSON web token (JWT) and sends back a message saying unauthorised if the JWT is incorrect.