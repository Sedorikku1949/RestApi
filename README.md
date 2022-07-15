# RestApi
> This repository is a simple typescript based template to create your API

## Why using RestApi ?
> RestApi only uses the external module [ejs](https://www.npmjs.com/package/ejs). It works with native NodeJS modules, so it doesn't have too many problems with required updates.

## How start the Rest API ?
> First, download the source code.
> 
> After, run:
> ```shell
> npm i @types-node ejs tslib
> ```
> ```shell
> npm i typescript @types/ejs --save-dev
> ```
> 
> ### To compile the Typescript:
> ```shell
> ./compile
> ```
> ⚠️ Si windows ne reconnait pas le fichier comme un executable bash, utilisez le wsl ou un équivalent pour executer le fichier.
> 
> ou
> ```shell
> echo "compiling..." && npx tsc && echo "compiled." && node .
> # or simply
> npx tsc && node .
> ```
> 
> ### To start the Rest API:
> ```shell
> npm start
> # or
> node .
> # or
> node build/main.js
> ```
> 
> ### Modifier le port :
> Change the port into `config.json` in the `src` folder and recompile (see above for compiling)