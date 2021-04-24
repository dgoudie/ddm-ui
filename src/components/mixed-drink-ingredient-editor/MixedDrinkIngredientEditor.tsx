import {
    ButtonInvisible,
    ButtonOutline,
    Flex,
    Grid,
    StyledOcticon,
    TextInput,
} from '@primer/components';
import { NumberIcon, PlusIcon, XIcon } from '@primer/octicons-react';
import React, { useCallback, useEffect, useState } from 'react';

import BeerOrLiquorSelect from '../beer-or-liquor-select/BeerOrLiquorSelect';
import { MixedDrinkRecipeIngredient } from '@dgoudie/ddm-types';
import styles from './MixedDrinkIngredientEditor.module.scss';

type Props = {
    value: Partial<MixedDrinkRecipeIngredient>[];
    valueChanged: (value: Partial<MixedDrinkRecipeIngredient>[]) => void;
};

export default function MixedDrinkIngredientEditor({
    value,
    valueChanged,
}: Props) {
    const [ingredients, setIngredients] = useState<
        Partial<MixedDrinkRecipeIngredient>[]
    >(value);

    useEffect(() => {
        setIngredients(value);
    }, [value, setIngredients]);

    useEffect(() => {
        valueChanged(ingredients);
    }, [ingredients, valueChanged]);

    const addNew = useCallback(() => {
        setIngredients([...ingredients, {}]);
    }, [ingredients]);

    const ingredientUpdated = useCallback(
        (value: Partial<MixedDrinkRecipeIngredient>, index: number) => {
            setIngredients(
                ingredients.map((ingredient, i) => {
                    if (index === i) {
                        return value;
                    }
                    return ingredient;
                })
            );
        },
        [ingredients, setIngredients]
    );

    const deleted = useCallback(
        (index: number) => {
            setIngredients(ingredients.filter((_, i) => i !== index));
        },
        [ingredients, setIngredients]
    );

    return (
        <React.Fragment>
            <Grid
                gridTemplateColumns='1fr 2fr min-content'
                gridGap={2}
                className={styles.root}
            >
                {ingredients.map((ingredient, index) => (
                    <EditorItem
                        key={index}
                        id={ingredient._id}
                        count={ingredient.count}
                        idChanged={(_id) =>
                            ingredientUpdated({ ...ingredient, _id }, index)
                        }
                        countChanged={(count) =>
                            ingredientUpdated({ ...ingredient, count }, index)
                        }
                        index={index}
                        deleted={deleted}
                    />
                ))}
            </Grid>
            <Flex mt={2}>
                <ButtonOutline type='button' onClick={addNew}>
                    <StyledOcticon icon={PlusIcon} />
                    Add Ingredient
                </ButtonOutline>
            </Flex>
        </React.Fragment>
    );
}

type EditorItemProps = {
    index: number;
    id: string;
    count?: number;
    idChanged: (id: string) => void;
    countChanged: (count: number) => void;
    deleted: (index: number) => void;
};

const countToString = (count: number | undefined) => {
    if (typeof count === 'undefined' || isNaN(count)) {
        return '0';
    }
    return count.toString();
};

const stringToCount = (s: string) => {
    const value = parseFloat(s);
    if (isNaN(value)) {
        return 0;
    }
    return value;
};

function EditorItem({
    id,
    count,
    index,
    idChanged,
    countChanged,
    deleted,
}: EditorItemProps) {
    const [internalCountAsString, setInternalCountAsString] = useState(
        countToString(count)
    );

    const blur = useCallback(() => {
        countChanged(stringToCount(internalCountAsString));
    }, [countChanged, internalCountAsString]);

    return (
        <React.Fragment>
            <TextInput
                className={styles.input}
                type='number'
                inputMode='decimal'
                required
                value={count}
                onChange={(event) =>
                    setInternalCountAsString(
                        (event.target as HTMLInputElement).value
                    )
                }
                onBlur={blur}
                icon={NumberIcon}
                placeholder='ex. 1'
            />
            <BeerOrLiquorSelect id={id} idChanged={idChanged} />
            <ButtonInvisible type='button' onClick={() => deleted(index)}>
                <StyledOcticon icon={XIcon} color='text.danger' />
            </ButtonInvisible>
        </React.Fragment>
    );
}
