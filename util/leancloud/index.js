"use strict";

const crypto = require('crypto');
const AV = require('avoscloud-sdk');
const leanCloudSecret = require('./.secret-leancloud');
AV.initialize(leanCloudSecret.appId, leanCloudSecret.appKey);

/* 添加新用户 */
module.exports.addUser = function *(options) {
    let name = options.name || '';
    let description = options.description || '';
    let github = options.github || '';
    let email = options.email || '';
    let password = options.password || '';

    if(!name || !password || !email) return 'User name, password and email are required.';

    // 检测name和email是否已经使用过.
    let detectDuplicateData = yield exports.getUsers({
        "email": email,
        "name": name
    });

    if(detectDuplicateData && detectDuplicateData.length) return {"success": false, "message": "用户名或邮箱已经存在了."};

    let User = AV.Object.extend('Users');
    let UserObject = new User();
    UserObject.save({
        "name": name,
        "description": description,
        "github": github,
        "email": email,
        "password": leanCloudSecret.encryption(password)
    }, {
        success: function(object) {
            console.log('done:', object);
        }
    });
}

/* 获取用户信息 */
module.exports.getUsers = function *(options) {
    let query = AV.Query('Users');
    if(options) {
        /* 初始化Query */
        const emailQuery = new AV.Query('Users');
        const nameQuery = new AV.Query('Users');

        emailQuery.equalTo('email', options.email);
        nameQuery.equalTo('name', options.name);

        query = AV.Query.or(emailQuery, nameQuery);
    }

    let findResult = yield query.find();
    return findResult;
}
