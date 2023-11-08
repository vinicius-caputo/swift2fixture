
import * as fs from 'fs';
import { Parser } from './parser/parser';
import { swiftModel2Equatable } from './swiftModel2equatable';

const inputFile = 'samples/person.swift';
const file = fs.readFileSync(inputFile, 'utf8');

const parser = new Parser(file);
let structs =  parser.parseFile();

console.log(swiftModel2Equatable.convert(structs));


