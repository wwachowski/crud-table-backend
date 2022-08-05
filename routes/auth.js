const express = require('express')
const router = express.Router()
const userRepository = require('../schemas/userRepository.js')
const bcrypt = require('bcrypt')
const tokenRepository = require('../tokenRepository')
router.route('/login')
    .post(async (req, res) => {
        const user = await userRepository.getUser({ 'email': req.body.email })
        try {
            if (bcrypt.compareSync(req.body.password, user.password) && user.status==='active') {
                const accessToken = tokenRepository.generateAccessToken({ id: user.id, email: user.email })
                const refreshToken = tokenRepository.generateRefreshToken({ id: user.id, email: user.email })
                userRepository.patchUserLoginDate(user.id)
                res.json({ accessToken: accessToken, refreshToken: refreshToken })
            } else {
                return res.sendStatus(403)
            }
        } catch {
            return res.sendStatus(500)
        }
    })

router.route('/token')
    .post(tokenRepository.authenticateRefreshToken, async (req, res) => {
        if (req.newAccessToken) {
            tokenRepository.deleteRefreshToken(req.body.refreshToken)
            return res.json(req.newAccessToken)
        } else {
            return res.sendStatus(401)
        }
    })

module.exports = router