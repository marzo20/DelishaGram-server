const express = require('express')
const router = express.Router()
const axios = require("axios")

router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        const header = {
            headers: {
                "Authorization": `Bearer ${req.body.key}`,
            }
        }
        const yelpResponse = await axios
            .get(`https://api.yelp.com/v3/businesses/search?term=${req.body.term}&latitude=${req.body.lat}&longitude=${req.body.long}`, header)
        console.log(yelpResponse.data)

        res.status(200).json(yelpResponse.data)
    } catch (err) {
        res.status(500).json({ msg: 'server error' })
    }
})

module.exports = router