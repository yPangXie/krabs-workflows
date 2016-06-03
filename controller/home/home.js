"use strict"

const qiniu = require('../../util/qiniu');

module.exports = function *() {
    let fileInfo = yield qiniu.fileInfo({
        "bucket": "workflows",
        "key": "wanqu.alfredworkflow"
    });

    return yield this.render('/home/home');
}
