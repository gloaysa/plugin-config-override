# ![Logo](src/assets/images/icon-50.png) ONEShop Config Override Chrome Extension

Override configurations coming from configuration service

## Project Structure

- src: Source files and app main file
  - ./extensions: available extensions loaded in manifest (could be devtools_page, background, etc.)
  - ./apps: app that each extension loads
  - ./components: React Components
  - ./assets: static files
  - ./models: available interfaces
  - ./services: app services
- plugin: (after build) Chrome Extension directory

## Setup

```
npm install
```

## Build

```
npm run build
```

## Build in watch mode

```
npm run watch
```

## Load extension to chrome

Load newly created `plugin` directory

## Test

`npx jest` or `npm run test`
