ROOT=`pwd`
export NODE_ENV=production

PROJECT_NAME=project_name
CONTAINER=container

echo $ROOT
cd $ROOT/client && npm run _build

rm -rf $ROOT/server/app/public/admin
cp -r $ROOT/node_modules/koa-sequelize-admin/dist $ROOT/server/app/public/admin

docker exec $CONTAINER sh -c "NODE_ENV=production node script/updateVersion.js"
cd $ROOT/server && docker-compose -p $PROJECT_NAME up -d --build