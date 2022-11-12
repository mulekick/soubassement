// import primitives
import {createHash} from "node:crypto";

const
    // data fetching middleware function
    mfetch = (req, res) => {
        res
            .status(200)
            // generate random hash
            .send(createHash(`sha256`)
                .update(String(new Date().getTime()))
                .digest(`hex`));
    },
    // data fetching fallback middleware
    mfallback = (req, res) => {
        res
            .status(200)
            .send(`resources sitting here will be served to anybody 😁`);
    };

export {mfetch, mfallback};