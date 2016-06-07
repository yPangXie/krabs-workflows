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
        let tags = [];
        let screenshots = [];
        $('.field-tags .field-item').each(function() {
            tags.push($(this).text().trim() || '');
        });
        $('.field-screenshots').each(function() {
            screenshots.push($(this).find('img').attr('src') || '');
        });
        let workflowData = {
            "author": $('.user-picture').closest('td').prev().text().trim() || "",
            "description": $('.field-short-description').text().trim() || "",
            "tags": tags.join(','),
            "github": $('.field-github-url a').attr('href') || "",
            "name": $('#page-title').text().trim() || "",
            "bundle_id": $('.field-bundle-id').text().trim() || "",
            "screenshots": screenshots.join(','),
            "icon_url": $('.field-icon img').attr('src') || "",
            "detail": toMarkdown($('.field-body').html() || ""),
            "download_url": $('.wf-download-link').attr('href') || "",
            "avatar": $('.user-picture img').attr('src') || ""
        };

        let resultList = yield leanCloudSecret.addWorkflow(workflowData, function(result) {
            if(result.success) console.log(`SUCCESS: ${url}`);
            else console.log(`FAILED: ${url}`);

            getPageData(workflowsURLList.shift());
        });
    });
}

if(!workflowsURLList || workflowsURLList.length == 0) {
    console.log('未配置需要抓取的数据.');
} else {
    getPageData(workflowsURLList.shift());
}
