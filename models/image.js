const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({
    cloud_id: {
        type: String,
    },
    posts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }
})

module.exports = mongoose.model('Image', ImageSchema)