/* eslint-disable node/no-process-env */
/* eslint-disable node/no-unpublished-import */

// import primitives
import process from "node:process";
import {resolve} from "node:path";
import {URL, fileURLToPath} from "node:url";

// import modules
import {defineConfig, loadEnv} from "vite";
import legacy from "@vitejs/plugin-legacy";
// import {webfontDownload} from "vite-plugin-webfont-dl";
import {config} from "dotenv";

// note : for more flexibility and fine tuning, all paths included in this config
// will be absolute paths pointing to subdirectories of the current project's root

// eslint-disable-next-line no-unused-vars
export default defineConfig(({command, mode}) => {

    const
        // retrieve current config folder
        dirName = fileURLToPath(new URL(`.`, import.meta.url)),
        // retrieve environment files folder
        envDir = resolve(dirName, `.env.files`);

    // use dotenv to load express related config into process.env
    config({path: resolve(envDir, `.env.${ process.env.NODE_ENV }`)});

    const
        // destructure from process.env
        {APP_HOST, APP_PORT, APP_CIPHER_SUITES, APP_PRIVATE_KEY, APP_X509_CERT, APP_ECDH_CURVE, APP_TLS_MIN_VERSION, APP_TLS_MAX_VERSION} = process.env,
        // load current vite-specific
        {VITE_HOST, VITE_PORT, VITE_SRV_ENTRYPOINT} = loadEnv(mode, envDir, `VITE_`),
        // init config
        cfg = {
            // environment files directory
            envDir,
            // project filesystem root
            root: `static`,
            // base server path
            base: `/`,
            // static file serving for development (becomes / at build time)
            publicDir: resolve(dirName, `static`, `public`),
            // prefix for environment variables
            envPrefix: `VITE_`,
            // interface to listen to (serve)
            server: {
                host: VITE_HOST,
                port: VITE_PORT,
                // exit if port is busy
                strictPort: true,
                // enable https in dev mode
                https: {
                    ciphers: APP_CIPHER_SUITES,
                    key: APP_PRIVATE_KEY,
                    cert: APP_X509_CERT,
                    ecdhCurve: APP_ECDH_CURVE,
                    maxVersion: APP_TLS_MAX_VERSION,
                    minVersion: APP_TLS_MIN_VERSION,
                    // force TLS simple mode
                    requestCert: false
                },
                // enable proxying to express
                proxy: {
                    // with RegEx
                    [`^${ VITE_SRV_ENTRYPOINT }/.*`]: {
                        // it is assessed that vite and express run on the same host during development
                        target: `https://${ APP_HOST }:${ APP_PORT }`,
                        // allow self-signed certificates
                        secure: false
                    }
                }
            },
            /*
            // interface to listen to (preview) - not using vite in preview mode, will statically serve through express
            preview: {},
            */
            // build options
            build: {
                // target modern browsers (overriden by legacy plugin)
                // target: `modules`,
                // build directory
                outDir: `../build`,
                // assets directory for the build
                assetsDir: `assets`,
                // suppress warning on build directory reset
                emptyOutDir: true,
                // rollup bundle entry point (1 entry point per site page monkaS)
                rollupOptions: {
                    input: {
                        main: resolve(dirName, `static`, `index.html`)
                    }
                }
            },
            // plugins
            plugins: [
                legacy({
                    // target every browser that support TLS 1.2 and beyond
                    targets: {
                        edge: `12`,
                        firefox: `27`,
                        chrome: `31`,
                        safari: `9`
                    }
                })
                /*
                // self-host third-party webfonts to avoir render blocking behavior

                // disable this plugin for now as it jeopardizes imported assets urls
                // replacement in html files during bundling - properly rendered imports
                // are reverted to __VITE_ASSET__(hash)__ during the rollup bundle phase

                webfontDownload([
                    `https://fonts.googleapis.com/css2?family=Inconsolata&family=Lobster&display=swap`
                ])
                */
            ]
        };
    return cfg;
});