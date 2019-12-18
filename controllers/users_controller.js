const UserModel = require('./../database/models/user_model');

function register(req, res) {
    res.render('authentication/register');
}

async function createUser(req, res) {
    const { name, email, password } = req.body;
    await UserModel.create({ name, email, password });
    res.redirect('/public');
}

function renderLogin(req, res) {
    res.render('authentication/login');
}

function login(req, res) {
    res.redirect('/private');
}

module.exports = {
    register,
    createUser,
    renderLogin,
    login
}