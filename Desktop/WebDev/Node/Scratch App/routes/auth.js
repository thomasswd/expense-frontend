const express = require('express')
const router = express.Router()
const passport = require('passport')

//to /auth/google/c
router.get('/google', passport.authenticate('google', { scope: ['profile'] })); 
          
//to /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), 
    (req, res) => {
        res.redirect('/dashboard')
    }
)

//set logout
// /auth/logout and redirect to the login page
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router