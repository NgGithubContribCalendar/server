import test from 'ava';
import {Parser} from "../../src/Parser";
import {loadFixture} from "./_parser-test-utils";
import {IMonth} from "@ng-github-contrib-calendar/common-types";

let parser: Parser;

test.before(async () => {
  parser = new Parser(await loadFixture());
});

const combos: IMonth[] = [
  {x: 13, txt: 'Oct'},
  {x: 49, txt: 'Nov'},
  {x: 97, txt: 'Dec'},
  {x: 145, txt: 'Jan'},
  {x: 205, txt: 'Feb'},
  {x: 253, txt: 'Mar'},
  {x: 301, txt: 'Apr'},
  {x: 361, txt: 'May'},
  {x: 409, txt: 'Jun'},
  {x: 457, txt: 'Jul'},
  {x: 517, txt: 'Aug'},
  {x: 565, txt: 'Sep'},
  {x: 613, txt: 'Oct'}
];

for (let i = 0; i < combos.length; i++) {
  test(JSON.stringify(combos[i]), t => {
    t.deepEqual(combos[i], parser.months[i]);
  });
}

test("Lengths match", t => {
  t.is(parser.months.length, parser.months$.length);
});