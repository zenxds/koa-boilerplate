FROM node:8

ENV APP_DIR /var/www/app

RUN mkdir -p $APP_DIR

WORKDIR $APP_DIR

COPY package.json $APP_DIR

RUN npm install --registry=https://registry.npm.taobao.org

COPY . $APP_DIR

EXPOSE 7002

VOLUME $APP_DIR/config
VOLUME $APP_DIR/app/public

# Entrypoint
CMD ["npm", "run", "docker:start"]