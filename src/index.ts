import { Parser } from './parser/parser';
import { swift2fixtureConverter }  from './swift2fixture';

export function swift2fixture(file: string): string {
    const parser = new Parser(file);
    parser.parseFile();
    return swift2fixtureConverter.convert(parser.structList, parser.enumList);
}
