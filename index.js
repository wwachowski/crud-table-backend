const express = require('express')
const app = express()
const userRouter = require('./routes/users')
const authRouter = require('./routes/auth')
const cors = require('cors')

app.use(cors({
    origin: "*"
}))

app.use(express.json())

app.use('/auth', authRouter)
app.use('/users', userRouter)

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running: ${process.env.PORT || 8080}`)
}) 