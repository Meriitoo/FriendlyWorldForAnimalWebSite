const User = require('../models/User');
const bcrypt = require('bcrypt');

const jwt = require('../lib/jsonwebtoken');
const { SECRET } = require('../constants');

exports.findByUsername = (username) => User.findOne({username});
exports.findByEmail = (email) => User.findOne({email});

exports.register = async (email, password, repeatPassword) =>
{

    if (password !== repeatPassword){
        throw new Error('Password missmatch');
    }
    
    const existingUser = await this.findByUsername(email);

    if (password.length < 4){
        throw new Error('Password too short');
    }

    if (existingUser){
        throw new Error('User exists');
    }

    //Add hash and salt
    const hashedPassword = await bcrypt.hash(password, 10);

   await  User.create ({ email, password: hashedPassword }); 

   return this.login(email, password); //login automatically after register
};

exports.login =  async (email, password) => 
{
    //User exists
    const user = await this.findByEmail(email);

    if (!user) {
        throw new Error('Invalid email or password');
    }

    if (!password) {
        throw new Error('Password is required');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Invalid email or password');
    }

    //Generate token
    const payload = {
        _id: user.id,
        email,
        username: user.username,
    };

   const token = await jwt.sign(payload, SECRET);

   return token;

};
   