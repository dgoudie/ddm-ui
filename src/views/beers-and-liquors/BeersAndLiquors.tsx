import React, { useContext, useMemo, useState } from 'react';
import {
    deleteBeerOrLiquor,
    markBeerOrLiquorInStock,
    useFetchFromApi,
} from '../../utils/fetch-from-api';

import { BeerOrLiquorBrand } from '@dgoudie/ddm-types';
import Dialog from '../../components/dialog/Dialog';
import { Link } from 'react-router-dom';
import Loader from '../../components/loader/Loader';
import { LoggedInStatusContext } from '../../App';
import { beerOrLiquorTypeIconMap } from '../../utils/beer-liquor-type-icon-map';
import { displayErrorToast } from '../../utils/toast';
import styles from './BeersAndLiquors.module.scss';
import toast from 'react-hot-toast';
import { useDebouncedEffect } from '../../utils/use-debounced-effect';

export default function BeersAndLiquors() {
    const [showOnly, setShowOnly] = useState({
        inStock: false,
        outOfStock: false,
    });

    const [filterText, setFilterText] = useState('');
    const [debouncedfilterText, setDebouncedFilterText] = useState(filterText);

    const { loggedIn } = useContext(LoggedInStatusContext);

    useDebouncedEffect(() => setDebouncedFilterText(filterText), 300, [
        filterText,
    ]);

    const params = useMemo(
        () => ({
            onlyInStock: showOnly.inStock,
            onlyOutOfStock: showOnly.outOfStock,
            filter: debouncedfilterText,
        }),
        [showOnly.inStock, showOnly.outOfStock, debouncedfilterText]
    );

    const [response, error] = useFetchFromApi<BeerOrLiquorBrand[]>(
        `/beers-and-liquors`,
        params,
        {},
        false,
        true
    );
    const [
        selectedBeerOrLiquor,
        setSelectedBeerOrLiquor,
    ] = useState<BeerOrLiquorBrand | null>(null);

    const itemUpdated = () => {
        setSelectedBeerOrLiquor(null);
    };

    if (!!error) {
        displayErrorToast(error.response?.data ?? error);
    }
    return (
        <React.Fragment>
            <div className={styles.filters}>
                <input
                    autoCorrect='off'
                    autoCapitalize='none'
                    type='search'
                    onChange={(event) => setFilterText(event.target.value)}
                    placeholder='Search...'
                />
                <input
                    className={styles.first}
                    id='only-in-stock'
                    type='checkbox'
                    checked={showOnly.inStock}
                    onChange={(event) => {
                        setShowOnly({
                            inStock: event.target.checked,
                            outOfStock: false,
                        });
                    }}
                />
                <label htmlFor='only-in-stock'>Only Show In-Stock</label>
                {loggedIn && (
                    <React.Fragment>
                        <input
                            id='only-out-of-stock'
                            type='checkbox'
                            checked={showOnly.outOfStock}
                            onChange={(event) => {
                                setShowOnly({
                                    outOfStock: event.target.checked,
                                    inStock: false,
                                });
                            }}
                        />
                        <label htmlFor='only-out-of-stock'>
                            Only Show Out-Of-Stock
                        </label>
                    </React.Fragment>
                )}
            </div>
            {!!response?.data ? (
                <React.Fragment>
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
                    {loggedIn && (
                        <div className={styles.newBeerOrLiquorButton}>
                            <Link
                                className={'standard-button'}
                                to='/beer-or-liquor'
                            >
                                <i className='fas fa-beer'></i>
                                New Beer / Liquor
                            </Link>
                        </div>
                    )}
                </React.Fragment>
            ) : (
                <Loader className={styles.loader} />
            )}
            {!!selectedBeerOrLiquor && (
                <BeerOrLiquorActions
                    beerOrLiquor={selectedBeerOrLiquor}
                    onClosed={() => setSelectedBeerOrLiquor(null)}
                    updated={itemUpdated}
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
                    <span className={styles.listItemPrice}>
                        {' '}
                        —{' '}
                        {beerOrLiquor.price !== 0
                            ? `$${beerOrLiquor.price.toFixed(2)}`
                            : 'Free'}
                    </span>
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
    updated,
}: {
    beerOrLiquor: BeerOrLiquorBrand;
    onClosed: () => void;
    updated: () => void;
}) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const markInStock = React.useCallback(() => {
        const fn = async () => {
            try {
                await markBeerOrLiquorInStock(
                    beerOrLiquor._id,
                    !beerOrLiquor.inStock
                );
                updated();
            } catch (e) {
                displayErrorToast(e);
            }
        };
        fn();
    }, [beerOrLiquor._id, beerOrLiquor.inStock, updated]);

    const deleteRecord = React.useCallback(() => {
        const fn = async () => {
            try {
                await deleteBeerOrLiquor(beerOrLiquor._id);
                toast.success('Item deleted successfully.');
                updated();
            } catch (e) {
                displayErrorToast(e);
            }
        };
        fn();
    }, [beerOrLiquor._id, updated]);

    return (
        <Dialog headerText={beerOrLiquor.name} onClosed={onClosed}>
            {!confirmDelete ? (
                <div className={styles.actions}>
                    {beerOrLiquor.inStock ? (
                        <button className={styles.red} onClick={markInStock}>
                            <i className='fas fa-times' />
                            Mark as Out-of-Stock
                        </button>
                    ) : (
                        <button className={styles.green} onClick={markInStock}>
                            <i className='fas fa-check' />
                            Mark as In-Stock
                        </button>
                    )}
                    <Link to={`/beer-or-liquor?id=${beerOrLiquor._id}`}>
                        <i className='fas fa-pen' />
                        Edit
                    </Link>
                    <button
                        className={styles.red}
                        onClick={() => setConfirmDelete(true)}
                    >
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
                        <button className={styles.red} onClick={deleteRecord}>
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
