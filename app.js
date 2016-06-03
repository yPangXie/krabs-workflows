"use strict"

const path = require('path');
const koa = require('koa');
const ctatic = require('koa-static');
const router = require('koa-router')();
const views = require('koa-views');
const session = require('koa-session');

const app = koa();
const customRouter = require('./router');
const config = require('./config');
const viewRoot = path.resolve(`${__dirname}/views`);

/* 中间件 */
app.use(function *(next) {
    this.state.staticTimestamp = Date.now();
    this.state.config = config;
    this.state.settings = {
        views: viewRoot
    };

    yield next;
});

/* 配置静态文件 */
app.use(ctatic(path.resolve(`${__dirname}/htdocs`)));

/* session模块 */
app.keys = ['krabs-workflow'];
app.use(session(app));

/* view模块 */
require('dustjs-helpers').config.whitespace = true;
app.use(views(viewRoot, {
    cache: false,
    extension: 'dust'
}));

/* 路由 */
app.use(router.routes());
customRouter(router);

app.listen(config.port);
