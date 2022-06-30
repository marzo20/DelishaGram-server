const express = require('express')
const router = express.Router()
const axios = require("axios")
const db = require('../../models')

router.get('/yelpApi', async (req, res) => {
    try {
        // console.log(req.query)
        const header = {
            headers: {
                "Authorization": `Bearer ${process.env.YELP_API_KEY}`,
            }
        }
        let yelpResponse = ""
        if (req.query.location === "Current Location") {
            yelpResponse = await axios
                .get(`https://api.yelp.com/v3/businesses/search?term=${req.query.term}&latitude=${req.query.lat}&longitude=${req.query.long}`, header)
        } else {
            yelpResponse = await axios
                .get(`https://api.yelp.com/v3/businesses/search?term=${req.query.term}&location=${req.query.location}`, header)
        }

        console.log(yelpResponse.data)

        res.status(200).json(yelpResponse.data)
    } catch (err) {
        res.status(500).json({ msg: 'server error' })
    }
})

// search by restaurant name
router.get("/search/:name", async (req, res)=>{
    try {
        // search restaurant by name in req.params
    
        // get all restaurants
        const allRest = await db.Restaurant.find({}, "name image_url address1 city")
        console.log(allRest)
        // filter restaurants by name
        const filteredRest = allRest.filter((rest)=>{
            return rest.name.toLowerCase().includes(req.params.name.toLowerCase())
        })
        console.log(filteredRest)
        
        // return array of filtered restauranats
        if (filteredRest.length > 0) {
            res.status(200).json(filteredRest)
        } else {
            res.status(204).json(filteredRest)
        }
    } catch (error) {
       console.warn(error) 
    }
})

// get information of restaurant by id
router.get("/:id", async (req, res)=>{
    try {
        // find restaurant by Id from req.params
        const foundRest = await db.Restaurant.findById(req.params.id)
        // populate data
        const populatedRest = await foundRest.populate({
            path:"dishes",
            select:"dishName"
        })
        // return response
        res.status(200).json(populatedRest)
    } catch (error) {
        console.warn(error)
    }
})

module.exports = router