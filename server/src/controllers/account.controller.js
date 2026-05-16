const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const mongoose = require("mongoose")


async function createAccountController(req, res) {

    const user = req.user;
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    try {
        const account = await accountModel.create({
            user: user._id,
            accountNumber,
        });

        res.status(201).json({
            account,
        });
    } catch (error) {
        console.error("Create Account Error:", error);
        res.status(500).json({ message: error.message || "Failed to create account" });
    }

}

async function getUserAccountsController(req, res) {
    try {
        const accounts = await accountModel.find({ user: req.user._id });
        const accountsWithBalance = await Promise.all(accounts.map(async (acc) => {
            const balance = await acc.getBalance();
            return {
                ...acc.toObject(),
                balance
            };
        }));
        res.status(200).json(accountsWithBalance);
    } catch (error) {
        console.error("Get Accounts Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getAccountBalanceController(req, res) {
    const { accountId } = req.params;

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        })
    }

    const balance = await account.getBalance();

    res.status(200).json({
        accountId: account._id,
        balance: balance
    })
}


async function addMoneyController(req, res) {
    const { accountId } = req.params
    const { amount, idempotencyKey } = req.body

    if (!amount || !idempotencyKey) {
        return res.status(400).json({
            message: "amount and idempotencyKey are required"
        })
    }

    const parsedAmount = Number(amount)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({
            message: "Amount must be a positive number"
        })
    }

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        })
    }

    if (account.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Account must be ACTIVE to receive top up"
        })
    }

    const existing = await transactionModel.findOne({ idempotencyKey })
    if (existing) {
        if (existing.status === "COMPLETED") {
            return res.status(200).json({
                message: "Top up already processed",
                transaction: existing
            })
        }
        return res.status(200).json({
            message: "Top up is still processing"
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const transaction = await transactionModel.create([
            {
                fromAccount: account._id,
                toAccount: account._id,
                amount: parsedAmount,
                idempotencyKey,
                status: "PENDING",
            },
        ], { session })

        await ledgerModel.create([
            {
                account: account._id,
                amount: parsedAmount,
                transaction: transaction[0]._id,
                type: "CREDIT",
            },
        ], { session })

        await transactionModel.findOneAndUpdate(
            { _id: transaction[0]._id },
            { status: "COMPLETED" },
            { session }
        )

        await session.commitTransaction()
        session.endSession()

        return res.status(201).json({
            message: "Top up completed successfully",
            transaction: transaction[0],
        })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        return res.status(500).json({
            message: error.message || "Top up failed"
        })
    }
}

module.exports = {
    createAccountController,
    getUserAccountsController,
    getAccountBalanceController,
    addMoneyController
}
