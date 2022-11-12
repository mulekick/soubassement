// import modules
import {Router} from "express";

// import middlewares
import mupload from "../middlewares/upload.js";

const
    // eslint-disable-next-line new-cap
    xupload = Router();

xupload
    // setup routes to process file uploads
    .post(`/`, mupload);

export default xupload;

