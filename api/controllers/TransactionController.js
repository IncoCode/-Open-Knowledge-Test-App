/**
 * TransactionController
 *
 * @description :: Server-side logic for managing Transactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var csv = require('csv');
var Promise = require('bluebird');
var request = require('request');

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
                ]
            })
            .then(function (transactions) {
                res.view('transaction/index', {transactions: transactions})
            })
    },

    parseData: function (req, res, next) {
        if (!req.param('csvUrl'))
            return res.redirect('/transaction');

        request.get(req.param('csvUrl'), function (error, response, body) {
            if (!error && response.statusCode === 200) {
                csv.parse(body, {columns: true, skip_empty_lines: true}, function (err, data) {
                    if (err) return console.log('Error');

                    var createPromisies = data.map(function (value) {
                        value = _.transform(value, function (res, v, key) {
                            res[key.replace(' ', '')] = v;
                        });
                        if (_.every(value, function (val) {
                                return val === '';
                            })) {
                            return Promise.resolve();
                        }
                        // date
                        if (value.Date) {
                            value.Date = new Date(value.Date);
                            if (value.Date.getTime() !== value.Date.getTime()) // NaN != NaN
                                value.Date = new Date();

                        }
                        else {
                            return Promise.resolve();
                        }

                        // numbers
                        if (value.Amount) {
                            value.Amount = parseFloat(value.Amount.replace(',', ''));
                        }
                        if (!value.Amount || isNaN(value.Amount)) {
                            return Promise.resolve();
                        }

                        return Transaction.create(value);
                    });

                    Promise
                        .all(createPromisies)
                        .then(function () {
                            console.log('All data was added in database!');
                            res.redirect('/Transaction/');
                        })
                        .catch(function (err) {
                            res.redirect('/Transaction/');
                        })
                });
            }
        });
    }
};

