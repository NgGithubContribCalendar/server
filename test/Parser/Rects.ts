import test from 'ava';
import {Parser} from "../../src/utils/Parser";
import {loadFixture} from "./_parser-test-utils";

let parser: Parser;

test.before(async () => {
  parser = new Parser(await loadFixture());
});

test("Lengths match", t => {
  t.is(parser.gs$.length, parser.gs.length);
});

const expectRegex = /^\d{4}-\d{2}-\d{2}$/;
const allowFills = [0, 1, 2, 3, 4];

test("Rect validation", t => {
  parser.gs.forEach(g => {
    g.forEach(rect => {
      t.regex(rect.date, expectRegex, 'Regex');
      t.false(isNaN(rect.count), 'count is number');
      t.true(allowFills.includes(rect.fill));
    });
  });
});