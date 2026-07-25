const {Router}= require('express');
const transactionRouter = Router();
const authMiddleware = require('../middleware/auth.middleware');
const transactionController = require('../controllers/transaction.controller');


transactionRouter.post('/', authMiddleware.authmiddleware, transactionController.createTransactionController);

transactionRouter.post('/system/initial-funds', authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransactionController);

module.exports = transactionRouter;





