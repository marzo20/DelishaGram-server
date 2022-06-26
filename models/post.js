const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
	// imgURL: {
	// 	type: String,
	// 	required: true
	// },
	restaurant: String,
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
	dish: String
	
}, {
	timestamps: true
})

module.exports = mongoose.model('Post', PostSchema)