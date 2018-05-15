# 开箱即用的多页面webpack脚手架
最近接手一个新项目，公司官网，官网为了对爬虫友好，不合适做单页面，更不大适合用react，vue这样的框架。本来觉得几个简单的页面还需要配置webpack挺麻烦，直接ES5，css，html写写就ok，可是一旦下手开始写，离开了前端的各种得心应手的工具，回到了刀耕火种的时代。痛不欲生，即使写完了，以后的迭代维护同样痛苦。 还不如创建一个脚手架，以后遇到这种官网多页面的需求的时候拿来即用，岂不美哉。

好了，背景就是这些，本脚手架适合做官网之类的多页面的应用。本脚手架已经支持使用ES6，less，模块化，热加载，eslint等功能


## Build Setup

``` bash
# 安装依赖
npm install

# 开发的时候在本地启localhost:8080，并开始热加载
npm run dev

# production的发布时打包
npm run build

```


## 目录结构

```

└─src                                      // src 文件夹
│    ├─pages                               // 页面文件夹
│    │  ├─about
│    │  │      about.html
│    │  │      about.js
│    │  │      about.less
│    │  │
│    │  ├─contact
│    │  │      contact.css
│    │  │      contact.html
│    │  │      contact.js
│    │  │
│    │  └─home
│    │          index.html
│    │          index.js
│    │          index.less
│    │
│    └─tools                          // 工具文件夹
│            utils.js
│
│  .babelrc                         // babel的配置文件
│  .eslintignore
│  .eslintrc.js                     // eslint的配置文件
│  .gitignore
│  ecosystem.config.js              // pm2 deploy的配置文件
│  package.json
│  page.config.js                   // 页面的配置文件
│  README.md
│  webpack.config.dev.js            // 开发环境的webpack配置文件
│  webpack.config.prod.js           // 生成环境的webpack配置文件
         

```

## 开发流程

如果增加新页面，只需两步，不需要改webpack等配置文件

1. 在pages中新增一个文件夹
2. 在page.config.js中添加这个页面的信息即可

比如
```
  {
    name: 'contact',
    html: 'contact/contact.html',
    jsEntry: 'contact/contact.js'
  }

```


## 部署测试环境

### 1.配置ssh免密登录

* 查看本机是否有一对秘钥？mac 到~/.ssh目录下查看，windows到 C:\Users\zhangsan（自己的用户名）\.ssh

```
ls

id_rsa      id_rsa_vc      known_hosts  rhc.pub
id_rsa.pub  id_rsa_vc.pub  rhc

```


发现存在密钥对。若不存在，则生成一对

```
ssh-keygen -t rsa --P

```

* 登录远程测试机，到用户目录下的.ssh文件夹下，查看是否有authorized_keys，没有的话创建一个

```
ssh root@xxx.xx.xx.xx
cd ~/.ssh/
vim authorizd_keys

```
vim 打开authorized_keys之后，把你本机的公钥里的内容拷贝到远程机器的authorized_keys文件中，不要删除authorized_keys已有的公钥，在已有的内容的下面粘贴即可。然后保存文件。验证是否能免密登录了。

```
ssh root@xxx.xx.xx.xx

```
经验证发现登录成功，没要求输入密码。此时免密登录的设置完成

### 2.远程发布

* 确保本机已安装全局的pm2,下面是我本机的结果，已安装pm2，没安装的话，安装一下

```
npm list -g --depth=0   | grep pm2
-- pm2@2.8.0

```
没安装的话，全局安装一下pm2

```
npm install pm2 -g

```

* 在本项目的根目录下，运行创建环境的命令(首次跑的时候需要用，此后就不再需要了)

```
pm2 deploy ecosystem.config.js dev setup

```


* 发布命令

```
pm2 deploy ecosystem.config.js dev                // 发布dev分支到dev环境
pm2 deploy ecosystem.config.js test                // 发布master分支到test环境
```


学习pm2的deploy，[详情请进入](http://pm2.keymetrics.io/docs/usage/deployment/#windows-consideration)
