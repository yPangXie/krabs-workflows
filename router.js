/**!
 * Explorer路由表
 *
 * Authors:
 *   巉岩 <daoyu.wdy@alibaba-inc.com> (https://work.alibaba-inc.com/work/u/68382)
*/

'use strict';

/* 各种controller */
const home = require('./controller/home');

module.exports = function(router) {
    router.get('/', home.home);
    router.get('/ok', function *() {
        return this.body = "ok";
    });
}
