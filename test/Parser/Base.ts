import test from 'ava';
import {Parser} from '../../src/utils/Parser';
import {loadFixture} from './_parser-test-utils';

let parser: Parser;

test.before(async() => {
  parser = new Parser(await loadFixture());
});

test('Root element is SVG', t => {
  t.true(parser.svg$.is('svg'));
});

test('Finds months', t => {
  t.is(parser.months$.length, 13); // tslint:disable-line:no-magic-numbers
});

test('Finds Gs', t => {
  t.is(parser.gs$.length, 53); // tslint:disable-line:no-magic-numbers
});

test('JSON.stringify', t => {
  const expect = JSON.stringify({
    gs: parser.gs,
    months: parser.months
  });

  const actual = JSON.stringify(parser);

  t.is(actual, expect);
});
