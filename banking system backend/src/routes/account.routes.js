const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const accountController = require('../controllers/account.controller');

const router = express.Router();

/**
 * @route POST /api/accounts
 * @desc Create a new account
 * @access Private
 */
router.post('/', authMiddleware.authmiddleware, accountController.createAccount);

/**
 * @route GET /api/accounts
 * @desc Get accounts of logged in user
 * @access Private
 */
router.get('/', authMiddleware.authmiddleware, accountController.getAccounts);

/**
 * @route GET /api/accounts/balance/:accountId
 * @desc Get account balance of logged in user
 * @access Private
 */
router.get('/balance/:accountId', authMiddleware.authmiddleware, accountController.getAccountBalance); 

/**
 * @route POST /api/accounts/deposit
 * @desc Deposit mock test funds
 * @access Private
 */
router.post('/deposit', authMiddleware.authmiddleware, accountController.mockDeposit);

/**
 * @route GET /api/accounts/ledger/:accountId
 * @desc Get account ledger (transaction history)
 * @access Private
 */
router.get('/ledger/:accountId', authMiddleware.authmiddleware, accountController.getAccountLedger);

module.exports = router;
