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
        console.log("config loader done")
        controllerLoader(app);
        console.log("controller loader done")
        extendLoader(app);
        console.log("extend loader done")
        middlewareLoader(app);
        console.log("middleware loader done")
        routerSchemaLoader(app);
        console.log("router schema loader done")
        serviceLoader(app);
        console.log("service loader done")
        routerLoader(app);
        console.log("router loader done")

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