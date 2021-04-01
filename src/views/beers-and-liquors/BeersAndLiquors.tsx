import React, { useContext, useState } from 'react';

import { BeerOrLiquorBrand } from '@stan/ddm-types';
import { LoggedInStatusContext } from '../../App';
import { beerOrLiquorTypeIconMap } from '../../utils/beer-liquor-type-icon-map';
import styles from './BeersAndLiquors.module.scss';
import { useFetchFromApi } from '../../utils/fetch-from-api';

export default function BeersAndLiquors() {
    const response = useFetchFromApi<BeerOrLiquorBrand[]>(`/beers-and-liquors`);
    const [
        selectedBeerOrLiquor,
        setSelectedBeerOrLiquor,
    ] = useState<BeerOrLiquorBrand | null>(null);
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
                        onSelected={() => setSelectedBeerOrLiquor(beerOrLiquor)}
                    />
                ))}
            </div>
            {!!selectedBeerOrLiquor && (
                <BeerOrLiquorActions
                    beerOrLiquor={selectedBeerOrLiquor}
                    onClosed={() => setSelectedBeerOrLiquor(null)}
                />
            )}
        </React.Fragment>
    );
}

function BeerOrLiquor({
    beerOrLiquor,
    onSelected,
}: {
    beerOrLiquor: BeerOrLiquorBrand;
    onSelected: () => void;
}) {
    const { loggedIn } = useContext(LoggedInStatusContext);
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
                    <button
                        className={styles.listItemActionsButton}
                        onClick={onSelected}
                    >
                        <i className='fas fa-ellipsis-v' />
                    </button>
                </div>
            )}
        </div>
    );
}

function BeerOrLiquorActions({
    beerOrLiquor,
    onClosed,
}: {
    beerOrLiquor: BeerOrLiquorBrand;
    onClosed: () => void;
}) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    return (
        <div className={styles.dialog}>
            <div className={styles.dialogBackdrop} onClick={onClosed}></div>
            <div className={styles.dialogBody}>
                <header>
                    <h3>{beerOrLiquor.name}</h3>
                    <button onClick={onClosed}>
                        <i className='fas fa-times' />
                    </button>
                </header>
                {!confirmDelete ? (
                    <div className={styles.dialogBodyActions}>
                        {beerOrLiquor.inStock ? (
                            <button>
                                <i className='fas fa-times' />
                                Mark as Out-of-Stock
                            </button>
                        ) : (
                            <button>
                                <i className='fas fa-check' />
                                Mark as In-Stock
                            </button>
                        )}
                        <button onClick={() => setConfirmDelete(true)}>
                            <i className='fas fa-trash' />
                            Delete
                        </button>
                    </div>
                ) : (
                    <div className={styles.dialogBodyConfirmDelete}>
                        <span>
                            Are you sure you'd like to delete{' '}
                            {beerOrLiquor.name}? This will also delete any mixed
                            drinks where {beerOrLiquor.name} is an ingredient.
                        </span>
                        <section>
                            <button
                                className={styles.dialogBodyConfirmDeleteYes}
                                onClick={() => setConfirmDelete(true)}
                            >
                                Yes
                            </button>
                            <button onClick={() => setConfirmDelete(false)}>
                                No
                            </button>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
