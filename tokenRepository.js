const jwt = require('jsonwebtoken')
require('dotenv').config()

let refreshTokens = []

function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '30m' })
}

function generateRefreshToken(payload) {
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN)
    refreshTokens.push(refreshToken)
    return refreshToken
}

function authenticateAccessToken(req, res, next) {
    const authHeaders = req.headers['authorization']
    const accessToken = authHeaders && authHeaders.split(' ')[1]
    if (!accessToken) return res.sendStatus(401)
    jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err) => {
        if (err) return res.sendStatus(403)
        next()
    })
}

function authenticateRefreshToken(req, res, next) {
    try {
        const refreshToken = req.body.refreshToken
        if (refreshToken && refreshTokens.includes(refreshToken)) {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
                if (err) return res.sendStatus(403)
                req.newAccessToken = generateAccessToken({ id: user.id, email: user.email })
                next()
            })
        } else return res.sendStatus(403)
    } catch (err) {
        next(err)
        return res.send(err)
    }
}

function deleteRefreshToken(refreshToken) {
    refreshTokens = refreshTokens.filter(token => token !== refreshToken)
    return
}

module.exports = {
    refreshTokens,
    generateAccessToken,
    generateRefreshToken,
    authenticateAccessToken,
    authenticateRefreshToken,
    deleteRefreshToken
}