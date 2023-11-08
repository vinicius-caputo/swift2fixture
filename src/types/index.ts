export interface Struct {
    fullName: string;
    property: Property[];
    subStructs: Struct[];
}

export interface Property {
    name: string;
    type: string;
}
