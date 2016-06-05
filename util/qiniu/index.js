"use strict";

const qiniu = require('qiniu');
const qiniuSecret = require('./.secret-qiqiu');

qiniu.conf.ACCESS_KEY = qiniuSecret.ACCESS_KEY;
qiniu.conf.SECRET_KEY = qiniuSecret.SECRET_KEY;

/* 上传文件 */
module.exports.upload = function *(options) {
    let bucket = options.bucket || 'workflows';
    let localFile = options.localFile || './wanqu.alfredworkflow';
    let uploadKey = options.uploadKey || 'wanquAlfred';

    if(!bucket || !localFile || !uploadKey) return 'Parameters wrong.';

    //构建上传策略函数，设置回调的url以及需要回调给业务服务器的数据
    var putPolicy = new qiniu.rs.PutPolicy(`${bucket}:${uploadKey}`);
    putPolicy.callbackUrl = qiniuSecret.callbackUrl;
    putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';
    //生成上传 Token
    let upToken = putPolicy.token();
    //构造上传函数
    let extra = new qiniu.io.PutExtra();

    return new Promise((resolve, reject) => {
        qiniu.io.putFile(upToken, uploadKey, localFile, extra, function(err, ret) {
            if(!err) {
                // 上传成功， 处理返回值
                resolve(ret);
            } else {
                // 上传失败， 处理返回代码
                resolve(err);
            }
        });
    });

}

/* 获取文件信息 */
module.exports.fileInfo = function *(options) {
    let bucket = options.bucket || '';
    let key = options.key || '';

    if(!bucket || !key) return 'Parameters wrong.';

    return yield new Promise((resolve, reject) => {
        let client = new qiniu.rs.Client();
        client.stat(bucket, key, function(err, ret) {
            if (!err) {
                resolve(ret);
            } else {
                resolve(err);
            }
        });
    });
}

/* 生成下载链接 */
module.exports.download = function(options) {
    let url = options.url || '';
    if(!url) return 'Parameters wrong.';

    let policy = new qiniu.rs.GetPolicy();
    let downloadUrl = policy.makeRequest(url);

    return downloadUrl;
}
