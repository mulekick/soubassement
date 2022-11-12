# Use an official node.js runtime as a parent image
FROM node:lts-bullseye-slim

# install npm at the global scope
RUN npm cache clean --force && \
    npm i npm@latest -g && \
    # create /src directory
    mkdir /src

# bundle app source
COPY . /src/

# Set the working directory to /src
WORKDIR /src

# install modules
RUN npm install --omit=dev

# set env as production
ENV NODE_ENV=production

# start production server
CMD [ "node", "server.js" ]