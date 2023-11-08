import { Struct } from "./types";

export class swift2equatableConverter {
    public static convert(structs: Struct[]): string {
        let equatables: string[] = [];
        for (const struct of structs) {
            equatables.push(this.convertStruct(struct));
        }
        return equatables.join("\n\n");
    }

    private static convertStruct(struct: Struct): string {
        let equatable: string[] = [];
        equatable.push(`extension ${struct.fullName}: Equatable {`);
        equatable.push(`\tstatic func == (lhs: ${struct.fullName}, rhs: ${struct.fullName}) -> Bool {`);
        let properties: string[] = [];
        for (const property of struct.property) {
            properties.push(`lhs.${property.name} == rhs.${property.name}`);
        }
        properties[0] = `\t\treturn ${properties[0]}`;
        equatable.push(`${properties.join("\n\t\t&& ")}`);
        equatable.push(`\t}`);
        equatable.push(`}`);
        return equatable.join("\n");
    }
}