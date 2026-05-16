const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(cors({
    origin: function (origin, callback) {
        callback(null, true)
    },
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const transactionRoutes = require("./routes/transaction.routes")

app.get("/", (req, res) => {
    res.send("Ledger Service is up and running")
})

app.get("/api", (req, res) => {
    res.json({
        message: "Ledger API is up and running",
        routes: {
            auth: "/api/auth",
            accounts: "/api/accounts",
            transactions: "/api/transactions"
        }
    })
})

app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/transactions", transactionRoutes)

module.exports = app
