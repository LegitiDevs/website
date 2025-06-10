FROM node:22-alpine

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

EXPOSE 3002
env PORT=3002

CMD [ "node", "build/" ]
