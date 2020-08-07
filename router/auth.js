const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValidation} = require('./validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register',  (req,res) => {

    //Validate
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if the user is already in the db
    const emailExist =  User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exist');


    //hash the password
    const salt = bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hash(req.body.password, salt);


    //create a new user
        const user = new User ({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
        });

        try{
            const saveUser = user.save();
            res.send(saveUser);
        }
        catch(err){
        res.status(400).send(err);
        }
    });

    //LOGIN
router.post('/login', (req,res) => {

    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking email 
        const user = User.findOne({ email: req.body.email });
        if(!user) return res.status(400).send('Email dosent exist');

    //Pass is correct
            const validPass =  bcrypt.compare(req.body.password,user.password)
            if(!validPass) return res.status(400).send('Invalid password');

            //create and assign a token 
            const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
            res.header('auth-token'. token).send(token);

            res.send('Success')
    });

module.exports=router;