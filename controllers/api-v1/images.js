const express = require('express')
const router = express.Router()
// multipart form data packages
const multer = require('multer')
// cloudinary npm package to manage uploads
const cloudinary = require('cloudinary').v2
//utility for deleting files
const { unlinkSync } = require('fs')
const db = require('../../models')


// config for multer -- tell it about the static folder
const uploads = multer({ dest: 'uploads/' }) // this is a middleware



// // POST /images -- CREATE an image
// uploads.method('key in the body')
router.post('/', uploads.single('image'), async (req, res) => {
    try {
        //handle upload errors
        if (!req.file) return res.status(400).json({ msg: 'no file uploaded' })
        // upload to cloudinary
        const cloudImageData = await cloudinary.uploader.upload(req.file.path)
        console.log(cloudImageData) // jpg can be saved in the db
        
       
        // png that can be manipulate -- save tot the db
       


    //     const newImg = await db.Image.create({
    //         cloud_id: cloudImageData.public_id
    //    })
    //    console.log(newImg)
        // const cloud_id = await db.Image.create({clougimageData.public_id})
        
        
        // cloudImageData.public_id -- save this to the db!
        const cloudImage = `http://res.cloudinary.com/dvgrz8ozc/image/upload/v1656115612/${cloudImageData.public_id}.png`
        // delete the file so it doesnt clutter up the server folder
        unlinkSync(req.file.path)
        // maybe we should save something in the db ??
        // send image back
        res.json({ cloudImage })

    } catch (err) {
        console.warn(err)
        res.status(503).json({ msg: 'you should look at the server console' })
    }
})

module.exports = router