"use strict"

const qiniu = require('../../util/qiniu');
const leancloud = require('../../util/leancloud');

module.exports = function *() {
    let fileInfo = yield qiniu.fileInfo({
        "bucket": "workflows",
        "key": "wanqu.alfredworkflow"
    });

    let addUser = yield leancloud.addUser({
        "name": "testName",
        "password": "testPassword",
        "email": "testEmail"
    });

    return yield this.render('/home/home');
}
