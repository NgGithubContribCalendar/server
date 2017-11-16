import {test} from 'ava';
import * as express from 'express';
import {Request, Response} from 'express'; // tslint:disable-line:no-duplicate-imports
import * as request from 'supertest';
import {allowedUsers} from '../../src/middleware/name-filter';
import {StatusCode} from '../../src/utils/StatusCode';

delete process.env.ALLOWED_USERS;

const app = express();
app.get('/', allowedUsers);
app.get('/', (req: Request, res: Response) => res.end('ok'));

test('Just pass', t => {
  return request(app)
    .get('/')
    .expect(StatusCode.OK)
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});
