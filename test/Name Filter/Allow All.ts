import {test} from 'ava';
import * as e from 'express';
import * as request from 'supertest';
import {allowedUsers} from '../../src/middleware/name-filter';
import {StatusCode} from '../../src/utils/StatusCode';

delete process.env.ALLOWED_USERS;

const app = e();
app.get('/', allowedUsers);
app.get('/', (req: e.Request, res: e.Response) => res.end('ok'));

test('Just pass', t => {
  return request(app)
    .get('/')
    .expect(StatusCode.OK)
    .then(() => t.pass())
    .catch((err: Error) => t.fail(err.message));
});
