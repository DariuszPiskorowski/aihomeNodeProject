FROM node:20
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .


EXPOSE 2000

CMD ["node", "--inspect=0.0.0.0:9229", "server.js"]
