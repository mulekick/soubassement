# [soubassement](https://www.wordscope.com/soubassement+en+anglais.html)

Basic express use case that embarks all the necessary boilerplate stuff to support :

* File uploads and multipart form data handling (using <code>[formidable](https://github.com/node-formidable/formidable)</code>)
* Stateless client-side sessions management with <code>[JSON web tokens](https://jwt.io/)</code> (using <code>[jose](https://github.com/panva/jose)</code> and <code>[cookie-parser](https://www.npmjs.com/package/cookie-parser)</code>)
* Bundling code / dependencies into builds that target every TLSv1.2+ compatible browsers (using <code>[vite](https://vitejs.dev/)</code>)
* Server-side business logic automated tests (using <code>[jest](https://jestjs.io/)</code>)
* Client-side UX/UI automated tests (using <code>[testing-library](https://testing-library.com/)</code> and <code>[jest](https://jestjs.io/)</code>)
* Server auto-restart on file changes during development (using <code>[nodemon](https://nodemon.io/)</code>)
* HMR and browser auto-reload on file change during development (using <code>[vite](https://vitejs.dev/)</code>)

## Why this

1. The idea is to create a full-stack development environment following these principles :

   ✅ Remain as simple and generic as possible by not doing any integration of any frontend or backend frameworks, websockets library,  ORM modules etc ... by default

   ✅ Remain as simple and manageable as possible, noticeably by relying on a single package.json file

   ✅ Silo the back-end and frontend during development by having the vite dev server and the express server run in separate processes

2. This project guarantees a smooth and enjoyable development experience and can be used as a starting point in the event you want to do the integrations mentioned above by yourself in a controlled way instead of just typing "npx create-my-framework-app" in the terminal.

3. *In my opinion, basic understanding of how things work and interact with each other in a self-contained development solution is critical : your app may still be 95% functional if something in the business logic code breaks, but when something breaks in the boilerplate code or in the framework, your app instantly becomes 0% functional.*

4. Finally, you can be sure that all the dependencies included are the go-to modules of the ecosystem in their respective areas.

## Available commands

*for people familiar with vite, I stress that the vite project root here is ```/static``` instead of the default  ```/```. For others, it means that vite.js is only used to build the browser part of the code and not the code running in the express app, thus the below terminology of "source files", "build files" and "app files".*

- `npm run dev`
   - starts the app in development mode (vite.js serves the source files)
   - the vite.js dev server listens at ```https://${ VITE_HOST }:${ VITE_PORT }```
   - HMR and auto-reload are enabled, and vite.js proxies requests to the app's api
- `npm run build`
   - builds (transpiles, treeshakes and bundles) the source files using vite.js
- `npm run test`
   - runs all jest tests against the build files and the app files
- `npm run cover`
   - outputs the jest code coverage report for the build files and the app files
- `npm run prod`
   - starts the app in production mode (the app serves the build files)
   - the app listens at ```https://${ APP_HOST }:${ APP_PORT }```
- `npm run dockerize` *(only works if docker is installed)*
   - creates a docker image and packs the build and the app in it
   - starts an interactive container from the image with ```APP_PORT``` mapped to the corresponding host port 

All the ```VITE_*``` and ```APP_*``` environment variables can be configured in the dotenv config files.

## App file system

| path                     | comments                                                                                   |
|--------------------------|--------------------------------------------------------------------------------------------|
| ```/server.js```         | express.js app main file                                                                   |
| ```/config.js```         | express.js app config file                                                                 |
| ```/routes/routes.js```  | export a single router that will be mounted on ```/${ VITE_SRV_ENTRYPOINT }```             |
| ```/routes/```           | export routers that you will import in ```routes.js```                                     |
| ```/middlewares/```      | export middlewares that implement your business logic                                      |
| ```/helpers/```          | export your business agnostic code                                                         |
| ```/static/```           | statically served source files (development) eg. your SPA's index.html (served on ```/```) |
| ```/build/```            | statically served build files (production)                                                 |
| ```/.env.files/```       | dotenv config files for environment and production                                         |
| ```/nodemon.json```      | nodemon config file                                                                        |
| ```/vite.config.js```    | vite.js config file **(specifies rollup entrypoints for vite build)**                      |
| ```/jest.config.json```  | jest config file **(specifies transforms to apply to code before tests)**                  |
| ```/babel.config.json``` | babel config file **(preset-env config used by the babel-jest transform)**                 |

## Dependencies

| Module                                                                                                              | Usage                                                      |
| --------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------- |
| <code>[@mulekick/pepe-ascii](https://www.npmjs.com/package/@mulekick/pepe-ascii)</code>                             | used as an example of client-side module bundling          |
| <code>[cookie-parser](https://www.npmjs.com/package/cookie-parser)</code>                                           | parse cookies from HTTP requests header                    |
| <code>[cors](https://www.npmjs.com/package/cors)</code>                                                             | serve or reject cross origin requests                      |
| <code>[dotenv](https://www.npmjs.com/package/dotenv)</code>                                                         | load server environment variables                          |
| <code>[express](https://www.npmjs.com/package/express)</code>                                                       | node.js web server framework                               |
| <code>[formidable](https://www.npmjs.com/package/formidable)</code>                                                 | handle multipart data and file uploads                     |
| <code>[helmet](https://www.npmjs.com/package/helmet)</code>                                                         | add security-related headers to HTTP responses             |
| <code>[jose](https://www.npmjs.com/package/jose)</code>                                                             | JSON web tokens javascript implementation                  |
| <code>[morgan](https://www.npmjs.com/package/morgan)</code>                                                         | HTTP logger for express.js                                 |
                        
## Dev dependencies
                        
| Module                                                                                                              | Usage                                                      |
| --------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------|
| <code>[@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env)</code>                                   | required by babel-jest to compile the code before tests    |
| <code>[@vitejs/plugin-legacy](https://www.npmjs.com/package/@vitejs/plugin-legacy)</code>                           | enable legacy browsers support in vite.js builds           |
| <code>[jest](https://www.npmjs.com/package/jest)</code>                                                             | delightful javascript testing                              |
| <code>[babel-plugin-transform-import-meta](https://www.npmjs.com/package/babel-plugin-transform-import-meta)</code> | babel transforms import.meta into legacy code in node.js   |
| <code>[node-fetch](https://www.npmjs.com/package/node-fetch)</code>                                                 | light-weight module that brings fetch API to node.js       |
| <code>[nodemon](https://www.npmjs.com/package/nodemon)</code>                                                       | watch server files and auto restart on file change         |
| <code>[sass](https://www.npmjs.com/package/sass)</code>                                                             | auto-compile SCSS files to CSS in vite.js builds           |
| <code>[terser](https://www.npmjs.com/package/terser)</code>                                                         | required for minification during the vite.js build process |
| <code>[vite](https://www.npmjs.com/package/vite)</code>                                                             | next generation froontend tooling                          |
| <code>[vite-plugin-webfont-dl](https://www.npmjs.com/package/vite-plugin-webfont-dl)</code>                         | extracts, downloads and injects fonts during the build     |

## Notes

1. Since everything is served over HTTPS, you'll have to create a key pair for the server _**(do not change the command arguments)**_ : 
    
    * **create a private key :**
    
    <code>openssl ecparam -param_enc named_curve -name prime256v1 -genkey -noout -outform PEM -out .server.key</code>
    
    * **create a self-signed certificate :**
    
    <code>openssl req -x509 -key .server.key -new -outform PEM -out .server.crt -verbose</code>
    
    You can then copy/paste the contents of ```.server.key``` and ```.server.crt``` in the ```.env``` file of your choice.

2. I am keeping an eye on <code>[vitest](https://vitest.dev/)</code> to use as a replacement for the jest + babel combo for running tests (their argument about the redundancy in jest and vite forcing users to configure two different pipelines is irrefutable)

3. <code>[vavite](https://github.com/cyco130/vavite)</code> looks interesting, but I don't see (as of now) the need to perform treeshaking or transpiling on the server code (unless you're using typescript), because a) you're supposed to be in control of which node.js version your app will run on and b) diskspace is not that expensive so you can live with a few kB of unused client modules in your server's filesystem. That's why I chose to silo the frontend and the backend, use vite only for what it is designed to do and rely on time-tested <code>[nodemon](https://www.npmjs.com/package/nodemon)</code> for the backend; that said, if <code>[vavite](https://github.com/cyco130/vavite)</code> is supported in the long run and takes off, I may reconsider.

4. I received this mail a few hours after making this repo public. That's very nice from them to remind me that the **sample** EC key pair that sits in the dotenv files is exposed, but when I clicked that link and was asked to grant them the permission to act on my behalf on github, I passed 😐
   
   ![This is a alt text.](https://i.imgur.com/tJPzwCS.png "I don't doubt that they're nice people, but they're not related to github.")