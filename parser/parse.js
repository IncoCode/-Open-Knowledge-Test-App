var csv = require('csv');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function (csvContent, model) {
    csv.parse(csvContent, {columns: true, skip_empty_lines: true}, function (err, data) {
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
                process.exit();
            })
            .catch(function (err) {
                console.log(err);
                process.abort(1);
            })
    });
};
