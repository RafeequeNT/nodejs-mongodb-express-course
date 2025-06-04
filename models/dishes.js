const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// require('mongoose-currency').loadType(mongoose);
// const Currency = mongoose.Types.Currency;
const Currency = mongoose.Types.Decimal128;

var commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true

    },
    description: {
        type: String,
        required: true,

    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true

    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        get: v => parseFloat(v.toString()),
        set: v => mongoose.Types.Decimal128.fromString(v.toString())
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]

}, {
    timestamps: true,
    toJSON: { getters: true },  // add this
    toObject: { getters: true } // mongo cureency  deprecated.
})

var Dishes = mongoose.model('Dish', dishSchema)
module.exports = Dishes
