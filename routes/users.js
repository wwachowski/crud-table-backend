const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const userRepository = require('../schemas/userRepository.js')
const tokenRepository = require('../tokenRepository')

router.route('/create')
    .post(async (req, res) => {
        try {
            console.log("try")
            const email = req.body.email
            console.log(email)
            const isEmailAvailable = !(await userRepository.getUser({ 'email': email }))
            if (email && isEmailAvailable) {
                console.log("Err")
                const hashedPassword = await bcrypt.hash(req.body.password, 10)
                req.body.password = hashedPassword
                await userRepository.createUser(req.body)
                return res.send(true)
            } else {
                console.log("Error 500")
                return res.sendStatus(500)
            }
        } catch (err) {
            console.log("catch")
            return res.send(err)
        }
    })

router.use(tokenRepository.authenticateAccessToken)

router.route('/')
    .get(async (req, res) => {
        try {
            return res.json(await userRepository.getAllUsers())
        } catch {
            return res.sendStatus(403)
        }
    })
    .patch(async (req, res) => {
        try {
            await userRepository.patchMultipleUsersStatus(req.body.status, req.body.ids)
            return res.send(true)
        } catch {
            return res.sendStatus(403)
        }
    })
    .delete(async (req, res) => {
        try {
            await userRepository.deleteMultipleUsersById(req.body.ids)
            return res.send(true)
        } catch {
            return res.sendStatus(403)
        }
    })

router.route('/:userId')
    .get(async (req, res) => {
        try {
            if (req.doesUserExist) {
                return res.json(await userRepository.getUser({ 'id': req.id }))
            } else {
                return res.sendStatus(500)
            }
        }
        catch (err) {
            next(err)
            return res.send(err)
        }
    })
    .delete(async (req, res) => {
        try {
            if (req.doesUserExist) {
                await userRepository.deleteUserById(req.id)
                return res.send(true)
            } else {
                return res.sendStatus(500)
            }
        } catch (err) {
            next(err)
            return res.send(err)
        }
    })
    .patch(async (req, res) => {
        try {
            const status = req.body.status
            if (req.doesUserExist && (status === 'blocked' || status === 'active')) {
                await userRepository.patchUserStatus(status, req.id)
                return res.send(true)
            } else {
                return res.sendStatus(500)
            }
        } catch (err) {
            next(err)
            return res.send(err)
        }

    })

router.param('userId', async (req, res, next, userId) => {
    try {
        req.id = parseInt(userId, 10)
        if (req.id) {
            req.doesUserExist = !!(await userRepository.getUser({ "id": parseInt(req.params.userId) }))
            next()
        }
        else {
            return res.sendStatus(500)
        }
    }
    catch (err) {
        next(err)
        return res.send(err)
    }
})

module.exports = router