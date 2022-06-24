const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
	// imgURL: {
	// 	type: String,
	// 	required: true
	// },
	content: {
		type: String,
	},
	rating: {
		type: Number
	},
	poster:{
		type: mongoose.Schema.Types.ObjectId,
        ref: "User"
	},
	dish:{
		type: mongoose.Schema.Types.ObjectId,
        ref: "Dish"
	},
	
}, {
	timestamps: true
})

module.exports = mongoose.model('Post', PostSchema)