import { Struct } from "./types";

export class swiftModel2Equatable {
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
        equatable.push(`    static func == (lhs: ${struct.fullName}, rhs: ${struct.fullName}) -> Bool {`);
        equatable.push(`        return `);
        let properties: string[] = [];
        for (const property of struct.property) {
            properties.push(`lhs.${property.name} == rhs.${property.name}`);
        }
        equatable.push(`            ${properties.join("\n            && ")}`);
        equatable.push(`    }`);
        equatable.push(`}`);
        return equatable.join("\n");
    }
}