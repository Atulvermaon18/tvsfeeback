const express = require('express');
const app = express();
const path = require('path');
const forceSSL = function () {
    return function (req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(
                ['https://', req.get('Host'), req.url].join('')
            );
        }
        next();
    }
}
app.use(express.static(__dirname + '/dist/feedbackform'));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/feedbackform/index.html'));
});
// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);