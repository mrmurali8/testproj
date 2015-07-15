'use strict';
var user = require('../controllers/lookupsCtrl');

module.exports = function(app) {
    app.route('/lookups')
        .get(user.list)
        .post(user.create)
        .put(user.update);
    app.route('/lookups/:id')
        .get(user.findOne)
        .delete(user.delete);
};