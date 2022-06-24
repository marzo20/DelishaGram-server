const router = require('express').Router()
const db =require('../../models')


// GET /posts -- READ a all posts

router.get('/', async (req, res)=> {
    try{
        // find all posts
        const posts = await db.Post.find({})
        // send to the client
        res.json(posts)
    }catch(err){
        res.status(500).json({ msg: 'server error'})
    }
})

// GET /posts/:id -- details on post
router.get('/:id', async (req, res) => {
    try{
        const post = await db.Post.findById(req.params.id)
        res.json(post)
    }catch(err){
        res.status(500).json({ msg: 'server error'})
    }
})

// POST /posts -- create posts
router.post('/', async (req, res) => {
    try {
        const newPost = await db.Post.create({
            content: req.body.content,
            rating: req.body.rating
        })
        const newRestaurant = await db.Restaurant.create({
            name: req.body.name
        })
        const newDish = await db.Dish.create({
            dishName: req.body.dish
        })
        res.status(201).json(newPost, newRestaurant, newDish)
    }catch(err){
        console.log('post error',err)
        if (err.name === "ValidationError"){
            res.status(400).json({ msg: err.message })
        }
        res.status(500).json({ msg: 'server error'})
    }
})

router.put('/:id', async (req, res)=>{
    try{
        // get id from the url params
        const id = req.params.id
        // search for the id in the db. and update using the req.body
        const options = {new:true }
        const updatedPost = await db.Post.findByIdAndUpdate(id, req.body, options)
        // send the updated post to client
        res.json(updatedPost)
    }catch(err){
        console.log('post error',err)
        if (err.name === "ValidationError"){
            res.status(400).json({ msg: err.message })
        }
        res.status(500).json({ msg: 'server error'})
    }
})

// DELETE /posts/:id --delete posts

router.delete('/:id', async (req, res) => {
    try {
        // get the id from params
        const id = req.params.id
        // delete that post in the db
        await db.Post.findByIdAndDelete(id)
        // send 'no content' status
        res.sendStatus(204) //was successful -- nothing exists
    }catch(err){
        console.log('delete error',err)
        if (err.name === "ValidationError"){
            res.status(400).json({ msg: err.message })
        }
        res.status(500).json({ msg: 'server error'})
    }
})

module.exports = router