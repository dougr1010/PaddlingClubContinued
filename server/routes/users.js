/**
 * Created by dougritzinger on 10/21/15.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var Users = require('../../models/User');


//add a new user
router.post('/reg', function(req, res, next){
    console.log('hit users/reg post');
    console.log('req.body.username: ',req.body.username);
    var newUser = {
        username : req.body.username,
        password : req.body.password,
        isTripLeader : false,
        isPresident : false,
        isWebMaster : false,
        leadingTrips : [],
        takingTrips : []
    };

    Users.create(newUser, function(err, post){
        if(err) {
            console.log('new user write error');
            console.log(err);
        } else {
            res.send('200');
            console.log('new user write 200')
        }

    })
});




//get a specified user or all of them
router.get('/getUser/:username?', function(req, res, next) {
    console.log("hit getUser endpoint");
    var username = req.params.username;
    console.log('looking for username: ',username);
    if(username){
        Users.findOne({username:username}, function(err, users){
            res.json(users);
        })
    } else {
        Users.find({}, function(err, users){
            res.send(users);
        })
    }
});




//update user -add a trip
router.post('/updateUser', function(request, response){
    console.log('hit /updateUser endpoint');
    var username=request.body.username;
    var newTrip = request.body.tripId;
    console.log('user to update: ', username);

    Users.findOneAndUpdate(
        {username:username},
        {$push:{takingTrips:newTrip}},
        {safe:true,upsert:true},
        function(err,toDo){
            if(err) console.log(err);
            response.sendStatus(200);
        })
});





//authenticate a registered user
router.post('/login',
    passport.authenticate('local'),
    function(req, res, err) {
        res.sendStatus(200);
    }
);



module.exports = router;