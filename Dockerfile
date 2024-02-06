FROM node:20.11.0

WORKDIR /home/node/personalsysbackend

COPY . .
# COPY ./.env.prod ./.env

RUN npm install --quiet --no-optional --no-fund --loglevel=error

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]