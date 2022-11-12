// import primitives
import {createPrivateKey, createPublicKey, randomBytes} from "node:crypto";

// import modules
import config from "../config.js";
import {SignJWT, jwtVerify} from "jose";

const
    // subject (why we deliver a token)
    s = `access to protected site resources`,
    // destructure config values (use server key / cert for JWTs)
    {APP_KEYPAIR_ALG, APP_TOKEN_VALIDITY, APP_TLS_OPTIONS: {key, cert}} = config,
    // create private / public cryptokeys objects
    [ prvk, pubk ] = [
        // use node builtins to allow pem instead of pkcs
        createPrivateKey(key, {format: `pem`}),
        createPublicKey(cert, {format: `pem`})
    ],
    // create jwt string from payload object
    sign = payload => new SignJWT(payload)
        // signing key algorithm
        .setProtectedHeader({alg: APP_KEYPAIR_ALG})
        // relevant to delivering a token
        .setSubject(`urn:${ s }`)
        // unique id (beware because randomBytes() is sync ...)
        .setJti(randomBytes(16).toString(`hex`))
        // issuance timestamp
        .setIssuedAt()
        // expiration tims (seconds)
        .setExpirationTime(`${ APP_TOKEN_VALIDITY }s`)
        // sign with server private key
        .sign(prvk),
    // verify jwt signature from string
    verify = token => jwtVerify(token, pubk, {
        // validate algorithm
        algorithms: [ APP_KEYPAIR_ALG ],
        // validate token subject
        subject: `urn:${ s }`
    });

export {sign, verify};