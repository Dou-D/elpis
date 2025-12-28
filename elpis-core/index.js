const koa = require('koa');
const path = require('path');
const { sep } = path; // 兼容各个操作系统
const env = require('./env')
const configLoader = require('./loader/config');
const controllerLoader = require('./loader/controller');
const extendLoader = require('./loader/extend');
const middlewareLoader = require('./loader/middleware');
const routerSchemaLoader = require('./loader/router-schema');
const routerLoader = require('./loader/router');
const serviceLoader = require('./loader/service');

module.exports = {
    start(option = {}) {
        const app = new koa();
        app.option = option;
        // 基础路径
        app.baseDir = process.cwd();
        // 业务文件路径
        app.env = env();
        console.log(`运行环境：${app.env.get()}`)
        app.businessPath = path.resolve(app.baseDir, `.${sep}app`);

        configLoader(app);
        console.log("config", app.config)
        controllerLoader(app);
        console.log("controller", app.controller)
        extendLoader(app);
        console.log("extend", app.extend)
        middlewareLoader(app);
        console.log("middleware", app.middleware)
        routerSchemaLoader(app);
        console.log("router schema", app.routerSchema)
        serviceLoader(app);
        console.log("service", app.service)
        routerLoader(app);
        console.log("router", app.router)

        try {
            const port = process.env.PORT || 8080;
            const host = process.env.IP || "0.0.0.0";
            app.listen(port, host)
            console.log("项目地址：" + host + ":" + port)
        } catch (error) {
            console.log(error);
        }
    }
}