import { MixedDrinkRecipeWithIngredients } from '@stan/ddm-types';
import React from 'react';
import styles from './MixedDrinks.module.scss';
import { useFetchFromApi } from '../../utils/fetch-from-api';

export default function MixedDrinks() {
    const { response, error } = useFetchFromApi<
        MixedDrinkRecipeWithIngredients[]
    >(`/mixed-drinks`);
    if (!!error) {
        return null;
    }
    return (
        <React.Fragment>
            <div className={styles.list}>
                {response?.map((mixedDrink) => (
                    <MixedDrink key={mixedDrink._id} mixedDrink={mixedDrink} />
                ))}
            </div>
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
                        <li key={ingredient._id}>{ingredient.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
