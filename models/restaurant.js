const mongoose = require('mongoose')

const RestaurantSchema = new mongoose.Schema({
    yelpRestaurantId: {
		type: String,
		required: true
	},
    name: {
		type: String
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
}, {
	timestamps: true
})

module.exports = mongoose.model('Restaurant', RestaurantSchema)