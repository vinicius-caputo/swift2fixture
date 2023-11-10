import { lexemes } from './lexemes';
import { SyntaxTree, Enum, EnumCase, EnumCaseParameter, Property, Struct } from '../types';

export class Parser {
    private lines: string[];
    private sytaxTree: SyntaxTree;

    constructor(file: string) {
        file = this.cleanUnnecessaryStructures(file)
        this.lines = file.split("\n");
        this.sytaxTree = { 
            structs: [],
            enums: []
        };
    }

    private cleanUnnecessaryStructures(file: string): string {
        file = file.replaceAll(lexemes.init, "");
        file = file.replaceAll(lexemes.function, "");
        file = file.replaceAll(lexemes.switch, "");
        return file;
    }

    public parseFile(): SyntaxTree {
        while (this.lines.length > 0) {
            let line = this.lines.shift() ?? "";
            const structMatch = line.match(lexemes.struct);
            if (structMatch) { 
                this.sytaxTree.structs.push(this.parseStruct(structMatch[2]));
            } 
            const enumMatch = line.match(lexemes.enum);
            if (enumMatch) {
                this.sytaxTree.enums.push(this.parseEnum(enumMatch[1]));
            }
        }
        return this.sytaxTree;       
    }

    private parseStruct(fatherName: string): Struct {
        let struct: Struct = {
            fullName: fatherName,
            property: [],
            subStructs: [],
            enums: []
        };
        while (this.lines.length > 0) {
            let line = this.lines.shift() ?? "";
            const structMatch = line.match(lexemes.struct);
            const enumMatch = line.match(lexemes.enum);
            if (structMatch) { 
                struct.subStructs.push(this.parseStruct(fatherName + "." + structMatch[2]));
            } 
            else if (line.match(lexemes.variable)) {
                struct.property = struct.property.concat(this.parseProperty(line));
            }
            else if (enumMatch) {
                struct.enums.push(this.parseEnum(fatherName + "." + enumMatch[1]));
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

    private parseEnum(fatherName: string): Enum {
        let enumStruct: Enum = {
            name: fatherName,
            cases: []
        };
        while (this.lines.length > 0) {
            let line = this.lines.shift() ?? "";
            const enumCaseMatch = line.match(lexemes.enumCase);
            if (enumCaseMatch) {
                enumStruct.cases.push(this.parseEnumCase(line));
            }
            else if (line.match(lexemes.endBracket)) {
                return enumStruct;
            }
        }
        return enumStruct;
    }

    private parseEnumCase(line: string): EnumCase {
        let enumCase: EnumCase = {
            name: "",
            parameters: []
        };
        const match = line.match(lexemes.enumCase);
        if (match === null) return enumCase;
        enumCase.name = match[1];
        if (match[3]) {
            enumCase.parameters = this.parseEnumCaseParameters(match[3]);
        }
        return enumCase;
    }

    private parseEnumCaseParameters(parametersDeclaration: string): EnumCaseParameter[] {
        let enumCaseParameters: EnumCaseParameter[] = [];
        let parameters = parametersDeclaration.split(",");
        for (const i in parameters) {
            parameters[i] = parameters[i].replaceAll(" ", "");
            const parameterSplit = parameters[i].split(":");
            if (parameterSplit.length === 1) {
                enumCaseParameters.push({
                    name: undefined,
                    type: parameterSplit[0] + i
                });
            }
            else {
                enumCaseParameters.push({
                    name: parameterSplit[0],
                    type: parameterSplit[1]
                });
            }
        }
        return enumCaseParameters;
    }

    get structList(): Struct[] {
        return this.getStructList(this.sytaxTree.structs);
    }

    get enumList(): Enum[] {
        let enums = this.sytaxTree.enums.concat(this.getEnumInsideStructs(this.sytaxTree.structs))
        return enums;
    }

    private getStructList(structs: Struct[]): Struct[] {
        let structsList: Struct[] = [];
        for (const struct of structs) {
            structsList.push(struct);
            structsList = structsList.concat(this.getStructList(struct.subStructs));
        }
        return structsList;
    }

    private getEnumInsideStructs(structs: Struct[]): Enum[] {
        let enums: Enum[] = [];
        for (const struct of structs) {
            enums = enums.concat(struct.enums);
            enums = enums.concat(this.getEnumInsideStructs(struct.subStructs));
        }
        return enums;
    }
}