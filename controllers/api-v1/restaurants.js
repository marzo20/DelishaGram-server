const express = require('express')
const router = express.Router()
const axios = require("axios")

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

module.exports = router