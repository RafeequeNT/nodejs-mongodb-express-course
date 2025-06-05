const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Currency = mongoose.Types.Decimal128;

const leaderSchema = new Schema({
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

}, {
    timestamps: true,
    toJSON: { getters: true },  // add this
    toObject: { getters: true } // mongo cureency  deprecated.
})

var Promotions = mongoose.model('Promotion', promotionSchema)
module.exports = Promotions
