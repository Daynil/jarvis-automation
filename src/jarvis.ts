import * as jarvis from 'commander';
import { log, LogType } from './logger';
import { ssh } from './ssh';

const { version } = require('../package.json');

jarvis.version(version);

jarvis
  .command('servstats')
  .description('Check status of servers.')
  .action(() => {
    ssh.sendSSHCommand('pm2 list');
  });

jarvis
  .command('test')
  .description('tests the jarvis tool')
  .action(() => {
    ssh.sendSSHCommand('ls && cd dlibin-api && ls');
  });

jarvis.command('*').action(() => {
  log('Invalid command.', LogType.Error);
  jarvis.help();
});

jarvis.parse(process.argv);

if (!process.argv.slice(2).length) {
  log('Please pass a command.', LogType.Error);
  jarvis.help();
}
