const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');
const mongoose = require('mongoose');


async function createTransactionController(req, res) {

    /**
     * 1.validate the request
     */

    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
   
    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
    });
    
    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    });
    
    if(!fromUserAccount || !toUserAccount) {
        return res.status(404).json({ error: 'One or both accounts not found' });
    }
   
    /**
     * 2.validate the idempotency key to ensure that the transaction is not processed multiple times
     */

    const isTransactionAlreadyExists = await transactionModel.findOne({
         idempotencyKey: idempotencyKey 
        });

    if (isTransactionAlreadyExists) {
        if(isTransactionAlreadyExists.status === 'completed') { 
        return res.status(200).json({
             message: 'Transaction already processed',
              transaction: isTransactionAlreadyExists 
            });
    }
    else if(isTransactionAlreadyExists.status === 'pending') {
        return res.status(200).json({
             message: 'Transaction is still pending',
            });
    }
    else if(isTransactionAlreadyExists.status === 'failed') {
        return res.status(500).json({
             message: 'Transaction has failed previously',
            });
    }
    else if(isTransactionAlreadyExists.status === 'reversed') {
        return res.status(500).json({
             message: 'Transaction was reversed, please retry',
            });
    }
}

/**
     * 3.check account status to ensure that both accounts are active before proceeding with the transaction
     */

  if(fromUserAccount.status !== 'ACTIVE' || toUserAccount.status !== 'ACTIVE') {
        return res.status(400).json({ error: 'One or both accounts are not active' });
    }

    /**
     * 4.derive sender balance from ledger and check if the sender has sufficient balance to perform the transaction
     */

    const balance = await fromUserAccount.getBalance();

    if(balance < amount) {
        return res.status(400).json({ error: `Insufficient balance. Current balance: ${balance}. Requested amount: ${amount}` });
    }
     
    let transaction;
    try{

    /**
     * 5. create a new transaction and save it to the database
     */
    const session = await mongoose.startSession();
    session.startTransaction();

    transaction = (await transactionModel.create([ {
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: 'pending'
    } ],{session}))[0];

    const debitLedgerEntry = await ledgerModel.create([ {
        account: fromAccount,
        transaction: transaction._id,
        amount: amount,
        type: 'debit'
    } ],{ session });

    const creditLedgerEntry = await ledgerModel.create([ {
        account: toAccount,
        transaction: transaction._id,
        amount: amount,
        type: 'credit'
    } ],{ session });

    transaction.status = 'completed';
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

}catch (error) {
    return res.status(400).json({
            message: "Transaction is Pending due to some issue, please retry after sometime",
        })

}

    return res.status(201).json({ message: 'Transaction completed successfully', transaction });


}

async function createInitialFundsTransactionController(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    });


    if(!toUserAccount) {
        return res.status(404).json({ error: 'Account not found' });
    }

    const fromUserAccount = await accountModel.findOne({
         user: req.user._id
    });

    if(!fromUserAccount) {
        return res.status(404).json({ error: 'System user account not found' });
    }


    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: 'pending'
    });

    const debitLedgerEntry = await ledgerModel.create([ {
        account: fromUserAccount._id,
        transaction: transaction._id,
        amount: amount,
        type: 'debit'
    } ],{ session });

    const creditLedgerEntry = await ledgerModel.create([ {
        account: toUserAccount._id,
        transaction: transaction._id,
        amount: amount,
        type: 'credit'
    } ],{ session });

    transaction.status = 'completed';
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: 'Initial funds transaction completed successfully', transaction });
}

module.exports = {
    createTransactionController,
    createInitialFundsTransactionController
};