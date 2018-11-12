import chalk from 'chalk';

export enum LogType {
  Success,
  Error,
  Info
}

export function log(message: string, type?: LogType) {
  switch (type) {
    case LogType.Success:
      console.log(chalk.green(message));
      break;
    case LogType.Error:
      console.log(chalk.redBright(message));
      break;
    case LogType.Info:
      console.log(chalk.yellow(message));
      break;
    default:
      console.log(message);
      break;
  }
}
