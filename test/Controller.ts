delete process.env.ALLOWED_ORIGINS;
delete process.env.ALLOWED_USERS;

import test from 'ava';
import * as request from 'supertest';
import {app} from '../src/app';
import * as _ from 'lodash';

test.before("Set worker ID", () => {
  app.set('workerID', 'foo');
});

test("Ping", t => {
  return request(app)
    .get('/ping')
    .expect(200, 'pong')
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});

const stdHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'X-Frame-Options': 'deny',
  'X-Powered-By': "Trump's tiny cocktail sausage fingers",
  'X-serviced-By': 'foo'
};

_.forEach(stdHeaders, (v: string, k: string) => {
  test(`Sets the ${k} header`, t => {
    return request(app)
      .get('/ping')
      .expect(200)
      .expect(k, v)
      .then(() => t.pass())
      .catch((e: Error) => t.fail(e.message));
  });
});

test("Redirect", t => {
  return request(app)
    .get("/")
    .expect(302)
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});

test("To invalid regex", t => {
  return request(app)
    .get("/fetch/Alorel?to=foo")
    .expect(400, `to must be a string matching the regex ${/^\d{4}-\d{2}-\d{2}$/}`)
    .expect('Access-Control-Allow-Origin', '*')
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});

test("To not string", t => {
  return request(app)
    .get("/fetch/Alorel?to=2017-01-01&to=2017-01-02")
    .expect(400, `to must be a string matching the regex ${/^\d{4}-\d{2}-\d{2}$/}`)
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});

test("Invalid name", t => {
  return request(app)
    .get(`/fetch/${Math.random()}`)
    .expect(500)
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});

test("Valid name", t => {
  return request(app)
    .get('/fetch/Alorel')
    .expect(200)
    .expect('Content-type', /json/)
    .expect('X-cached', /^\d$/)
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});