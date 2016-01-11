/**
 * Created by dougritzinger on 10/21/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    password:{type: String, require: true},
    isTripLeader:{type: Boolean},
    isPresident:{type: Boolean},
    isWebMaster:{type: Boolean},
    leadingTrips:{type:Array},
    takingTrips:{type:Array}
});

UserSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);
        //hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash){
            if (err) return next(err);

            //override the clear text password
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch){
        if (err) return callback(err);
        callback(null, isMatch);
    });
};


module.exports = mongoose.model('User', UserSchema);