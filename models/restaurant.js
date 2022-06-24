const mongoose = require('mongoose')

const RestaurantSchema = new mongoose.Schema({
    yelpRestaurantId: {
		type: String,
	},
    name: {
		type: String,
		required: true
	},
	address1: {
		type: String
	},
	address2: {
		type: String
	},
	address3: {
		type: String
	},
	city: {
		type: String
	},
    zip_code: {
		type: String
	},
    country: {
		type: String
	},
    state: {
		type: String
	},
    latitude: {
		type: Number
	},
    longitude: {
		type: Number
	},	
	Dishes:[{
		type: mongoose.Schema.Types.ObjectId,
        ref: "Dish"
	}],
}, {
	timestamps: true
})

module.exports = mongoose.model('Restaurant', RestaurantSchema)