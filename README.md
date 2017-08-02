[![Build status](https://ci.appveyor.com/api/projects/status/8g11158wx2f53g1x?svg=true)](https://ci.appveyor.com/project/pglazkov/IndependerStarter)

# Angular Starter by www.independer.nl
Angular starter project that we use at www.independer.nl as a starting point for Angular-based projects.  

Based on:
* Angular2 Webpack Starter - https://github.com/AngularClass/angular2-webpack-starter
* ASP.NET Core & Angular 2+ Universal starter - https://github.com/MarkPieszak/aspnetcore-angular2-universal 
* AspNetCoreSpa - https://github.com/asadsahi/AspNetCoreSpa
* JavaScriptServices - https://github.com/aspnet/JavaScriptServices

## Features

* ASP.NET Core
* Angular 2+
* Angular Universal (server-side rendering)
* Webpack 3
* Typescript 2
* AOT compilation
* SASS
* End-to-end testing of Angular 2 code using Protractor
* HMR (Hot Module Replacement) with Webpack
* Webpack DLL support for fast builds in development mode
* Lazy routes
* [@ngx-meta](https://github.com/ngx-meta/core) for SEO
 
## Pre-requisites

1. [.NET Core SDK 1.1+](https://www.microsoft.com/net/core#windows)
3. [Node.js 6+](https://nodejs.org/en/)

## Getting Started
1. Clone this repository
2. Restore .NET Core packages:

          dotnet restore
3. Restore NPM packages:

          npm install
8. Run the app using one the options:
    * From command-line
    
            npm run start:dev
       
    * From Visual Studio Code:
       
            Ctrl+Shift+B - runs default "build" task that in turn runs "npm run start:dev"
       
    * From Visual Studio:
    
            F5 - starts IIS Express development server.
9. In the browser go to http://localhost:5000


## Other commands

### Build Production Bundles
```bash
npm run build:prod
```
### Build Server-Side Rendering Bundles
```bash
npm run build:server
```
```bash
npm run build:server:prod
```
### Run End-to-End Tests
```bash
npm run e2e:dev
```
```bash
npm run e2e:prod
```
OR
```bash
npm run ci
```
This last command will first make the development build, then run e2e tests, then make the production build and then again run e2e tests.

### More commands
For even more commands, please see the "scripts" section of `package.json`.

## Server-Side Rendering
Server-side rendering is enabled only for `Production` environment by default (see `appsettings.Production.json`). In order to enable it for `Development` environment as well, you need to modify `appsettings.json` and set `ServerRendering/IsEnabled` settings to `true`:

```json
{
  ...
  "ServerRendering": {
    "IsEnabled": true
  }
}

```
Additionally, in order for server-side rendering to work, we need to build the application bundles that can be executed on the server-side with NodeJS. To build the "server" bundles, the following commands can be used:
```bash
npm run build:server
```
```bash
npm run build:server:prod
```
So, to test the application with server-side rendering in `Development` mode, you need to run two commands:
```bash
npm run build:server && npm run start:dev
```
And similarly, to test the application with server-side rendering in `Production` mode:
```bash
npm run build:prod && npm run build:server:prod && npm run start:prod
```
