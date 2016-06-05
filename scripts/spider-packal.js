"use strict";

const cheerio = require('cheerio');
const urllib = require('urllib');
const co = require('co');
const toMarkdown = require('to-markdown');
const workflowsJSON = {};//require('./workflow');

const workflowKeys = Object.keys(workflowsJSON);
const leanCloudSecret = require('../util/leancloud');

function getPageData(key) {
    if(!key) return 'done';

    let url = workflowsJSON[key].link;
    co(function *() {
        let result = yield urllib.requestThunk(url, {"timeout": 1000000});
        if(!result || !result.data) {
            console.log(`FAILED: ${workflowData.name}`);
            return getPageData(workflowKeys.shift());
        }

        let $ = cheerio.load(new Buffer(result.data).toString());

        let tmpScreenshots = [];
        let tmpTags = [];
        $('.field-screenshots').each(function() {
            tmpScreenshots.push($(this).find('img').attr('src'));
        });

        $('.field-tags .field-item').each(function() {
            tmpTags.push($(this).find('a').text().trim());
        });

        let workflowData = {
            author: workflowsJSON[key].author || '',
            name: workflowsJSON[key].name || '',
            description: workflowsJSON[key].description || '',
            icon_url: workflowsJSON[key].icon || '',
            bundle_id: $('.field-bundle-id').text().trim() || '',
            github: $('.field-github-url a').attr('href') || '',
            download_url: $('.wf-download-link').attr('href') || '',
            detail: toMarkdown($('.field-body').html()) || '',
            screenshots: tmpScreenshots.join(','),
            tags: tmpTags.join(',')
        };

        yield leanCloudSecret.addWorkflow(workflowData, function(result) {
            if(result.success) {
                console.log(`SUCCESS: ${workflowData.name}`);
            } else {
                console.log(`FAILED: ${workflowData.name}`);
            }

            getPageData(workflowKeys.shift());
        });
    });
}

getPageData(workflowKeys.shift());
