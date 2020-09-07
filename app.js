// Packages
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logRequestBody = require('./middlewares/logRequestBody.middleware');


// Init Env
if (process.env.ENV != 'production' && process.env.ENV != 'dev_online') {
    require('dotenv').config();
}
console.log(`Initialised env on ${process.env.ENV} 🛰`)   



// Internal files
const apiRouter = require('./routes/api.routes');
const apiVersion = process.env.API_VERSION;

console.log(`requiring router file 🔁`)   


// Initalizeing the app
const app = express();
console.log(`Initialised application 🧨`)    

app.use(express.static('public'));




// http logs
app.use(morgan('combined'));
app.use(logRequestBody);

// response class
const Response = require('./classes/response');
const ErrorHelper = require('./helpers/error.helper');

// Parsing the json body
// app.use(express.json());
//request size limit
app.use(bodyParser.urlencoded({
    limit: "5mb",
    extended: false
}));
app.use(bodyParser.json({
    limit: "5mb"
}));
// allow cors
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, client-key, x-auth, languageId, platform');
    next();
});

// overwrite languageId
app.use(function (req, res, next) {
    if (req.header('languageId') == undefined ) {
        req.headers['languageid'] = req.header('language-id');
    }
    next();
});
// overwrite res object
app.use(function (req, res, next) {
    res.sendSuccess = (data, total_count) => {
        return res.json(new Response({
            code: '0000', 
            data, 
            total_count
        }));
    }

    res.sendError = (code, languageId, action,devError) => {
        return res.json(ErrorHelper.getError(code, languageId, action,devError));
    }
    next();
})

// Identifiy the router object
const routingPoint = '/api/' + apiVersion;
app.use(routingPoint, apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use(function (err, req, res, next) { 

    if (err.isBoom) {
        return res.status(err.output.statusCode).json(err.output.payload);
    }
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    console.log(err.message);  
    res.sendStatus(err.status || 500);
});

const PORT = process.env.PORT || 8000;
// Export the express app 
 app.listen(PORT, () => console.log(`Running server on ${process.env.ENV} 🚀. \nListening on ${ PORT } 👂`));

 module.exports = app;