const mongoose = require('mongoose');
const ledgerModel = require('./ledger.model');

const accountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: {
            values :  ['ACTIVE', 'FROZEN', 'CLOSED'],
            message: 'Status must be either ACTIVE, FROZEN, or CLOSED',
        },
        default: 'ACTIVE'
    },
    currency: {
        type: String,
        required: [true, 'Currency is required'],
        default: 'INR'
    }
},{
    timestamps: true
})

accountSchema.index({ user: 1, status: 1 });

accountSchema.methods.getBalance = async function() {
  const balance = await ledgerModel.aggregate([
    { $match: { account: this._id } },
    { $group: { 
        _id : null,
        totalDebit: { $sum: { $cond: [{ $eq: ['$type', 'debit'] }, '$amount', 0] } },
        totalCredit: { $sum: { $cond: [{ $eq: ['$type', 'credit'] }, '$amount', 0] } }

    } },
    {
        $project: {
            _id: 0,
            balance: { $subtract: ['$totalCredit', '$totalDebit'] }
        }
    }
  ])
    if (balance.length === 0) {
        return 0;
    }
    return balance[0].balance;
}


const AccountModel = mongoose.model('Account', accountSchema);

module.exports = AccountModel;