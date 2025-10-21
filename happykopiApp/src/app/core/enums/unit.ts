export enum Unit {
    MILLILITER = 'milliliter',
    LITER = 'liter',

    GRAM = 'gram',
    KILOGRAM = 'kilogram',

    PIECE = 'piece',
    PACK = 'pack'
}

export const UnitGrouping = {
    Liquid: [Unit.MILLILITER, Unit.LITER],
    Powder: [Unit.GRAM, Unit.KILOGRAM],
    Miscellaneous: [Unit.PIECE, Unit.PACK]
}
