import 'zone.js/dist/zone-node';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

export function app() {

    const server = express();
    const bodyParser = require('body-parser');
    const distFolder = join(process.cwd(), 'dist');
    const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
    const domino = require('domino');
    const win = domino.createWindow(indexHtml);

    global['window'] = win;
    global['document'] = win.document;
    global['DOMTokenList'] = win.DOMTokenList;
    global['Node'] = win.Node;
    global['Text'] = win.Text;
    global['HTMLElement'] = win.HTMLElement;
    global['navigator'] = win.navigator;

    server.use(bodyParser.urlencoded({ extended: false }));

    server.use(bodyParser.json());

    server.engine('html', ngExpressEngine({
        bootstrap: AppServerModule
    }));

    server.set('view engine', 'html');

    server.set('views', distFolder);

    server.get('/api/**', (req, res) => {

        res.status(404).send('data requests are not yet supported');

    });

    server.get('*.*', express.static(distFolder, { maxAge: '1y' }));

    server.get('*', (req, res) => {
        // getRedirect();
        // if (_redirect.data.data[req.originalUrl] && _redirect.data.data[req.originalUrl].link_redirect != '') {
        //     res.redirect(+_redirect.data.data[req.originalUrl].status_code, _redirect.data.data[req.originalUrl].link_redirect);
        // } else {
            res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
        // }
    });
    return server;
}

function run() {
    const port = 2301;
    const server = app();
    const fs = require('fs');
    const _https = require('https');
    var httpsOptions = {
        key: fs.readFileSync('./ssl/ssl.key'),
        cert: fs.readFileSync('./ssl/ssl-bundle.crt'),
    };
    _https.createServer(httpsOptions, server).listen(port, () => {
        console.log(`Node Express server listening on http://localhost:${port}`);
    });
}
// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
    run();
}
export * from './src/main.server';
