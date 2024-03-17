import { argv } from 'node:process';

const args = cliArgs();
const params = {
  port: '',
};

export function parseArgs() {
  console.time('Ended in');

  while (args.length > 0) {
    const arg = args.shift();
    switch (arg) {
      case '-p':
      case '--port':
        params.port = args.shift()!;
        break;
      case '-h':
      case '--help':
        console.log(helpText());
        break;
      default:
        console.error(`Unknown argument: ${arg}`, '\n', helpText());
    }
  }

  console.info('CLI args:', params);
}

function getAppPort() {
  return parseInt(params.port || '0');
}

function helpText() {
  return `
  Usage: node main.js [options]

  Options:
    -p, --port <port>    Port to listen
    -h, --help           Show this help


  Example:
    $ node main.js -h
    $ node main.js -p 3000
    $ node main.js --port 3000
    $ node main.js --help
  `;
}

function cliArgs() {
  return argv.slice(2);
}

function argsProvided() {
  return argv.length > 2;
}

export const cli = {
  cliArgs,
  argsParse: parseArgs,
  getAppPort,
  argsProvided,
};
