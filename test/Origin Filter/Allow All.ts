delete process.env.ALLOWED_ORIGINS;

import {originFilter} from "../../src/middleware/origin-filter";
import test from 'ava';
import * as express from 'express';
import {Request, Response} from 'express';
import * as request from 'supertest';


const app = express();
app.get('/', originFilter);
app.get('/', (req: Request, res: Response) => res.end('ok'));

test("Just pass", t => {
  return request(app)
    .get('/')
    .expect(200)
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});