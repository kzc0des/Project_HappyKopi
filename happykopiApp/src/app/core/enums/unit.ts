export enum Unit {
    MILLILITER = 'ml',
    LITER = 'l',

    GRAM = 'g',
    KILOGRAM = 'kg',

    PIECE = 'pc',
    PACK = 'pack'
}

export const UnitGrouping = {
    Liquid: [Unit.MILLILITER, Unit.LITER],
    Powder: [Unit.GRAM, Unit.KILOGRAM],
    Miscellaneous: [Unit.PIECE, Unit.PACK]
}
