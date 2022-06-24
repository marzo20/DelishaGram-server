const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	// imgURL: {
	// 	type: String,
	// 	required: true
	// },
	content: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		required: true
	},
	
}, {
	timestamps: true
})

module.exports = mongoose.model('Post', PostSchema)