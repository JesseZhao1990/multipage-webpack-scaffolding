FROM node:12 as builder
RUN apt-get install -y git
RUN git clone https://github.com/JesseZhao1990/multipage-webpack-scaffolding.git
WORKDIR /multipage-webpack-scaffolding/
RUN npm install --registry https://registry.npm.taobao.org
RUN npm run build


FROM nginx:latest
LABEL maintainer="jessezhao"
ENV HOME="/"
WORKDIR ${HOME}
COPY --from=builder /multipage-webpack-scaffolding/dist  /web/dist
COPY ./nginx.conf  /etc/nginx/conf.d/
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
