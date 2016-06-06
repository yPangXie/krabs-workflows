"use strict";

const urllib = require('urllib');
const co = require('co');
const leanCloudSecret = require('../util/leancloud');
const qiniuSecret = require('../util/qiniu');
const dbData = {};

/* 获取DB中, 所有资源的文件 */
function grabUrls (image) {
    co(function *() {
        let result = yield leanCloudSecret.getWorkflows(1, 803);
        result.forEach(item => {
            dbData[item.id] = {
                avatar: item.get('avatar') || '',
                screenshots: item.get('screenshots').split(',') || [],
                icon: item.get('icon_url') || '',
                download: item.get('download_url') || ''
            }
        });

        require('fs').writeFile('./worflowsStatic.js', JSON.stringify(dbData, null, 4), function(err, data) {
            console.log('done');
        })
    });
}

/*  */

// uploadImage()
