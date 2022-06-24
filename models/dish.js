const mongoose = require('mongoose')

const DishSchema = new mongoose.Schema({
	dishName: {
		type: String,
	},
	Posts:[{
		type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
	}],
	Restaurant:{
		type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
	},
	
}, {
	timestamps: true
})

module.exports = mongoose.model('Dish', DishSchema)