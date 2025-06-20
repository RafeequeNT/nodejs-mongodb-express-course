const mongoose = require('mongoose')
const Schema = mongoose.Schema;



var favouriteSchema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,

    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }],

}, {
    timestamps: true
});


var Favourites = mongoose.model('Favourite', favouriteSchema)
module.exports = Favourites
