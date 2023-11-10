
/**
 * Represents the syntax tree of a Swift file.
 * where structs and enums are in the tree order.
 */
export interface SyntaxTree {
    structs: Struct[];
    enums: Enum[];
}

export interface Struct {
    fullName: string;
    property: Property[];
    subStructs: Struct[];
    enums: Enum[];
}

export interface Property {
    name: string;
    type: string;
}

export interface Enum {
    name: string;
    cases: EnumCase[];
}

export interface EnumCase {
    name: string;
    parameters: EnumCaseParameter[];
}

export interface EnumCaseParameter {
    name: string | undefined;
    type: string;
}