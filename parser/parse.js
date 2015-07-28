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
            // date
            if (value.Date) {
                value.Date = new Date(value.Date);
                if (value.Date.getTime() !== value.Date.getTime()) // NaN != NaN
                    value.Date = new Date();

            }
            else {
                value.Date = new Date();
            }
            // numbers
            if (value.Amount) {
                value.Amount = parseFloat(value.Amount.replace(',', ''));
            }
            if (!value.Amount || isNaN(value.Amount)) {
                value.Amount = 0;
            }

            return model.create(value);
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
