import React, { useContext } from 'react';

import { BeerOrLiquorBrand } from '@stan/ddm-types';
import { LoggedInStatusContext } from '../../App';
import { beerOrLiquorTypeIconMap } from '../../utils/beer-liquor-type-icon-map';
import styles from './BeersAndLiquors.module.scss';
import { useFetchFromApi } from '../../utils/fetch-from-api';

export default function BeersAndLiquors() {
    const response = useFetchFromApi<BeerOrLiquorBrand[]>(`/beers-and-liquors`);
    if (!response?.data) {
        return null;
    }
    return (
        <React.Fragment>
            <div className={styles.list}>
                {response.data.map((beerOrLiquor) => (
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
    const { loggedIn } = useContext(LoggedInStatusContext);
    // const [menuOpen, setMenuOpen] = useState(false);
    return (
        <div className={styles.listItem}>
            <div className={styles.listItemInfo}>
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
            {loggedIn && (
                <div className={styles.listItemActions}>
                    <button>
                        <i className='fas fa-ellipsis-v' />
                    </button>
                </div>
            )}
        </div>
    );
}
