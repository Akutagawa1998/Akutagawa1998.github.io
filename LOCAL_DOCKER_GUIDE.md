# 在本地使用 Docker 运行主页

这份文档是针对当前项目的本地预览指南（`al-folio` + Docker Compose）。

## 1) 前置条件

- 已安装并启动 Docker Desktop
- 当前目录为项目目录：

```bash
cd "/Users/nagi/Documents/GitHub/Akutagawa1998.github.io"
```

## 2) 首次启动（推荐）

```bash
docker compose down --remove-orphans
docker compose pull
docker compose up
```

启动成功后访问：

- http://127.0.0.1:8000/

说明：

- 当前 `docker-compose.yml` 已配置端口映射 `8000:8000`
- 启动命令里会自动执行 `bundle install`，然后启动 Jekyll 服务

## 3) 日常使用

### 启动

```bash
docker compose up
```

### 停止

```bash
docker compose down
```

### 后台运行

```bash
docker compose up -d
```

### 查看日志

```bash
docker compose logs -f --tail=120
```

## 4) 修改后页面不更新怎么办

1. 先强制刷新浏览器：
   - macOS: `Cmd + Shift + R`
2. 仍不生效则重启容器：

```bash
docker compose down --remove-orphans
docker compose up
```

3. 若依然有缓存问题，可清卷后重启：

```bash
docker compose down -v --remove-orphans
docker compose up
```

## 5) 常见问题排查

### A. 打不开页面 / `This site can't be reached`

检查容器状态：

```bash
docker compose ps --all
```

检查日志：

```bash
docker compose logs --tail=120
```

### B. 端口被占用

```bash
lsof -iTCP:8000 -sTCP:LISTEN
```

如果有占用，先结束占用进程，或改 `docker-compose.yml` 端口映射（例如改成 `4001:8000`）。

### C. 命令拼接错误（很常见）

请分两条命令执行，不要写成一行拼接字符串。

正确示例：

```bash
docker compose down --remove-orphans
docker compose up
```

## 6) 当前项目关键配置（供参考）

当前 `docker-compose.yml` 中：

- 镜像：`amirpourmand/al-folio:v0.16.3`
- 服务端口：`8000`
- 端口映射：`8000:8000`
- 启动命令：
  - `bundle install`
  - `bundle exec jekyll serve --host 0.0.0.0 --port 8000 --livereload --livereload-port 35729`

