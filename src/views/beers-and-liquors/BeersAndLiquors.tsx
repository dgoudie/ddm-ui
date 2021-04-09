import React, { useContext, useMemo, useState } from 'react';

import { BeerOrLiquorBrand } from '@dgoudie/ddm-types';
import Dialog from '../../components/dialog/Dialog';
import Loader from '../../components/loader/Loader';
import { LoggedInStatusContext } from '../../App';
import { beerOrLiquorTypeIconMap } from '../../utils/beer-liquor-type-icon-map';
import { displayErrorToast } from '../../utils/toast';
import styles from './BeersAndLiquors.module.scss';
import { useDebouncedEffect } from '../../utils/use-debounced-effect';
import { useFetchFromApi } from '../../utils/fetch-from-api';

export default function BeersAndLiquors() {
    const [onlyInStock, setOnlyInStock] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [debouncedfilterText, setDebouncedFilterText] = useState(filterText);

    useDebouncedEffect(() => setDebouncedFilterText(filterText), 300, [
        filterText,
    ]);

    const params = useMemo(
        () => ({ onlyInStock, filter: debouncedfilterText }),
        [onlyInStock, debouncedfilterText]
    );

    const [response, error] = useFetchFromApi<BeerOrLiquorBrand[]>(
        `/beers-and-liquors`,
        params
    );
    const [
        selectedBeerOrLiquor,
        setSelectedBeerOrLiquor,
    ] = useState<BeerOrLiquorBrand | null>(null);
    if (!!error) {
        displayErrorToast(error);
    }
    return (
        <React.Fragment>
            <div className={styles.filters}>
                <input
                    autoFocus
                    autoCorrect='off'
                    autoCapitalize='none'
                    type='search'
                    onChange={(event) => setFilterText(event.target.value)}
                    placeholder='Search...'
                />
                <input
                    id='only-in-stock'
                    type='checkbox'
                    checked={onlyInStock}
                    onChange={(event) => setOnlyInStock(event.target.checked)}
                />
                <label htmlFor='only-in-stock'>Only Show In-Stock</label>
            </div>
            {!!response?.data ? (
                <div className={styles.list}>
                    {response.data.map((beerOrLiquor) => (
                        <BeerOrLiquor
                            key={beerOrLiquor._id}
                            beerOrLiquor={beerOrLiquor}
                            onSelected={() =>
                                setSelectedBeerOrLiquor(beerOrLiquor)
                            }
                        />
                    ))}
                </div>
            ) : (
                <Loader className={styles.loader} />
            )}
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
        <Dialog headerText={beerOrLiquor.name} onClosed={onClosed}>
            {!confirmDelete ? (
                <div className={styles.actions}>
                    {beerOrLiquor.inStock ? (
                        <button>
                            <i className='fas fa-times' />
                            Mark as Out-of-Stock
                        </button>
                    ) : (
                        <button className={styles.markInStock}>
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
                <div className={styles.confirmDelete}>
                    <span>
                        Are you sure you'd like to delete {beerOrLiquor.name}?
                        This will also delete any mixed drinks where{' '}
                        {beerOrLiquor.name} is an ingredient.
                    </span>
                    <section>
                        <button
                            className={styles.confirmDeleteYes}
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
        </Dialog>
    );
}
