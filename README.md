# Authorisation in express

The following are instructions on user authentication and authorisation in express.

## 1. Connect MongoDB

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

Lastly, we need to run the connection in ```app.js``` by requiring in the file.
```Javascript
require('./database/connect');
```

## 2. Schema and model

There is a minor difference from previous projects because we will now include ```mongoose-bcrypt``` in the user schema to encrypt our passwords. First install the module.
```
npm i mongoose-bcrypt
```

Any field on the schema may be encrypted, but we will only encrypt password. We set ```bcrypt: true``` in the schema and ```UserSchema.plugin(require('mongoose-bcrypt'))``` at the bottom.

```Javascript
const UserSchema = new Schema({
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
})
UserSchema.plugin(require('mongoose-bcrypt'));
```

When password is encrypted, mongoose-bcrypt gives us access to the encryptPassword, verifyPassword, and verifyPasswordSync methods. If a different variable, say 'secret' was encrypted, these methods would be encryptSecret, verifySecret, and verifySecretSync.

The model is no different to any we have used previously, in our case:
```Javascript
const mongoose = require('mongoose');
const UserSchema = require('./../schemas/user_schema');

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
```

## 3. User creation

At this stage, we can create a new user. This can be tested by creating a view with a register form, a method to create a user in the controller, and two routes (a get request to render the form and a post request to create the user).

### 3.1 The form for user creation

Our first step is to create the form which users will use to enter their information. Create a ```views``` directory, inside of that name a file ```register.handlebars```. This file will contain the following:
```Javascript
<h1>Register</h1>

<form method='POST' action='/register'>
    <div>
        <label>Name</label>
        <input type='string' name='name'/>
    </div>
    <div>
        <label>Email</label>
        <input type='string' name='email'/>
    </div>
    <div>
        <label>Password</label>
        <input type='password' name='password'/>
    </div>
    <input type='submit' value='Register'/>
</form>
```

Next create the method need in our users controller to render that view. Create ```users_controller.js``` if it does not already exist. Then export the function so it can be called in ```routes.js```.
```Javascript
function register(req, res) {
    res.render('authentication/register');
}
```

Next create the route to trigger this function. 
```Javascript
router.get('/register', UsersController.register);
```

### 3.2 Entering the user into the database

The above allows a user to enter their information, we must now use this information to create an entry in the database.

First we create the method in the controller and export it.
```Javascript
async function createUser(req, res) {
    const { name, email, password } = req.body;
    await UserModel.create({ name, email, password });
    res.redirect('/public');
}
```

Second we create the port route to trigger this method.
```Javascript
router.post('/register', UsersController.createUser);
```

### 3.3 Testing

If everything is correct, we should be able to run the following:
- mongo (to enter the mongo shell)
- use authorisationInExpress (the database we named in .env)
- db.users.find() (to show all users)
- we should see the user we created with a hashed password

### 1.2 Configure passport strategies

The following modules must be installed:
- passport
- passport-local

Create a config directory. Then we follow the passport docs to create a 'local' strategy. 


## 3. User login

### 3.1 Render login page

### 3.2 Check login information

## 4. Restricted access

Having users authenticate themselves is only important if we are intending on restricting the access of un-authenticated users. Therefore the first thing we will do for this app is set up two pages, one called 'public' which will be accessible to everyone, and one called 'private' which will only be accessible to authenticated users.

For public, nothing special is required.

For private, we restrict access by placing middleware (passport) in our router. Passport  authenticates using a JSON web token (JWT) and sends back a message saying unauthorised if the JWT is incorrect.