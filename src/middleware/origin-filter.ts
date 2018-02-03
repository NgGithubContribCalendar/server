import {Request, RequestHandler, Response} from 'express';
import {URL} from 'url';
import {StatusCode} from '../utils/StatusCode';

export let originFilter: RequestHandler;

if (process.env.ALLOWED_ORIGINS) {
  const allowed: string[] = process.env.ALLOWED_ORIGINS.toLowerCase()
    .split(/\s*,\s*/);

  originFilter = (req: Request, res: Response, next: any): void => {
    const origin: string = req.header('origin');

    if (!origin) {
      res.status(StatusCode.FORBIDDEN).end('Could not determine origin');

      return;
    } else {
      try {
        const hostname: string = new URL(origin).hostname.toLowerCase();

        if (!allowed.includes(hostname)) {
          res.status(StatusCode.FORBIDDEN).end(`Origin ${hostname} not allowed.`);
        } else {
          res.header('Access-Control-Allow-Origin', '*');
          setImmediate(next);
        }
      } catch (e) {
        res.status(StatusCode.SERVER_ERROR).end(e.message);
      }
    }
  };
} else {
  originFilter = ((_req: Request, res: Response, next: any) => {
    res.header('Access-Control-Allow-Origin', '*');
    setImmediate(next);
  });
}
