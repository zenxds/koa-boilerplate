FROM node:12

ENV APP_DIR /var/www

ENV TZ Asia/Shanghai

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && mkdir -p $APP_DIR

WORKDIR $APP_DIR

COPY yarn.lock package.json $APP_DIR

RUN yarn install --production --registry=https://registry.npmmirror.com \
    && yarn global add pm2 \
    && npm set registry https://registry.npmmirror.com \
    && pm2 install pm2-intercom \
    && yarn cache clean

COPY . $APP_DIR

EXPOSE 7002

# Entrypoint
CMD ["npm", "run", "start:docker"]
