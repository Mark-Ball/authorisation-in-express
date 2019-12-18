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

## 3. User login

We are using a passport local strategy (i.e. user name and password) as our first authentication strategy. To do this we must
- install the modules
- set up the configuration file
- use the configuration file in app.js
- add authenticate middleware in the route
- create the login page which will be used to send the information
- set up the methods to (1) render the login page and (2) handle if login is successful

Note that at this stage, we are not using sessions or JWT.

### 3.1 Configure passport strategies

The following modules must be installed:
- passport
- passport-local

Create a config directory. Then we follow the passport docs to create a 'local' strategy. By default, the fields that passport will check are 'username' and 'password'. We are using 'name' and 'password', so we must include a configuration object as the first argument with ```usernameField: 'name'``` to handle this.

```Javascript
const passport = require('passport');
const LocalStrategy = require('passport-local');
const UserModel = require('./../database/models/user_model');

passport.use(new LocalStrategy({
    usernameField: 'name'
}, async (name, password, done) => {
    const user = await UserModel.findOne({ name })
        .catch(done);

    if (!user || !user.verifyPasswordSync(password)) {
        return done(null, false);
    }

    return done(null, user);
    }
));

module.exports = passport;
```

Then remember to use ```passport.js``` in ```app.js```.
```Javascript
const passport = require('passport');
require('./config/passport');
app.use(passport.initialize());
```

### 3.1 Render login page

We must include a form for users to enter their login information. Note that the names for the data entered through this form must be the same as in the configuration.

E.g. if we are calling a field 'name' in the form, we must use 'name' in passport.js or else passport will look for a name property on the request and when it can't find one, authentication will fail.

### 3.2 Check login information

To check login information we include ```passport.authenticate``` in our route. The route we are authenticating is the ```post '/login'``` route.
```Javascript
router.post('/login', 
    passport.authenticate('local', {
        failureRedirect: '/login',
        session: false
    }), 
    UsersController.login);
```

At this stage, because we have not set up sessions, we must include ```session: false``` in the authenticate method or else we will get an error for failure to serialize the user.

Lastly we create the ```login``` method in the user controller. In our case it just redirects to another page.

## 4. Restricted access

Having users authenticate themselves is only important if we are intending on restricting the access of un-authenticated users. Therefore the first thing we will do for this app is set up two pages, one called 'public' which will be accessible to everyone, and one called 'private' which will only be accessible to authenticated users.

For public, nothing special is required.

For private, we restrict access by placing middleware (passport) in our router. Passport  authenticates using a JSON web token (JWT) and sends back a message saying unauthorised if the JWT is incorrect.