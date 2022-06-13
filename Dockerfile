FROM node:12.22.0

ENV APP_DIR /var/www

ENV TZ Asia/Shanghai

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && mkdir -p $APP_DIR \
    && npm set registry https://registry.npmmirror.com \
    && npm install -g pm2 \
    && pm2 install pm2-intercom

WORKDIR $APP_DIR

COPY yarn.lock package.json $APP_DIR/

RUN yarn install --production --registry=https://registry.npmmirror.com \
    && yarn cache clean

COPY . $APP_DIR

EXPOSE 7002

# Entrypoint
CMD ["npm", "run", "start:docker"]
