import {Request, RequestHandler, Response} from 'express';
import {StatusCode} from '../utils/StatusCode';

export let allowedUsers: RequestHandler;

if (process.env.ALLOWED_USERS) {
  const allowed: string[] = process.env.ALLOWED_USERS.toLowerCase()
    .split(/\s*,\s*/);

  allowedUsers = (req: Request, res: Response, next: any) => {
    if (!req.params.user) {
      res.status(StatusCode.BAD_REQUEST).end('Could not determine username');
    } else if (!allowed.includes(req.params.user.toLowerCase())) {
      res.status(StatusCode.FORBIDDEN).end(`User ${req.params.user} not allowed.`);
    } else {
      setImmediate(next);
    }
  };
} else {
  allowedUsers = ((_req: Request, _res: Response, next: any) => {
    setImmediate(next);
  });
}
