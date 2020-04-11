import { exec } from 'child_process';

export function execShell(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) console.warn(error);
      else resolve(stdout ? stdout : stderr);
    });
  });
}
