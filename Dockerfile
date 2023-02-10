FROM node:18

WORKDIR /code

COPY package*.json /code/

RUN npm install 

COPY . /code/

EXPOSE 5000

CMD [ "node", "server.js" ]