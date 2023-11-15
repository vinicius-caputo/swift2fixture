import { Struct, Enum, EnumCase, EnumCaseParameter } from "./types";

export class swift2fixtureConverter {
    private static enums: Enum[] = [];

    public static convert(structs: Struct[], enums: Enum[]): string {
        this.enums = enums;
        let fixtures: string[] = [];
        for (const struct of structs) {
            if (struct.property.length == 0) continue;
            fixtures.push(this.convertStruct(struct));
        }

        return fixtures.join("\n\n");
    }

    private static convertStruct(struct: Struct): string {
        let fixtures: string[] = [];
        fixtures.push(`extension ${struct.fullName} {`);
        let properties: string[] = [];
        for (const property of struct.property) {
            properties.push(`${property.name}: ${property.type} = ${this.convertTypeToDefaultValue(property.type)}`);
        }
        fixtures.push(`\tstatic func fixture(${properties.join(",\n\t\t\t")}) -> ${struct.fullName} {\n`);
        properties = [];
        for (const property of struct.property) {
            properties.push(`${property.name}: ${property.name}`);
        }
        fixtures.push(`\t\treturn .init(${properties.join(",\n\t\t\t")})`);
        fixtures.push(`\t}`);
        fixtures.push(`}`);
        return fixtures.join("\n");
    }

    private static convertTypeToDefaultValue(type: string): string {
        let defaultValues: { [key: string]: string } = {
            "String": "\"\"",
            "Int": "0",
            "Double": "0.0",
            "Float": "0.0",
            "Bool": "false",
            "Date": "Date()",
            "Data": "Data()",
            "URL": "URL(string: \"\")!",
            "UUID": "UUID()",
            "Decimal": "Decimal()",
        }
        let enumType = this.enums.find(e => e.name == type);
        if (type.includes("?")) {
            return "nil";
        } else if (enumType) {
            return `.${enumType.cases[0].name}`
        }
        else if (type.includes("[") && type.includes("]")) {
            return "[]";
        }
         else {
            return defaultValues[type] ?? ".fixture()";
        }
    }
}