[![Build status](https://ci.appveyor.com/api/projects/status/8g11158wx2f53g1x?svg=true)](https://ci.appveyor.com/project/pglazkov/IndependerStarter)

# Advanced Angular Starter by www.independer.nl
Based on:
* Angular 4 Webpack Starter - https://github.com/AngularClass/angular-starter
* ASP.NET Core & Angular Universal starter - https://github.com/MarkPieszak/aspnetcore-angular2-universal 
* JavaScriptServices - https://github.com/aspnet/JavaScriptServices

## Features

* ASP.NET Core
* Angular
* Angular Universal (server-side rendering)
* Multiple Apps
* Webpack 3
* Typescript 2
* AOT compilation
* SASS
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
            
9. Navigate to http://localhost:5000 in a web browser

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
### CI build
This command will run TSLint, build all bundles in all configurations and run unit tests.
```bash
npm run ci
```

### More commands
For even more commands, please see the "scripts" section of `package.json`.

## Server-Side Rendering
Server-side rendering is enabled only when the page is requested by a search engine bot (based on User-Agent header) or if the URL contains `?_escaped_fragment_=` (a legacy way for recognizing search engine bots, but we keep it because it is useful for testing). 

In order to disable server-side rendering completely set `ServerRendering/IsEnabled` settings to `true` in `appsettings.json`:

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
