/**
 * TransactionController
 *
 * @description :: Server-side logic for managing Transactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function (req, res, next) {
        Transaction
            .find()
            .then(function (transactions) {
                res.view({transactions: transactions})
            });
    },

    find: function (req, res, next) {
        Transaction
            .find()
            .where({
                or: [
                    {DepartmentalFamily: req.param('DepartmentalFamily')},
                    {Entity: req.param('Entity')},
                    {Date: req.param('Date')},
                    {ExpenseType: req.param('ExpenseType')},
                    {ExpenseArea: req.param('ExpenseArea')},
                    {Supplier: req.param('Supplier')},
                    {TransactionNumber: req.param('TransactionNumber')},
                    {Amount: req.param('Amount')},
                    {Description: req.param('Description')}
                    //{ExpenseType: 'Grant'}
                ]
            })
            .then(function (transactions) {
                res.view('transaction/index', {transactions: transactions})
            })
    }
};

