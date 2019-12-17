const passport = require('passport');
const LocalStrategy = require('passport-local');
const UserModel = require('./../database/models/user_model');

passport.use(new LocalStrategy(async (name, password, done) => {
    const user = await UserModel.findOne(name);
    
}))