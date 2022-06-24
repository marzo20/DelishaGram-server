const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
	// imgURL: {
	// 	type: String,
	// 	required: true
	// },
	content: {
		type: String,
		required: true
	},
	rating: {
		type: Number
	},
	Poster:{
		type: mongoose.Schema.Types.ObjectId,
        ref: "User"
	},
	Dish:{
		type: mongoose.Schema.Types.ObjectId,
        ref: "Dish"
	},
	
}, {
	timestamps: true
})

module.exports = mongoose.model('Post', PostSchema)