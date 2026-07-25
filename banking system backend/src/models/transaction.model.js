const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, 'Transaction must associate with a from Account'],
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, 'Transaction must associate with a to Account'],
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'completed', 'failed', 'reversed'],
            message: 'Invalid transaction status'
        },
        default: 'pending'
    },
    amount: {
        type: Number,
        required: [true, 'Transaction must have an amount'],
        min: [0, 'Transaction amount must be greater than 0']
    },
    idempotencyKey: {
        type: String,
        required: [true, 'Transaction must have an idempotency key'],
        index: true,
        unique: true
    }
},{
    timestamps: true
});

const transactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = transactionModel;