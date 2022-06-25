const mongoose = require('mongoose')

const DishSchema = new mongoose.Schema({
	dishName: {
		type: String,
	},
	posts:[{
		type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
	}],
	restaurant:{
		type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
	},
	
}, {
	timestamps: true
})

module.exports = mongoose.model('Dish', DishSchema)