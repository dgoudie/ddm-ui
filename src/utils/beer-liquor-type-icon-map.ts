import { BeerOrLiquorBrandType } from '@stan/ddm-types';

export const beerOrLiquorTypeIconMap = new Map<BeerOrLiquorBrandType, string>([
    ['BEER', 'beer'],
    ['WINE', 'wine-glass-alt'],
    ['CIDER', 'wine-bottle'],
    ['MEAD', 'wine-bottle'],
    ['SAKE', 'wine-bottle'],
    ['GIN', 'wine-bottle'],
    ['BRANDY', 'wine-bottle'],
    ['WHISKEY', 'glass-whiskey'],
    ['RUM', 'wine-bottle'],
    ['TEQUILA', 'glass-martini-alt'],
    ['VODKA', 'cocktail'],
    ['ABSINTHE', 'cocktail'],
    ['EVERCLEAR', 'cocktail'],
    ['OTHER', 'cocktail'],
]);
