import * as $ from 'cheerio';
import {LazyGetter} from "typescript-lazy-get-decorator";
import {IMonth} from "./entities/IMonth";
import {IG} from "./entities/IG";
import {IRect} from "./entities/IRect";
import {FillMap} from "./entities/Fill";
import {IParsedPayload} from "./entities/IParsedPayload";

export class Parser implements IParsedPayload {

  constructor(private readonly html: string) {

  }

  @LazyGetter()
  get gs$(): Cheerio {
    return this.svg$.find('>g>g');
  }

  @LazyGetter()
  get gs(): IG[] {
    const igs: IG[] = [];

    this.gs$.each(function (this: any, index, element) {
      const ig: IG = [];

      $(this).find('.day').each((index, element) => {
        const rect: IRect = {
          count: parseInt(element.attribs['data-count'].trim()),
          date: element.attribs['data-date'].trim(),
          fill: FillMap[element.attribs.fill.trim()]
        };

        ig.push(rect);
      });

      igs.push(ig);
    });

    return igs;
  }

  @LazyGetter()
  get months$(): Cheerio {
    return this.svg$.find('>g>.month');
  }

  @LazyGetter()
  get months(): IMonth[] {
    const out: IMonth[] = [];

    this.months$.each(function (this: any, index, element) {
      const month: IMonth = {
        x: parseInt(element.attribs.x),
        txt: $(this).text().trim()
      };

      out.push(month);
    });

    return out;
  }

  @LazyGetter()
  get svg$(): Cheerio {
    return $.load(this.html).root().find('svg').first();
  }

  toJSON(): IParsedPayload {
    return {
      months: this.months,
      gs: this.gs
    };
  }
}