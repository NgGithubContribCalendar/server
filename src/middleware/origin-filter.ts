import {RequestHandler} from "express";
import {URL} from 'url';

export let originFilter: RequestHandler;

if (process.env.ALLOWED_ORIGINS) {
  const allowed: string[] = process.env.ALLOWED_ORIGINS.toLowerCase()
    .split(/\s*,\s*/);

  originFilter = (req, res, next) => {
    const origin = req.header('origin');

    if (!origin) {
      res.status(403).end('Could not determine origin');
      return;
    } else {
      try {
        const hostname = new URL(origin).hostname.toLowerCase();

        if (!allowed.includes(hostname)) {
          res.status(403).end(`Origin ${hostname} not allowed.`);
        } else {
          res.header('Access-Control-Allow-Origin', '*');
          setImmediate(next);
        }
      } catch (e) {
        res.status(500).end(e.message);
      }
    }
  };
} else {
  originFilter = ((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    setImmediate(next);
  })
}