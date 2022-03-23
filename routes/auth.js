const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require('../model/User');
const jwt = require('jsonwebtoken')
const {registerValidation, loginValidation} = require('../validation');



// REGISTER
router.post('/register', async (req,res) => {
    // Lets validate the data before we make a user
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message); 
    
    //Checking if the user is already exist
    const emailExist = await User.findOne({email: req.body.email});
    // console.log("hi")
    if (emailExist) return res.status(400).send('Email already exists');
    
    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    

    
    //Create a new user
    // const user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: hashedPassword
    // });
    

    try {
        let savedUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword 
        })

        console.log(savedUser)
        res.send(savedUser);
    } 
    catch(err) {
        res.status(400).send(err);
    }

});

//LOGIN
router.post('/login', async (req, res) => {
    //Lets validate the data before log in user
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
        //Check if the email exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Email or password is wrong');
        //Password is correct
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).send('Invalid password')
        
        //Create and assign a token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(token);


        // res.send("Logged in!");

//GET ID
router.get('/id', async (req, res) => {
        const id = await User.findOne({_id:"621f13f25be7ddda34a163c9"});
        if (id) return res.status(400).send('k');
    });
});

//PATCH ID
router.patch('/id', async (req, res) => {
    const update = await User.findByIdAndUpdate("621f13f25be7ddda34a163c9",{name:"rakha"})
    if (update) return res.send(update)

})

//DELETE ID
router.delete('/id/:user', async (req, res) => {
    const del = await User.findByIdAndDelete(req.params.user)
    if (del) return res.send(del)

})



module.exports = router;