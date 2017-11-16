import test from 'ava';
import {fetchHTML} from '../src/utils/Fetcher';
import {Parser} from '../src/utils/Parser';

interface Prs {
  date: Parser;
  noDate: Parser;
}

let parsers: Prs;

test.before('Fetch data', async() => {
  const noDate = fetchHTML('Alorel');
  const date = fetchHTML('Alorel', '2017-01-01');

  parsers = {
    date: new Parser(await date),
    noDate: new Parser(await noDate)
  };
});

test('Invalid username', t => {
  return fetchHTML(Math.random().toString())
    .then(r => {
      console.log(r);
      t.fail();
    })
    .catch(() => t.pass());
});

['date', 'noDate'].forEach((type: string) => {
  test(`Parser ${type}: Root element is SVG`, t => {
    t.true(parsers[type].svg$.is('svg'));
  });

  test(`Parser ${type}: Finds months`, t => {
    t.truthy(parsers[type].months$.length);
  });

  test(`Parser ${type}: Finds Gs`, t => {
    t.truthy(parsers[type].gs$.length);
  });

  test(`Parser ${type}: JSON.stringify`, t => {
    const expect = JSON.stringify({
      gs: parsers[type].gs,
      months: parsers[type].months
    });

    const actual = JSON.stringify(parsers[type]);

    t.is(actual, expect);
  });
});

test('Parser contents differ', t => {
  const p1 = JSON.stringify(parsers.date);
  const p2 = JSON.stringify(parsers.noDate);

  t.false(p1 === p2);
});
