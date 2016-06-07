"use strict"

const leancloud = require('../../util/leancloud');

module.exports = function *() {
    let tag = this.params.tag || '';
    if(!tag) return this.throw(404);

    let listData = [];
    if(tag) listData = yield leancloud.getWorkflowsLikeTag(tag);

    return yield this.render('/home/list', {
        "type": "tag",
        "list": listData,
        "filterData": tag,
        "empty": listData.length == 0,
        "hidePagination": true
    });
}
