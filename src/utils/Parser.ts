import {IG, IMonth, IParsedPayload, IRect} from '@ng-github-contrib-calendar/common-types';
import * as $ from 'cheerio';
import {LazyGetter} from 'typescript-lazy-get-decorator';
import {FILL_MAP} from '../Fill';
import {Numerics} from './Numerics';

export class Parser implements IParsedPayload {

  public constructor(private readonly html: string) {

  }

  @LazyGetter()
  public get gs$(): Cheerio {
    return this.svg$.find('>g>g');
  }

  @LazyGetter()
  public get gs(): IG[] {
    const igs: IG[] = [];

    this.gs$.each(function(this: any) {
      const ig: IG = [];

      $(this).find('.day').each((i, el) => {
        const rect: IRect = {
          count: parseInt(el.attribs['data-count'].trim(), Numerics.RADIX),
          date: el.attribs['data-date'].trim(),
          fill: FILL_MAP[el.attribs.fill.trim()]
        };

        ig.push(rect);
      });

      igs.push(ig);
    });

    return igs;
  }

  @LazyGetter()
  public get months$(): Cheerio {
    return this.svg$.find('>g>.month');
  }

  @LazyGetter()
  public get months(): IMonth[] {
    const out: IMonth[] = [];

    this.months$.each(function(this: any, index, element) {
      const month: IMonth = {
        txt: $(this).text().trim(),
        x: parseInt(element.attribs.x, Numerics.RADIX)
      };

      out.push(month);
    });

    return out;
  }

  @LazyGetter()
  public get svg$(): Cheerio {
    return $.load(this.html).root().find('svg').first();
  }

  public toJSON(): IParsedPayload {
    return {
      gs: this.gs,
      months: this.months
    };
  }
}
