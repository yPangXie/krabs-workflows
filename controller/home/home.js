"use strict"

const qiniu = require('../../util/qiniu');
const leancloud = require('../../util/leancloud');

module.exports = function *() {
    // let fileInfo = yield qiniu.fileInfo({
    //     "bucket": "workflows",
    //     "key": "wanqu.alfredworkflow"
    // });

    // let addUser = yield leancloud.addUser({
    //     "name": "testName",
    //     "password": "testPassword",
    //     "email": "testEmail"
    // });
    
    let size = 12;
    let page = this.query.page || 1;
    /* 获取当前页的数据 */
    let startTime = Date.now();
    let resultList = yield leancloud.getWorkflow(page, 12);
    resultList.forEach(function(item) {
        let tags = item.get('tags').split(',');
        item.set('tags', tags);
        item.save();
    });

    /* 获取总数, 并计算分页 */
    let total = yield leancloud.getWorkflowTotal();
    let totalPage = Math.ceil(+total / size);

    return yield this.render('/home/home', {
        "workflows": resultList,
        "page": {
            "current": +page,
            "total": totalPage,
            "next": (+page + 1) <= totalPage ? (+page + 1) : "",
            "previous": +page > 1 ? +page - 1 : ""
        }
    });
}
