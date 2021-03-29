import { BeerOrLiquorBrand } from '@stan/ddm-types';
import { Link } from 'react-router-dom';
import React from 'react';
import { beerOrLiquorTypeIconMap } from '../../utils/beer-liquor-type-icon-map';
import styles from './BeersAndLiquors.module.scss';
import { useFetchFromApi } from '../../utils/fetch-from-api';

export default function BeersAndLiquors() {
    const { response, error } = useFetchFromApi<BeerOrLiquorBrand[]>(
        `/beers-and-liquors`
    );
    if (!!error) {
        return null;
    }
    return (
        <React.Fragment>
            <header className={styles.header}>
                <span>
                    <Link to='/'>Home</Link>
                    <i className='fas fa-chevron-right' />
                    Beers & Liquors
                </span>
            </header>
            <div className={styles.list}>
                {response?.map((beerOrLiquor) => (
                    <BeerOrLiquor
                        key={beerOrLiquor._id}
                        beerOrLiquor={beerOrLiquor}
                    />
                ))}
            </div>
        </React.Fragment>
    );
}

function BeerOrLiquor({ beerOrLiquor }: { beerOrLiquor: BeerOrLiquorBrand }) {
    return (
        <div className={styles.listItem}>
            <div className={styles.listItemNameAndIcon}>
                <i
                    className={`fas fa-${beerOrLiquorTypeIconMap.get(
                        beerOrLiquor.type
                    )}`}
                />
                <span>{beerOrLiquor.name}</span>
            </div>
            <div className={styles.listItemStatus}>
                {beerOrLiquor.inStock ? '✅ In Stock' : '❌ Out of Stock'}
            </div>
        </div>
    );
}
