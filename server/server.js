require("dotenv").config()

const app = require("./src/app")
const connectToDB = require("./src/config/db")
const userModel = require("./src/models/user.model")
const accountModel = require("./src/models/account.model")

const PORT = process.env.PORT || 3000
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@bank.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin123"
const ADMIN_NAME = process.env.ADMIN_NAME || "Bank Admin"

function generateAccountNumber() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString()
}

async function ensureAdminAccount() {
    try {
        let admin = await userModel.findOne({ email: ADMIN_EMAIL }).select('+systemUser')
        if (!admin) {
            admin = await userModel.create({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                name: ADMIN_NAME,
                systemUser: true
            })
            console.log(`Created admin user ${ADMIN_EMAIL}`)
        } else if (!admin.systemUser) {
            admin.systemUser = true
            await admin.save()
            console.log(`Upgraded existing user ${ADMIN_EMAIL} to system user`)
        }

        const existingAccount = await accountModel.findOne({ user: admin._id })
        if (!existingAccount) {
            await accountModel.create({
                user: admin._id,
                accountNumber: generateAccountNumber()
            })
            console.log(`Created admin account for ${ADMIN_EMAIL}`)
        }
    } catch (error) {
        console.error("Failed to ensure admin account:", error)
    }
}

connectToDB()
    .then(() => ensureAdminAccount())
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch((error) => {
        console.error("Server initialization failed:", error)
    })