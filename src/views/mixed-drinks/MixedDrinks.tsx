import React, { useMemo, useState } from 'react';

import Loader from '../../components/loader/Loader';
import { MixedDrinkRecipeWithIngredients } from '@dgoudie/ddm-types';
import { displayErrorToast } from '../../utils/toast';
import styles from './MixedDrinks.module.scss';
import { useDebouncedEffect } from '../../utils/use-debounced-effect';
import { useFetchFromApi } from '../../utils/fetch-from-api';

export default function MixedDrinks() {
    const [onlyInStock, setOnlyInStock] = useState(true);
    const [filterText, setFilterText] = useState('');
    const [debouncedfilterText, setDebouncedFilterText] = useState(filterText);

    useDebouncedEffect(() => setDebouncedFilterText(filterText), 300, [
        filterText,
    ]);

    const params = useMemo(
        () => ({ onlyInStock, filter: debouncedfilterText }),
        [onlyInStock, debouncedfilterText]
    );

    const [response, error] = useFetchFromApi<
        MixedDrinkRecipeWithIngredients[]
    >(`/mixed-drinks`, params);

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
                    {response.data.map((mixedDrink) => (
                        <MixedDrink
                            key={mixedDrink._id}
                            mixedDrink={mixedDrink}
                        />
                    ))}
                </div>
            ) : (
                <Loader className={styles.loader} />
            )}
        </React.Fragment>
    );
}

function MixedDrink({
    mixedDrink,
}: {
    mixedDrink: MixedDrinkRecipeWithIngredients;
}) {
    return (
        <div className={styles.listItem}>
            <div className={styles.listItemNameAndIcon}>
                <span>{mixedDrink.name}</span>
            </div>
            <div className={styles.ingredients}>
                <h4>Ingredients:</h4>
                <ul>
                    {mixedDrink.requiredBeersOrLiquors.map((ingredient) => (
                        <li key={ingredient._id}>
                            {ingredient.name} -{' '}
                            {ingredient.inStock ? 'In Stock' : 'Out of Stock'}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
