# xhis-frontend-sample 

Frontend SDK is a software development kit that allows developers to build **xhis** interfaces for web applications. It comes with a variety of pre-built components and tools that help developers create high-quality **xhis** applications with ease. 

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Project Setup

Please make sure NodeJs 16 LTS is used, please use nvm(linux, mac) or nvs(window) to switch environment.

```sh
nvs use 16
```

There are two situations when you try to setup your project for development
### 1. **You are a developer worked in AICS**
```sh
npm install
```

Compile and Hot-Reload for Development
```sh
npm run dev
```

### 2. **You are outsourcing third party which is learning xhis-frontend-sample**

Due to the reason some packages are authorized by AICS at npm registry, **it will not be possible to `npm install` those packages without our oragnization token, so here are the workaround we provided**, please note the following is a temperary workaround, we will be able to generate the specific registry for SDK user quickly in the future.

After cloning the repo from this site, go to the following link, **there will be slightly difference between operating system** ( currently only window considering the first group of tester all using window)

- **Window**
> https://asus-my.sharepoint.com/:u:/p/kai_you/EbTdnUs1tXFImV4WWNnnJ24BDgv4dd2jy1X6H6j8LcxeFg?e=nTckQ2

Download the **node_modules** zip file, and **unzip the file**, you will see a `node_modules` folder, then move the file to the `xhis-frontend-sample` folder( unzip the file will take a while depending on you computer speed, please be patient )

> **Please note you don't have to run `npm install` again, since this will have the potential danger to corrupt the packages you download from the above link**

You should be able to see a `node_modules` folder in your `xhis-frontend-sample` folder, then run 

```sh
npm run dev
```

```sh
npm run docs:dev
```

now you can enjoy the development by **opening `localhost:5173` and read the tutorial at `localhost:5174` in your browser**

## Common issues

### Permssion denied while npm run dev 

First, check if you are on mac operating system, we don't support mac in third party for now, if you are on a window operating system, try the following command.

```sh
chmod -R a+x node_modules 
```


