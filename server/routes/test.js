'use strict';

var test = require('../controllers/testCtrl');

module.exports = function(app) {
    app.route('/test')
        .get(test.list)
        .post(test.create);
    app.route('/test?testStatus=:testStatus&matrixId=:matrixId&obrId=:obrId&segment2=:segment2&segment3=:segment3')
        .get(test.list);
    app.route('/test/:testId')
        .get(test.findOne)
        .delete(test.delete)
        .put(test.update);
};