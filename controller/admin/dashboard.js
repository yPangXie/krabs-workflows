"use strict"

module.exports = function *() {
    return yield this.render('/admin/dashboard');
}
