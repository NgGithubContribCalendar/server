import * as request from 'request';

function constructURL(user: string, to?: string): string {
  let url = `https://github.com/users/${user}/contributions`;

  if (to) {
    url += `?to=${to}`;
  }

  return url;
}

export function fetchHTML(user: string, to?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = constructURL(user, to);

    request.get(url, (err: any, rsp: any, data: string) => {
      if (err) {
        reject(err);
      } else if (!data) {
        reject(new Error('no body'));
      } else {
        resolve(data);
      }
    });
  })
}