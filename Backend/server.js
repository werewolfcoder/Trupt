const http = require('http')
const app = require('./app')
const port = process.env.PORT||3000;
const server = http.createServer(app);
const cookieParser = require('cookie-parser')
app.use(cookieParser())

server.listen(port,()=>{
    console.log("server listening on port",port);
});
