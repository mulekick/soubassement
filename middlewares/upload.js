// import primitives
import {constants} from "node:fs";
import {copyFile} from "fs/promises";

// import modules
import formidable from "formidable";
import config from "../config.js";

const
    // destructure import
    {IncomingForm} = formidable,
    // destructure config values
    {APP_UPLOAD_DIR} = config,
    // file upload middleware function
    // async I/O operation requires try...catch in express 4
    mupload = async(req, res, next) => {
        try {

            const
                // parse request
                {afile: {originalFilename, filepath}} = await new Promise((resolve, reject) => {
                    // init formidable
                    new IncomingForm({
                        keepExtensions: true,
                        allowEmptyFiles: false,
                        maxFileSize: 100 * 1024
                    })
                        // parse request
                        .parse(req, (err, fields, files) => {
                            // if error
                            if (err)
                                reject(err);
                            // else, resolve
                            resolve(files);
                        });
                });

            // copy file
            await copyFile(filepath, `${ APP_UPLOAD_DIR }/${ originalFilename }`, constants.COPYFILE_EXCL);

            return res
                // send response
                .status(200)
                .redirect(`/`);

        } catch (err) {
            // delegate to error handling middleware
            return next(err);
        }
    };

export default mupload;