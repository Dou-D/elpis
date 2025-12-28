const path = require('path');
const { sep } = path;
const glob = require('glob');
/**
 * @param {object} app koa实例
 * 加载不同的目录中所有的middleware，通过app.middlewares.${目录}.${文件} 来访问
 */
module.exports = (app) => {
    // 读取app/middleware/**/**.js
    const middlewarePath = path.resolve(app.businessPath, `.${sep}middleware`)
    // `.${sep}**${sep}**.js` **/**.js
    const fileList = glob.sync(path.resolve(middlewarePath, `.${sep}**${sep}**.js`))
    let a;
    const middlewares = {};
    fileList.forEach(file => {
        // 提取名称
        let name = path.resolve(file);
        // 截取路径
        const start = `middleware${sep}`;
        // app/middlewares/custom-module/custom-middleware.js=>custom-module/custom-middleware.js
        name = name.substring(name.lastIndexOf(start) + start.length, name.lastIndexOf('.'))
        // 处理-为小驼峰 custom-module=>customModule
        name = name.replace(/[_-][a-z]/ig, (s) => s.substring(1).toUpperCase())
        let tmpMiddleware = middlewares; // 这里的tmpMiddleware其实是middlewares的指针
        const names = name.split(sep);
        for (let i = 0, len = names.length; i < len; i++) {
            // 最后一个就是文件
            if (i === len - 1) {
                const middlewareLoader = require(path.resolve(file));
                tmpMiddleware[name[i]] = middlewareLoader(app);
            }
            // 目录
            else {
                if (!tmpMiddleware[name[i]]) {
                    // 创建目录的对象结构，每一层对象就是一个文件夹
                    // 注意理解tmpMiddleware的这个事情，这里就明白了
                    tmpMiddleware[name[i]] = {};
                }
                tmpMiddleware = tmpMiddleware[names[i]];
            }
        }
    })
    app.middlewares = middlewares;
}