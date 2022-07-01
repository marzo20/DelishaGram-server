const router = require('express').Router()
const express = require('express')
const db = require('../../models')
// const { create } = require('../../models/user')

router.get("/:postId", async (req, res) => {
    try {
        // expects postId from Req.Params
        console.log("reqParamsId:",req.params.postId)

        // find post 
        const foundPost = await db.Post.findById(req.params.postId)
        
        // populate with comments
        const commentsArr = await foundPost.populate({
            path:"comments",
            select: "content",
            populate:{
                path:"commenter",
                select:"userName"
            }
        })
        // console.log(commentsArr)

        // return response
        res.status(200).json(commentsArr)

    } catch (error) {
        console.warn(error)
    }
})

router.post("/", async (req, res) => {
    try {
        console.log("req.body",req.body)

        // expects content, postId, and Commenter(UserId) in req.body
        const foundPost = await db.Post.findById(req.body.postId)
        console.log(foundPost)
        const foundCommenter = await db.User.findById(req.body.userId)
        console.log(foundCommenter)
        

        // creates comment with content
        const createComment = await db.Comment.create({
            content: req.body.content
        })  
        console.log(createComment)

        // connect comment to post and commenter found
        createComment.post = foundPost
        createComment.commenter = foundCommenter
        await createComment.save()

        // connect post with comment
        foundPost.comments.push(createComment)
        await foundPost.save()

        // connect user with comment
        foundCommenter.comments.push(createComment)
        await foundCommenter.save()

        // send back a response        
        res.sendStatus(200)
    } catch (error) {
        console.warn(error)
    }
})




module.exports = router