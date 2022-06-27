const router = require('express').Router()
const express = require('express')
const db = require('../../models')
// const jwt = require('jsonwebtoken')


// GET /dishes -- take a search from user and show all dishes that match req.params

router.get('/search/:dishName', async (req, res) => {
    try {
        // find all posts
        const foundDishes = await db.Dish.find({dishName: req.params.dishName}).populate([{
            path: "posts"
        }, {path: 'restaurant'}])
        // send to the client
        res.json(foundDishes)
    } catch (err) {
        res.status(500).json({ msg: 'server error' })
    }
})

module.exports = router