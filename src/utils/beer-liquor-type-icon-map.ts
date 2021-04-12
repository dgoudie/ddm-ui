import { BeerOrLiquorBrandType } from '@dgoudie/ddm-types';

export const beerOrLiquorTypeIconMap = new Map<BeerOrLiquorBrandType, string>([
    ['VODKA', 'cocktail'],
    ['LIQUEUR', ''],
    ['RUM', 'wine-bottle'],
    ['TEQUILA', 'glass-martini-alt'],
    ['WHISKEY', 'glass-whiskey'],
    ['GIN', 'wine-bottle'],
    ['BEER', 'beer'],
    ['SELTZER', 'ruler-vertical'],
    ['DRINK_MIX', 'blender'],
    ['WINE', 'wine-glass-alt'],
    ['CIDER', 'wine-bottle'],
    ['OTHER', 'cocktail'],
]);
