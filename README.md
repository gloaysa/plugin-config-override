# Config Override Chrome Extension

Override configurations coming from configuration service

You can download the latest version [here](./plugin.zip)

## Project Structure

- src: Source files and app main file
  - ./extensions: available extensions loaded in manifest (could be devtools_page, background, etc.). Those are the first files to be loaded by Chrome. From there, the apps are then dynamically loaded.
  - ./apps: app that each extension loads.
  - ./components: React Components used by the apps.
  - ./assets: static files.
  - ./models: available interfaces.
  - ./services: app services.
- plugin: (after build) Chrome Extension directory (load this folder to use/test the plugin).

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
