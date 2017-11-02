import {readFile} from "fs";
import {join} from "path";

export function loadFixture(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    readFile(join(__dirname, 'fixture.svg'), 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  })
}
