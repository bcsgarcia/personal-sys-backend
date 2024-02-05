FROM node:latest

WORKDIR /home/node/personalsysbackend

COPY . .
# COPY ./.env.prod ./.env

RUN npm install --quiet --no-optional --no-fund --loglevel=error

RUN npm run build

EXPOSE 3005

CMD ["npm", "run", "start:prod"]