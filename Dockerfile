FROM swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/nginx:1.29.1-alpine



# 把你的 dist 文件夹内容拷贝到 nginx 默认静态目录
COPY ./dist /usr/share/nginx/html

# 把自定义的 nginx 配置文件拷贝到容器内
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]