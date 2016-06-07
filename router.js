/**!
 * Explorer路由表
 *
 * Authors:
 *   巉岩 <daoyu.wdy@alibaba-inc.com> (https://work.alibaba-inc.com/work/u/68382)
*/

'use strict';

/* 各种controller */
const home = require('./controller/home');
const admin = require('./controller/admin');

module.exports = function(router) {
    router.get('/', home.home);
    router.get('/:id', home.detail);
    router.get('/tag/:tag', home.tag);
    router.get('/user/:user', home.user);

    /* 管理后台页面 */
    router.get('/admin', admin.dashboard);
    router.get('/login', admin.login);
}
