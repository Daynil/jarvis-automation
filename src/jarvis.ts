import * as jarvis from 'commander';
import { checkAppLogs, checkAppStatus, restartApp, updateApp } from './CI';
import { log, LogType } from './logger';
import { ssh } from './ssh';

const { version } = require('../package.json');

jarvis.version(version);

jarvis
  .command('serv-stats')
  .description('Check status of servers.')
  .action(() => {
    ssh.sendCommands(['pm2 list']);
  });

jarvis
  .command('app-logs')
  .description('Check logs of a remote app on server.')
  .option('-n, --numlines <n>', 'Specify lines of log to display', parseInt)
  .action(cmd => {
    ssh.sendCommands(checkAppLogs(cmd.numlines));
  });

jarvis
  .command('app-stats')
  .description('Check that status of a remote app on server.')
  .action(() => {
    ssh.sendCommands(checkAppStatus());
  });

jarvis
  .command('app-restart')
  .description('Restart a remote app on server.')
  .action(() => {
    ssh.sendCommands(restartApp());
  });

jarvis
  .command('app-update')
  .description('Pull updates from git and restart a remote app on server.')
  .action(() => {
    ssh.sendCommands(updateApp());
  });

jarvis
  .command('test')
  .description('tests the jarvis tool')
  .action(() => {
    ssh.sendCommands(['ls && cd dlibin-api && ls']);
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
