import React, { useContext, useState } from 'react';

import { Link } from 'react-router-dom';
import { LoggedInStatusContext } from '../../App';
import { MixedDrinkRecipeWithIngredients } from '@dgoudie/ddm-types';
import classNames from 'classnames';
import styles from './MixedDrinkListItem.module.scss';

export function MixedDrinkListItem({
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
                    <span className={styles.listItemNameDash}> — </span>
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
                                to={`/mixed-drink?id=${mixedDrink._id}`}
                                className='standard-button'
                            >
                                <i className='fas fa-pen'></i>
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
