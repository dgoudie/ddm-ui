import React, { useContext, useMemo, useState } from 'react';

import { Link } from 'react-router-dom';
import Loader from '../../components/loader/Loader';
import { LoggedInStatusContext } from '../../App';
import { MixedDrinkRecipeWithIngredients } from '@dgoudie/ddm-types';
import classNames from 'classnames';
import { displayErrorToast } from '../../utils/toast';
import styles from './MixedDrinks.module.scss';
import { useDebouncedEffect } from '../../utils/use-debounced-effect';
import { useFetchFromApi } from '../../utils/fetch-from-api';

export default function MixedDrinks() {
    const [onlyInStock, setOnlyInStock] = useState(true);
    const [filterText, setFilterText] = useState('');
    const [debouncedfilterText, setDebouncedFilterText] = useState(filterText);

    const { loggedIn } = useContext(LoggedInStatusContext);

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
                    id='only-in-stock'
                    type='checkbox'
                    checked={onlyInStock}
                    onChange={(event) => setOnlyInStock(event.target.checked)}
                />
                <label htmlFor='only-in-stock'>Only Show In-Stock</label>
            </div>
            {!!response?.data ? (
                <React.Fragment>
                    <div className={styles.list}>
                        {response.data.map((mixedDrink) => (
                            <MixedDrink
                                key={mixedDrink._id}
                                mixedDrink={mixedDrink}
                            />
                        ))}
                    </div>
                    {loggedIn && (
                        <div className={styles.newMixedDrinkButton}>
                            <Link
                                className={'standard-button'}
                                to='/mixed-drink'
                            >
                                <i className='fas fa-cocktail'></i>
                                New Mixed Drink
                            </Link>
                        </div>
                    )}
                </React.Fragment>
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
    const [recipeVisible, setRecipeVisible] = useState(false);
    const { loggedIn } = useContext(LoggedInStatusContext);
    return (
        <React.Fragment>
            <button
                onClick={() => setRecipeVisible(!recipeVisible)}
                className={styles.listItem}
            >
                <div className={styles.listItemName}>
                    <span className={styles.listItemNameTitle}>
                        {mixedDrink.name}
                    </span>
                    <span> - </span>
                    <span>${mixedDrink.price.toFixed(2)}</span>
                </div>
                <div className={styles.ingredients}>
                    {mixedDrink.requiredBeersOrLiquors.map(
                        (ingredient, index) => (
                            <React.Fragment key={ingredient._id}>
                                <span
                                    className={classNames(
                                        !ingredient.inStock &&
                                            styles.ingredientsOutOfStock
                                    )}
                                >
                                    {ingredient.name}
                                </span>
                                {index <
                                    mixedDrink.requiredBeersOrLiquors.length -
                                        1 && <span>, </span>}
                            </React.Fragment>
                        )
                    )}
                </div>
                <div className={styles.recipeTip}>Click for recipe</div>
            </button>
            {recipeVisible && (
                <div className={styles.recipe}>
                    <span className={styles.recipeHeader}>Recipe:</span>
                    {mixedDrink.requiredBeersOrLiquors.map((ingredient) => (
                        <React.Fragment key={ingredient._id}>
                            <span>{ingredient.count}</span>
                            <span> ✖ </span>
                            <span>{ingredient.name}</span>
                        </React.Fragment>
                    ))}
                    {mixedDrink.additionalNotes && (
                        <React.Fragment>
                            <span className={styles.recipeHeader}>
                                Additional Notes:
                            </span>
                            <pre className={styles.recipeAdditionalNotes}>
                                {mixedDrink.additionalNotes}
                            </pre>
                        </React.Fragment>
                    )}
                    {loggedIn && (
                        <div className={styles.recipeActions}>
                            <Link
                                to={`/mixed-drink?_id=${mixedDrink._id}`}
                                className='standard-button'
                            >
                                <i className='fas fa-edit'></i>
                                Edit
                            </Link>
                            <button
                                className={classNames(
                                    'standard-button',
                                    styles.recipeActionsDelete
                                )}
                            >
                                <i className='fas fa-trash'></i>
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            )}
        </React.Fragment>
    );
}
