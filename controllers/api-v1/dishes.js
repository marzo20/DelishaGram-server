const router = require('express').Router()
const express = require('express')
const db = require('../../models')
// const jwt = require('jsonwebtoken')


// GET /dishes -- take a search from user and show all dishes that match req.params

router.get('/search/:dishName', async (req, res) => {
    try {
        // find all posts
        const foundDishes = await db.Dish.findOne({dishName: req.params.dishName})
        .populate({
                path: "posts",
                populate: [{
                    path: "dish",
                    populate: {
                        path: "restaurant"
                    }
                }, {
                    path: "poster",
                    select: "userName"
                }, {
                    path: "image"
                }]
            })

            // console.log(foundDishes)
            if (foundDishes !== null) {
                res.status(200).json(foundDishes)
            } else {
                res.status(204).json(foundDishes)
            }

        // send to the client
    } catch (err) {
        res.status(500).json({ msg: 'server error' })
    }
})

// get all posts for a dish
router.get("/:id", async (req,res)=>{
    try {
        // get all posts associated with a dish id from req.params
        const foundDish = await db.Dish.findById(req.params.id)
        // populate
        const populatedDish = await foundDish.populate([{
            path:"posts"
        },{
            path:"restaurant", select:"name"
        }])
        console.log(populatedDish)

        // return response
        res.status(200).json({msg:"OK"})
    } catch (error) {
        console.warn(error)
    }
})

// get all posts for a dish and restaurant



module.exports = router