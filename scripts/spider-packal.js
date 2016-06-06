"use strict";

const cheerio = require('cheerio');
const urllib = require('urllib');
const co = require('co');
const toMarkdown = require('to-markdown');
const workflowsURLList = [];// require('./workflow');
const leanCloudSecret = require('../util/leancloud');

function getPageData(url) {
    if(!url) return 'done';
    co(function *() {
        let result = yield urllib.requestThunk(url, {"timeout": 1000000});
        if(!result || !result.data) {
            console.log(`FAILED: ${url}`);
            return getPageData(workflowsURLList.shift());
        }
        let $ = cheerio.load(new Buffer(result.data).toString());
        let author = $('.user-picture').closest('td').prev().text().trim() || '';
        let workflowData = {
            "avatar": $('.user-picture img').attr('src') || ''
        };

        let resultList = yield leanCloudSecret.getWorkflowsByAuthor(author);
        if(resultList && resultList.length) {
            resultList.forEach(item => {
                item.set('avatar', $('.user-picture img').attr('src') || '');
                item.save();
            });
        }
        console.log(`SUCCESS: ${url}`);
        getPageData(workflowsURLList.shift());
    });
}

getPageData(workflowsURLList.shift());
