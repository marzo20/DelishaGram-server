const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    commenter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
	timestamps: true
})

module.exports = mongoose.model('Comment', CommentSchema)