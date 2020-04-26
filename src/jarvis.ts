//const exec = promisify(require("child_process").exec);
import jarvis from 'commander';
import inquirer from 'inquirer';
import fetch from 'node-fetch';
import { checkAppLogs, checkAppStatus, restartApp, updateApp } from './CI';
import { log, LogType } from './logger';
import { execShell } from './node-util';
import { ssh } from './ssh';

const { version } = require('../package.json');

jarvis.version(version);

jarvis
  .command('test')
  .description('Jarvis systems test')
  .action(async () => {
    const ans = await inquirer.prompt([
      {
        type: 'list',
        name: 'testType',
        message: 'Choose test type',
        choices: ['CMD/Shell command', 'SSH remote command']
      }
    ]);
    if (ans.testType === 'CMD/Shell command') {
      if (process.platform === 'win32') console.log(await execShell('dir'));
      else console.log(await execShell('ls'));
    } else ssh.sendCommands(['ls && cd dlibin-api && ls']);
  });

jarvis
  .command('explorer-restart')
  .description('Restart windows explorer')
  .action(async () => {
    console.log(await execShell('taskkill /F /IM explorer.exe'));
    execShell('start explorer.exe');
    // Starting explorer works, but hangs process for some reason
    // Wait for command to be issued and force process exit
    setInterval(() => process.exit(), 100);
  });

jarvis
  .command('ping-firebase')
  .description('Check status of firebase functions')
  .action(async () => {
    let res = await fetch(
      'https://us-central1-dlibin-api-ca89a.cloudfunctions.net/ping'
    );
    const start = process.hrtime();
    try {
      res = await res.json();
    } catch (e) {}
    if (res.status === 200) {
      const time = process.hrtime(start);
      log(
        `Systems green! Ping: ${time[0] * 1000 + time[1] / 1000000}ms`,
        LogType.Success
      );
    } else {
      log('System error', LogType.Error);
      console.error(res);
    }
  });

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
  .action(async ({ numlines }: { numlines: number }) => {
    ssh.sendCommands(await checkAppLogs(numlines));
  });

jarvis
  .command('app-stats')
  .description('Check that status of a remote app on server.')
  .action(async () => {
    ssh.sendCommands(await checkAppStatus());
  });

jarvis
  .command('app-restart')
  .description('Restart a remote app on server.')
  .action(async () => {
    ssh.sendCommands(await restartApp());
  });

jarvis
  .command('app-update')
  .description('Pull updates from git and restart a remote app on server.')
  .action(async () => {
    ssh.sendCommands(await updateApp());
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
