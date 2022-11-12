// import modules
import {Router} from "express";
import xfetch from "./fetch.js";
import xupload from "./upload.js";
import xprotected from "./protected.js";

// import middlewares
import merror from "../middlewares/error.js";

const
    // eslint-disable-next-line new-cap
    xroutes = Router();

// mount specific routers and middlewares to a single entrypoint for the server to use
xroutes
    // route for serving dynamic content
    .use(`/fetch`, xfetch)
    // route for handling file uploads
    .use(`/upload`, xupload)
    // protected route
    .use(`/protected`, xprotected)
    // route for throwing an error
    .use(`/error`, merror);

export default xroutes;