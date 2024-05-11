FROM node:20

# working directory
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

# Expose the debugger port
EXPOSE 9229

CMD ["node", "--inspect=0.0.0.0:9229", "bridge.js"]
