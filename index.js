const express = require('express');
const app=express();
const session = require('express-session');
const passport = require('passport');

app.set('view engine','ejs');

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID='1038788731403-keq31ujgbtc9j0krvsso1s4klv4qb62p.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET='lXhJzUDa6gXDt9h06qk0nA2q';


var userProfile;

app.use(session({
    resave:false,
    saveUninitialized:true,
    secret:'SECRET'
}));


app.use(passport.initialize());
app.use(passport.session());

app.get('/',function(req,res){
    res.render('pages/auth');
})




app.get('/success',(req,res)=>res.send(userProfile));
app.get('/error',(req,res)=>res.send('Error in logging'));

passport.serializeUser(function(user,cb){
    cb(null,user);
})

passport.deserializeUser(function(obj,cb){
    cb(null,obj);
})

passport.use(new GoogleStrategy({
    clientID:GOOGLE_CLIENT_ID,
    clientSecret:GOOGLE_CLIENT_SECRET,
    callbackURL:"http://localhost:3000/auth/google/callback"

},
function(accessToken,refreshToken,profile,done){
    userProfile=profile;
    return done(null,userProfile);
}));


app.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));

app.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/error'}),
function(req,res){
    res.redirect('/success');
})


const port = process.env.PORT || 3000;

app.listen(port,()=>{console.log('App listening on port' +port)});

