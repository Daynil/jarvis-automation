import { readFileSync } from 'fs';
import * as ssh2 from 'ssh2';
import { log, LogType } from './logger';

class SSH {
  private _conn: ssh2.Client;

  constructor() {
    this._conn = new ssh2.Client();

    this._conn.on('end', () => {
      log('Connection closed', LogType.Info);
      this._conn = new ssh2.Client();
    });
  }

  private async getConn() {
    try {
      await this.connect();
      return this._conn;
    } catch (e) {
      log(e, LogType.Error);
    }
  }

  private connect() {
    return new Promise((resolve, reject) => {
      this._conn.on('error', e => reject(e));

      this._conn.on('ready', () => {
        log('SSH connected successfully.', LogType.Success);
        resolve(this._conn);
      });

      this._conn.connect({
        host: process.env.MAIN_DROPLET_IP,
        username: 'root',
        privateKey: readFileSync(process.env.SSH_DIR)
      });
    });
  }

  private exec(command: string) {
    const res = [];
    return new Promise<string[]>((resolve, reject) => {
      this.getConn()
        .then(conn => {
          conn.exec(command, (err, stream) => {
            if (err) reject(err);
            stream.on('data', data => log(data.toString('utf-8')));
            stream.on('close', (code, signal) => {
              log(
                `Stream closed, code: ${code}, signal: ${signal}`,
                LogType.Info
              );
              conn.end();
              resolve(res);
            });
            stream.stderr.on('data', data => reject(data.toString('utf8')));
          });
        })
        .catch(e => reject(e));
    });
  }

  async sendCommands(commands: string[]) {
    try {
      console.log('commands sent: ', commands.join(' && '));
      await this.exec(commands.join(' && '));
    } catch (e) {
      log(e, LogType.Error);
    }
  }
}

export const ssh = new SSH();
