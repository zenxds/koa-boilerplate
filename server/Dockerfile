FROM zenxds/node-12

ENV APP_DIR /home/node

WORKDIR $APP_DIR

COPY yarn.lock package.json $APP_DIR/

RUN yarn install --production --registry=https://registry.dingxiang-inc.com \
    && yarn cache clean

COPY . $APP_DIR

RUN cp -r node_modules/koa-sequelize-admin/dist app/public/admin

EXPOSE 7002

# Entrypoint
CMD ["npm", "run", "start:docker"]
