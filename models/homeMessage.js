/**
 * Created by dougritzinger on 10/21/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var homeMessageSchema = new Schema({
    content: String
});

var HomeMessage = mongoose.model('homeMessage',homeMessageSchema);

module.exports = HomeMessage;
