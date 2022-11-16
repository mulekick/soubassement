/* eslint-disable node/no-process-env */

// import primitives
import process from "node:process";
import console from "node:console";
import {createServer} from "node:https";
import {fork} from "node:child_process";
import {resolve} from "node:path";

// import modules
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import config from "./config.js";
import xroutes from "./routes/routes.js";

const
    // destructure config values
    {dirName, VITE_SRV_ENTRYPOINT, APP_HOST, APP_PORT, APP_BUILD_DIR, APP_TLS_OPTIONS} = config,
    // create express app
    xapp = express();

xapp
    // enable cors for all routes, resources will be served to any origin
    .use(cors({origin: `*`}))
    // setup default security related response headers (list on module homepage)
    .use(helmet())
    // setup HTTP logging (use apache format + served content type)
    // request is logged at response time so it's ok to log response headers
    .use(morgan(`:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":res[content-type]"`))
    // parse cookies and populate request with keyed object
    .use(cookieParser())
    // mount server routes to entrypoint so static content can be served from /
    .use(VITE_SRV_ENTRYPOINT, xroutes);

// manage static content serving (development / production)
if (process.env.NODE_ENV === `production`) {
    // route for serving static content
    xapp.use(`/`, express.static(APP_BUILD_DIR));
} else if (process.env.NODE_ENV === `development`) {
    // fork a new vite.js static development server
    const
        // create abort controller
        controller = new AbortController(),
        // start vite server
        viteApp = fork(resolve(dirName, `node_modules/vite/bin/vite.js`), [ `serve` ], {
            // submit to abort controller signal for termination
            signal: controller.signal,
            // not-so-obvious default option
            env: process.env,
            // use SIGTERM
            killSignal: `SIGTERM`
        });

    viteApp
        // termination handler
        .on(`error`, e => {
            console.error(`vite server stopped: ${ e.message }\n${ controller.signal.reason }`);
        });

    // stop vite server when express exits
    process.on(`SIGINT`, () => {
        console.debug(`express server(${ process.pid }) received SIGINT, stopping and exiting.`);
        // send abort signal to vite server
        controller.abort(`express server shut down`);
        // stop express (ok to force process exit here since we're in dev mode)
        process.nextTick(() => process.exit(0));
    });
} else {
    // throw error, server can't run like that
    throw new Error(`static content serving mode not specified`);
}

xapp
    // default fallback route
    .use(`*`, (req, res) => {
        res
            .status(404)
            .send(`requested resource is nowhere to be found 😭`);
    })
    // error handling route
    .use((err, req, res, next) => {
        // serve error message to client
        if (!res.headersSent) {
            res
                .status(500)
                .send(`error occured: ${ err.message } 🤬`);
        }
        // hand error to built-in error handler, print stack in server logs
        next(err);
    });

// fire that shit up !
createServer(APP_TLS_OPTIONS, xapp).listen(APP_PORT, APP_HOST, () => console.log(`service listening on interface ${ APP_HOST }:${ APP_PORT }`));