# 步骤1：在node的环境里build出项目的dist
FROM node:12 as builder
RUN apt-get install -y git
RUN git clone https://github.com/JesseZhao1990/multipage-webpack-scaffolding.git
WORKDIR /multipage-webpack-scaffolding/
RUN npm install --registry https://registry.npm.taobao.org
RUN npm run build

# 步骤2：将步骤1 build出来的结果以及Nginx的配置拷贝到镜像中
FROM nginx:latest
LABEL maintainer="jessezhao"
ENV HOME="/"
WORKDIR ${HOME}
COPY --from=builder /multipage-webpack-scaffolding/dist  /web/dist
COPY ./nginx.conf  /etc/nginx/conf.d/
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
