import {IParsedPayload} from '@ng-github-contrib-calendar/common-types';
import * as redis from 'redis';
import {Numerics} from './Numerics';

export interface ICache {
  getItem(username: string, to?: string): Promise<null | IParsedPayload>;

  setItem(data: IParsedPayload, username: string, to?: string): Promise<void>;
}

const calcKey = (username: string, to?: string): string => `${username}|${to || ''}`;

export let Cache: ICache; // tslint:disable-line:variable-name

if (process.env.REDISCLOUD_URL) {
  const client = redis.createClient(process.env.REDISCLOUD_URL);

  Cache = {
    getItem(username: string, to?: string) {
      return new Promise((resolve, reject) => {
        client.get(calcKey(username, to), (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(data));
          }
        });
      });
    },
    setItem(data: IParsedPayload, username: string, to?: string) {
      return new Promise((resolve, reject) => {
        client.setex(calcKey(username, to), Numerics.SECONDS_IN_HOUR, JSON.stringify(data), err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  };
} else {
  Cache = {
    getItem: (username: string, to?: string) => Promise.resolve(null),
    setItem: (data: IParsedPayload, username: string, to?: string) => Promise.resolve()
  };
}

Object.freeze(Cache);
