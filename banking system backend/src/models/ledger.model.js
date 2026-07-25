const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, 'Ledger must associate with an Account'],
        index: true,
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: [true, 'Ledger must associate with a Transaction'],
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: [true, 'Ledger must have an amount'],
        immutable: true
    },
    type: {
        type: String,
        enum: {
            values: ['credit', 'debit'],
            message: 'type must be either credit or debit'
        },
        required: [true, 'Ledger must have a type'],
        immutable: true
    }

})

function preventLdgerModification() {
    throw new Error('Ledger entries are immutable and cannot be modified');
}


ledgerSchema.pre('updateOne', preventLdgerModification);
ledgerSchema.pre('findOneAndUpdate', preventLdgerModification);
ledgerSchema.pre('updateMany', preventLdgerModification);
ledgerSchema.pre('deleteOne', preventLdgerModification);
ledgerSchema.pre('remove', preventLdgerModification);
ledgerSchema.pre('deleteMany', preventLdgerModification);
ledgerSchema.pre('findOneAndDelete', preventLdgerModification);
ledgerSchema.pre('findOneAndReplace', preventLdgerModification);

const LedgerModel = mongoose.model('Ledger', ledgerSchema);

module.exports = LedgerModel;