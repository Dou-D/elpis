const koa = require('koa');

const app = new koa();

const port = process.env.PORT || 8080;
const host = process.env.IP || "0.0.0.0";
app.listen(port, host)
