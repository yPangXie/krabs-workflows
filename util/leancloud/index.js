"use strict";

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
    let query = new AV.Query('Users');
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

/* 添加workflow数据 */
module.exports.addWorkflow = function *(options, callback) {
    let Workflows = AV.Object.extend('Workflows');
    let WorkflowsObject = new Workflows();

    for(let key in options) {
        WorkflowsObject.set(key, options[key]);
    }

    WorkflowsObject.save().then(function (successResult) {
        callback({"success": true});
    }, function(error) {
        console.log(err);
        callback({"success": false});
    });
}

/* 获取workflow */
module.exports.getWorkflows = function *(page, size) {
    let skip = ((+page || 1) - 1) * size;

    let workflowsQuery = new AV.Query('Workflows');
    workflowsQuery.limit(size);
    workflowsQuery.skip(skip);
    workflowsQuery.ascending('createdAt');

    return workflowsQuery.find();
}

/* 获取某一个workflow的详细信息 */
module.exports.getWorkflowDetail = function *(id) {
    let workflowsQuery = new AV.Query('Workflows');
    workflowsQuery.equalTo('objectId', id);

    return workflowsQuery.first();
}

/* 获取总页数 */
module.exports.getWorkflowTotalCount = function *() {
    let workflowsTotalQuery = new AV.Query('Workflows');
    return workflowsTotalQuery.count();
}
