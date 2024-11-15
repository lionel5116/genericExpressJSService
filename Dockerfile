#docker build -t assetmgmtservice:latest .
#A 
FROM node:16

#copy over main server fle
#B
COPY server.js /server.js

COPY package*.json ./

#F
RUN npm install

#E
EXPOSE 5500

#copy directories
#C
COPY config/ /config
COPY middleware/ /middleware
COPY models/ /models
COPY routes/ /routes

#D
#ENTRYPOINT ["npm", "start"]
ENTRYPOINT ["node", "server.js"]

#A The base image to build upon
#B Adds the server.js  file into the container image
#C Copies the files in the different directores into the container
#D Specifies the command to execute when the image is run
#E - Expose the PORT
#F Run npm install to install dependencies