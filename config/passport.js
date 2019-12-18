const passport = require('passport');
const LocalStrategy = require('passport-local');
const UserModel = require('./../database/models/user_model');

passport.use(new LocalStrategy({
    usernameField: 'name'
}, async (name, password, done) => {
    console.log('localstrategy called');
    const user = await UserModel.findOne({ name })
        .catch(done);

    if (!user || !user.verifyPasswordSync(password)) {
        return done(null, false);
    }

    return done(null, user);
    }
));

module.exports = passport;