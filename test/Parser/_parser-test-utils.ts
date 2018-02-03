import {readFile} from 'fs';
import {join} from 'path';

export function loadFixture(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    readFile(join(__dirname, 'fixture.svg'), 'utf8', (err: Error, data: string) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
