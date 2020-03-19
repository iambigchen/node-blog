### node + redis + mysql实现简单博客

1. 启动 redis server `redis-server`

2. 修改`src/conf/db.js` 下的`redis`和`mysql`的配置

2. 安装依赖 `npm install`

3. 运行指令 `npm run dev`

4. 进入静态页面目录 `cd html-test`

5. 启动http-server `http-server -p8002`

6. 配置nginx, 将起的8001和8002端口都代理到8080端口

7. 访问`localhost:8080`


nginx部分配置如下
```js
 server {
  listen       8080;
  server_name  localhost;
  location /api/ {
    proxy_pass         http://127.0.0.1:8001;
    proxy_set_header   Host             $host;
  }

  location / {
    proxy_pass         http://127.0.0.1:8002;
  }
 }
```

检测nginx配置是否有问题
`nginx -t`

启动nginx
`nginx`

