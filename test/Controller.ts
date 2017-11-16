import test from 'ava';
import * as _ from 'lodash';
import * as request from 'supertest';
import {app} from '../src/app';
import {StatusCode} from '../src/utils/StatusCode';

delete process.env.ALLOWED_ORIGINS;
delete process.env.ALLOWED_USERS;

test.before('Set worker ID', () => {
  app.set('workerID', 'foo');
});

test('Ping', t => {
  return request(app)
    .get('/ping')
    .expect(StatusCode.OK, 'pong')
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});

const stdHeaders = {
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'deny',
  'X-Powered-By': "Trump's tiny cocktail sausage fingers",
  'X-serviced-By': 'foo'
};

_.forEach(stdHeaders, (v: string, k: string) => {
  test(`Sets the ${k} header`, t => {
    return request(app)
      .get('/ping')
      .expect(StatusCode.OK)
      .expect(k, v)
      .then(() => t.pass())
      .catch((e: Error) => t.fail(e.message));
  });
});

test('Redirect', t => {
  return request(app)
    .get('/')
    .expect(StatusCode.FOUND)
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});

test('To invalid regex', t => {
  return request(app)
    .get('/fetch/Alorel?to=foo')
    .expect(StatusCode.BAD_REQUEST, `to must be a string matching the regex ${/^\d{4}-\d{2}-\d{2}$/}`)
    .expect('Access-Control-Allow-Origin', '*')
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});

test('To not string', t => {
  return request(app)
    .get('/fetch/Alorel?to=2017-01-01&to=2017-01-02')
    .expect(StatusCode.BAD_REQUEST, `to must be a string matching the regex ${/^\d{4}-\d{2}-\d{2}$/}`)
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});

test('Invalid name', t => {
  return request(app)
    .get(`/fetch/${Math.random()}`)
    .expect(StatusCode.SERVER_ERROR)
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});

test('Valid name', t => {
  return request(app)
    .get('/fetch/Alorel')
    .expect(StatusCode.OK)
    .expect('Content-type', /json/)
    .expect('X-cached', /^\d$/)
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});
