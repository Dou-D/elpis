const path = require('path')
const glob = require('glob')
const { sep } = path;
module.exports = (app) => {
    const routerSchemaPath = path.resolve(app.businessPath, `.${sep}router-schema`);
    const fileList = glob.sync(path.resolve(routerSchemaPath, `.${sep}**${sep}**.js`))

    let routerSchema = {};
    fileList.forEach(file => {
        const schema = require(path.resolve(file))
        routerSchema = {
            ...routerSchema,
            ...schema
        }
    });
    app.routerSchema = routerSchema;
}