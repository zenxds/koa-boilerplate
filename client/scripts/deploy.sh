account=root@10.0.0.0

npm run build
scp -r ./build/* ${account}:/root/docker/dir/html
