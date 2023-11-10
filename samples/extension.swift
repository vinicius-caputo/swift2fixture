extension Type: Codable {
    enum Test: String, Codable {
        case name(name: String, age: Int)
        case surname(surname: String)
        case dogName(dogName: String)
    }
}