struct Person: String {
    let firstName, lastName: String
    var age: Int

    struct Cats: String {
        let cat: CustomType
        var surname: String
        var age: Int
   
        struct Paw {
            let Paw: String
        }
    }

    struct Cats2 {
        let cat2: String
        var surname2: String
        var age2: Int
    }
}

struct Dogs {
    let name: String
    var surname: String
    var age: Int
}
