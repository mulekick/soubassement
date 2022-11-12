/* eslint-disable node/prefer-global/console */

// vite supports client-side npm modules bundling ...
import pepe from "@mulekick/pepe-ascii";

// vite supports importing any asset as an url, they then will be served
// relative to project root so they can directly be referenced in HTML ...
import "../img/vite.svg";

// imports of SCSS files will auto-compile to CSS into a <style> tag ...
import "../scss/main.scss";

try {

    const
        // retrieve environment
        {BASE_URL, MODE, VITE_SHA_256_HASH, VITE_HOST, VITE_PORT, VITE_SRV_ENTRYPOINT} = import.meta.env,
        // use function declaration for 'this' ...
        getContent = async function(route) {
            try {
                const
                    // fetch a piece of content
                    readable = await fetch(route, {method: `GET`});
                // parse response stream into a string and update document
                // eslint-disable-next-line no-invalid-this
                this.textContent = await readable.text();
            } catch (e) {
                // log to stderr
                console.error(`error: ${ e.message }`);
            }
        },
        // random number between 2 values
        rnd = (lb, ub) => lb + Math.round(Math.random() * (ub - lb)),
        // use and npm module client side
        getPepe = function() {
            const
                // all pepes
                pepes = Object.values(pepe);
            // display a random pepe
            // eslint-disable-next-line no-invalid-this
            this.textContent = pepes.at(rnd(0, pepes.length - 1));
        };

    // add handler
    document.querySelector(`#tokenplease`).addEventListener(`click`, async() => {
        try {
            // retrieve a cookie containing the token; no need to parse the response since the fetch
            // spec prevents client side javascript from accessing response's 'set-cookie' header
            await fetch(`${ VITE_SRV_ENTRYPOINT }/protected/token`, {method: `GET`});
        } catch (e) {
            // log to stderr
            console.error(`error: ${ e.message }`);
        }
    });

    // set interval
    setInterval(getContent.bind(document.querySelector(`#fetch`), `${ VITE_SRV_ENTRYPOINT }/fetch/inline`), 2.5e3);
    setInterval(getContent.bind(document.querySelector(`#protected`), `${ VITE_SRV_ENTRYPOINT }/protected`), 2.5e3);
    setInterval(getPepe.bind(document.querySelector(`#pepe`)), 2.5e3);

    // set form action for uploads
    document.querySelector(`form`).action = `${ VITE_SRV_ENTRYPOINT }/upload`;

    console.log(`application running in ${ MODE } mode at ${ VITE_HOST }:${ VITE_PORT }${ BASE_URL }\nenvironment public hash: ${ VITE_SHA_256_HASH }`);

} catch (err) {
    // eslint-disable-next-line node/prefer-global/console
    console.error(`error: ${ err.message }`);
}