FROM node:current

WORKDIR /usr/src/app

COPY . .

RUN npm install --quiet

CMD ["npm", "run", "test:docker"]