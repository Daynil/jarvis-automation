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
  },
  {
    name: 'dannysite',
    dir: './daynil-site',
    buildCommand: 'build-prod',
    entry: ''
  }
];

export function checkAppStatus() {
  const index = keyInSelect(appNameList);

  if (index < 0) return process.exit(0);

  return [`pm2 show ${appNameList[index]}`];
}

export function checkAppLogs(numLines?: number) {
  const index = keyInSelect(appNameList);

  if (index < 0) return process.exit(0);

  return [`pm2 log ${appNameList[index]} --lines ${numLines}`];
}

export function restartApp(appName?: string) {
  if (appName) return [`pm2 restart ${appName}`];
  const index = keyInSelect(appNameList);

  if (index < 0) return process.exit(0);

  return [`pm2 restart ${appNameList[index]}`];
}

export function updateApp() {
  const index = keyInSelect(appNameList);

  if (index < 0) return process.exit(0);
  const app = apps.find(app => app.name === appNameList[index]);
  const commandList = [];

  commandList.push(`cd ${app.dir}`);
  commandList.push('git pull origin master');
  commandList.push('npm install');
  commandList.push(`npm run ${app.buildCommand}`);

  return [...commandList, ...restartApp(app.name)];
}
