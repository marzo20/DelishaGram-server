const router = require('express').Router()
const express = require('express')
const db = require('../../models')
// const jwt = require('jsonwebtoken')


// GET /dishes -- take a search from user and show all dishes that match req.params

router.get('/search/:dishname', async (req, res) => {
    try {
        // find all posts
        const foundDish = await db.Dish.find(req.params.dishName)
        // send to the client
        res.json(foundDish)
    } catch (err) {
        res.status(500).json({ msg: 'server error' })
    }
})

module.exports = router