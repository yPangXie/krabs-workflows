"use strict"

const leancloud = require('../../util/leancloud');

module.exports = function *() {
    let user = this.params.user || '';
    if(!user) return this.throw(404);

    let listData = [];
    if(user) listData = yield leancloud.getWorkflowsLikeAuthor(user);

    listData.forEach(item => {
        let tags = item.get('tags').replace(/\s/g, '').split(',');
        item.set('tags', item.get('tags').replace(/\s/g, '') ? tags : null);
    });

    return yield this.render('/home/list', {
        "type": "user",
        "list": listData,
        "filterData": user,
        "empty": listData.length == 0,
        "hidePagination": true
    });
}
