const accountModel = require('../models/account.model');
const ledgerModel = require('../models/ledger.model');
const transactionModel = require('../models/transaction.model');
const mongoose = require('mongoose');

async function createAccount(req, res) {
    const user = req.user; // Assuming the user is attached to the request object by the auth middleware
    const account = await accountModel.create({ user: user.id });
    res.status(201).json({ account });
}

async function getAccounts(req, res) {
    const accounts = await accountModel.find({ user: req.user.id });

    res.status(200).json({ accounts });
}

async function getAccountBalance(req, res) {
    const { accountId } = req.params;
    const account = await accountModel.findOne({ _id: accountId, user: req.user.id });

    if (!account) {
        return res.status(404).json({ message: 'Account not found' });
    }
     
    const balance = await account.getBalance(); 
    
    res.status(200).json({
        accountId: account._id, 
        balance: balance });
}

async function mockDeposit(req, res) {
    const { accountId, amount } = req.body;
    if (!accountId || !amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid accountId or amount' });
    }

    const account = await accountModel.findOne({ _id: accountId, user: req.user.id });
    if (!account) {
        return res.status(404).json({ error: 'Account not found' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const idempotencyKey = `deposit-${accountId}-${Date.now()}`;
        const transaction = (await transactionModel.create([ {
            fromAccount: accountId,
            toAccount: accountId,
            amount: amount,
            idempotencyKey: idempotencyKey,
            status: 'completed'
        } ], { session }))[0];

        await ledgerModel.create([ {
            account: accountId,
            transaction: transaction._id,
            amount: amount,
            type: 'credit'
        } ], { session });

        await session.commitTransaction();
        session.endSession();

        const newBalance = await account.getBalance();
        return res.status(200).json({ message: 'Deposit successful', balance: newBalance });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ error: error.message });
    }
}

async function getAccountLedger(req, res) {
    const { accountId } = req.params;
    const account = await accountModel.findOne({ _id: accountId, user: req.user.id });

    if (!account) {
        return res.status(404).json({ message: 'Account not found' });
    }

    const ledger = await ledgerModel.find({ account: accountId })
        .populate('transaction')
        .sort({ _id: -1 }); // Show newest first

    res.status(200).json({ ledger });
}

module.exports = {
    createAccount,
    getAccounts,
    getAccountBalance,
    mockDeposit,
    getAccountLedger,
};