delete process.env.REDISCLOUD_URL;

import test from 'ava';
import {Cache} from '../src/utils/Cache';

test('getItem', async t => {
  t.is(await Cache.getItem('x'), null);
});

test('setItem', async t => {
  t.is(await Cache.setItem(<any>null, 'x'), undefined); // tslint:disable-line:no-void-expression
});
