import { lexemes } from './lexemes';
import { Property, Struct } from '../types';

export class Parser {
    private lines: string[];
    private sytaxTree: Struct[] = [];

    constructor(file: string) {
       this.lines = file.split("\n");
    }

    public parseFile(): Struct[] {
        while (this.lines.length > 0) {
            let line = this.lines.shift() ?? "";
            const structMatch = line.match(lexemes.struct);
            if (structMatch) { 
                this.sytaxTree.push(this.parseStruct(structMatch[1]));
            } 
        }
        return this.sytaxTree;       
    }

    private parseStruct(fatherName: string): Struct {
        let struct: Struct = {
            fullName: fatherName,
            property: [],
            subStructs: [],
        };
        while (this.lines.length > 0) {
            let line = this.lines.shift() ?? "";
            const structMatch = line.match(lexemes.struct);
            if (structMatch) { 
                struct.subStructs.push(this.parseStruct(fatherName + "." + structMatch[1]));
            } 
            else if (line.match(lexemes.variable)) {
                struct.property = struct.property.concat(this.parseProperty(line));
            }
            else if (line.match(lexemes.endBracket)) {
                return struct;
            }
        }
        return struct
    }

    private parseProperty(line: string): Property[] {
        let properties: Property[] = [];
        const match = line.match(lexemes.variable);
        if (match === null) return properties; 
        const identifiers = match[2].matchAll(lexemes.identifier); 
        const type = match[3];
        for (const identifier of identifiers) {
            properties.push({
                name: identifier[0],
                type: type
            });
        }
        return properties;
    }

    get structList(): Struct[] {
        return this.getStructList(this.sytaxTree);
    }

    private getStructList(structs: Struct[]) {
        let structsList: Struct[] = [];
        for (const struct of structs) {
            structsList.push(struct);
            structsList = structsList.concat(this.getStructList(struct.subStructs));
        }
        return structsList;
    }

    private debug(rootStructs: Struct[]) {
        for (const struct of rootStructs) {
            console.log(struct);
            this.debug(struct.subStructs);
        }
    }
}