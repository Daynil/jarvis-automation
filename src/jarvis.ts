import * as colors from 'colors';
import * as jarvis from 'commander';
import * as shell from 'shelljs';
const { version } = require('../package.json');

jarvis.version(version);

jarvis
  .command('test')
  .description('tests the jarvis tool')
  .action(() => {
    shell.exec('ls');
  });

jarvis.command('*').action(() => {
  console.log(colors.red('Invalid command.'));
  jarvis.help();
});

jarvis.parse(process.argv);

if (!process.argv.slice(2).length) {
  console.log(colors.red('Please pass a command.'));
  jarvis.help();
}
