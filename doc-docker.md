<!-- BUILD image -->

```bash
docker build -t duonggquocc/img-cyber_community:latest .
docker build -t duonggquocc/img-cyber_email:latest .
docker build -t duonggquocc/img-cyber_order:latest .
```

<!-- DELETE image -->

```bash
docker rmi duonggquocc/img-cyber_community:latest
docker image remove duonggquocc/img-cyber_community:latest
docker image remove duonggquocc/img-cyber_email:latest
docker image remove duonggquocc/img-cyber_order:latest

```

<!-- RUN container -->

```bash
docker run --name con-cyber_community -p 3070:3069  --env-file .env -d duonggquocc/img-cyber_community:latest
```

<!-- DELETE container -->
```bash
docker rm con-cyber_community
docker container remove con-cyber_community
docker container remove con-cyber-email
docker container remove con-cyber-order


```

<!-- STOP container -->
```bash
docker container stop con-cyber_community
docker container stop con-cyber-order

```

<!-- LIST : những cái đang chạy -->
```bash
docker image list
docker container list <=> docker ps
```
<!-- LIST : những cái đang stop và đang chạy  -->
```bash
docker image list -a
docker container list -a <=> docker ps -a
```

<!--Xem terminal của 1 container-->
```bash
docker logs con-cyber-email 
```