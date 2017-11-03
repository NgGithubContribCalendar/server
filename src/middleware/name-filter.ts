import {RequestHandler} from "express";

export let allowedUsers: RequestHandler;

if (process.env.ALLOWED_USERS) {
  const allowed: string[] = process.env.ALLOWED_USERS.toLowerCase()
    .split(/\s*,\s*/);

  allowedUsers = (req, res, next) => {
    if (!req.params.user) {
      res.status(400).end('Could not determine username');
    } else if (!allowed.includes(req.params.user.toLowerCase())) {
      res.status(403).end(`User ${req.params.user} not allowed.`);
    } else {
      setImmediate(next);
    }
  };
} else {
  allowedUsers = ((req, res, next) => {
    setImmediate(next);
  })
}