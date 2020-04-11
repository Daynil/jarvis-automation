import inquirer from 'inquirer';
import { keyInSelect } from 'readline-sync';

export type app =
  | 'dannysite'
  | 'dlibin-api'
  | 'reacthn'
  | 'shelleysite'
  | 'inner-path';

const appNameList: app[] = [
  'dannysite',
  'dlibin-api',
  'reacthn',
  'shelleysite',
  'inner-path'
];

const apps = [
  {
    name: 'dannysite',
    dir: './daynil-site',
    buildCommand: 'build-prod',
    entry: 'server.js'
  },
  {
    name: 'dlibin-api',
    dir: './dlibin-api',
    buildCommand: 'build:prod',
    entry: ''
  },
  {
    name: 'dannysite',
    dir: './daynil-site',
    buildCommand: 'build-prod',
    entry: ''
  },
  {
    name: 'dannysite',
    dir: './daynil-site',
    buildCommand: 'build-prod',
    entry: ''
  },
  {
    name: 'dannysite',
    dir: './daynil-site',
    buildCommand: 'build-prod',
    entry: ''
  }
];

async function chooseApp() {
  const ans = await inquirer.prompt([
    {
      type: 'list',
      name: 'appName',
      message: 'Choose app to check',
      choices: appNameList
    }
  ]);
  return apps.find((app) => app.name === ans.appName).name;
}

export async function checkAppStatus() {
  const appName = await chooseApp();

  return [`pm2 show ${appName}`];
}

export async function checkAppLogs(numLines?: number) {
  const appName = await chooseApp();

  return [`pm2 log ${appName} --lines ${numLines}`];
}

export async function restartApp(appName?: string) {
  if (appName) return [`pm2 restart ${appName}`];
  const appNameSelected = await chooseApp();

  return [`pm2 restart ${appNameSelected}`];
}

export async function updateApp(): Promise<string[]> {
  const index = keyInSelect(appNameList);

  if (index < 0) return process.exit(0);
  const app = apps.find((app) => app.name === appNameList[index]);
  const commandList = [];

  commandList.push(`cd ${app.dir}`);
  commandList.push('git pull origin master');
  commandList.push('npm install');
  commandList.push(`npm run ${app.buildCommand}`);

  return [...commandList, ...(await restartApp(app.name))];
}
