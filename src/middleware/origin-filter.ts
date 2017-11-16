import {RequestHandler} from 'express';
import {URL} from 'url';
import {StatusCode} from '../utils/StatusCode';

export let originFilter: RequestHandler;

if (process.env.ALLOWED_ORIGINS) {
  const allowed: string[] = process.env.ALLOWED_ORIGINS.toLowerCase()
    .split(/\s*,\s*/);

  originFilter = (req, res, next) => {
    const origin = req.header('origin');

    if (!origin) {
      res.status(StatusCode.FORBIDDEN).end('Could not determine origin');

      return;
    } else {
      try {
        const hostname = new URL(origin).hostname.toLowerCase();

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
  originFilter = ((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    setImmediate(next);
  });
}
