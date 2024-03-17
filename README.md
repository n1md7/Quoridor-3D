# NestJS SWE Template

## Installation

```bash
# Use required version of Node.js/NPM
$ nvm use
# Install dependencies
$ npm install
```

## Running the service

Create `.env.${NODE_ENV}` file from `.env.example` and set required values.

Valid values for `NODE_ENV` are: `development`, `production`, `test`, `e2e`.

Alternatively, you can use `npm run gen:env-files` command to generate env files automatically from the `.env.example`
template.

```bash
# run service
npm run start:dev
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
