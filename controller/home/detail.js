"use strict"

const leancloud = require('../../util/leancloud');
const markdown = require('markdown').markdown;

module.exports = function *() {
    let id = this.params.id || '';
    if(!id) return this.throw(404);

    let detailData = yield leancloud.getWorkflowDetail(id);
    if(!detailData) return this.throw(404);

    let screenshots = detailData.get('screenshots');
    let detailMD = detailData.get('detail');
    let tags = detailData.get('tags');
    let screenshotsArray = screenshots.replace(/\s/g, '').split(',');
    let tagsArray = tags.replace(/\s/g, '').split(',');

    detailData.set('screenshots', screenshots.replace(/\s/g, '') ? screenshotsArray : null);
    detailData.set('tags', tags.replace(/\s/, '') ? tagsArray : null);
    detailData.set('detail', markdown.toHTML(detailMD));

    return yield this.render('/home/detail', {
        "detail": detailData,
        "hidePagination": true
    });
}
