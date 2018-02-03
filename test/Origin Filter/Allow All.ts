import test from 'ava';
import * as e from 'express';
import * as request from 'supertest';
import {originFilter} from '../../src/middleware/origin-filter';
import {StatusCode} from '../../src/utils/StatusCode';

delete process.env.ALLOWED_ORIGINS;

const app = e();
app.get('/', originFilter);
app.get('/', (_req: e.Request, res: e.Response) => res.end('ok'));

test('Just pass', t => {
  return request(app)
    .get('/')
    .expect(StatusCode.OK)
    .then(() => t.pass())
    .catch((err: Error) => t.fail(err.message));
});
