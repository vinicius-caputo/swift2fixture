enum CompassPoint {
    case north
    case south
    case east
    case west
}

enum Barcode {
    case upc(Int, Int, Int, Int)
    case qrCode(String)
}

enum Barcode2 {
    case upc2(id: Int, id2: Int, id3: Int, id4: Int)
    case qrCode2(qrCode: String)
}