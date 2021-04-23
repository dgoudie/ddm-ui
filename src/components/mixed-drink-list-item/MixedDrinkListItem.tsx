import {
    BorderBox,
    Box,
    Button,
    ButtonDanger,
    Grid,
    StyledOcticon,
    Text,
} from '@primer/components';
import { PencilIcon, TrashIcon, XIcon } from '@primer/octicons-react';
import React, { useContext, useState } from 'react';

import { Link } from 'react-router-dom';
import { LoggedInStatusContext } from '../../App';
import { MixedDrinkRecipeWithIngredients } from '@dgoudie/ddm-types';
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
                <Grid
                    gridAutoFlow='column'
                    gridGap={1}
                    justifyContent='center'
                    alignItems='center'
                >
                    <Text fontSize={5} fontFamily='Rancho, cursive'>
                        {mixedDrink.name}
                    </Text>
                    <Text color='text.secondary' fontSize={2}>
                        —
                    </Text>
                    <Text
                        color='text.secondary'
                        fontSize={2}
                        fontStyle='italic'
                    >
                        ${mixedDrink.price.toFixed(2)}
                    </Text>
                </Grid>
                <div>
                    {mixedDrink.requiredBeersOrLiquors.map(
                        (ingredient, index) => (
                            <React.Fragment key={ingredient._id}>
                                <Text
                                    fontSize={2}
                                    color={
                                        ingredient.inStock
                                            ? 'text.primary'
                                            : 'text.danger'
                                    }
                                >
                                    {ingredient.name}
                                    {index <
                                        mixedDrink.requiredBeersOrLiquors
                                            .length -
                                            1 && ', '}
                                </Text>
                            </React.Fragment>
                        )
                    )}
                </div>
                <Box mt={2}>
                    <Text fontStyle='italic' color='text.secondary'>
                        Click for Recipe
                    </Text>
                </Box>
            </button>
            {recipeVisible && (
                <BorderBox bg='bg.tertiary' p={3} mb={3}>
                    <Text fontSize={0} color='text.secondary'>
                        Recipe:
                    </Text>
                    <Grid
                        gridTemplateColumns='min-content min-content 1fr'
                        gridGap='6px 10px'
                        alignItems='center'
                        mt={1}
                    >
                        {mixedDrink.requiredBeersOrLiquors.map((ingredient) => (
                            <React.Fragment key={ingredient._id}>
                                <Text>{ingredient.count}</Text>
                                <XIcon />
                                <Text>{ingredient.name}</Text>
                            </React.Fragment>
                        ))}
                    </Grid>
                    {mixedDrink.additionalNotes && (
                        <Box mt={3}>
                            <Text fontSize={0} color='text.secondary'>
                                Additional Info:
                            </Text>
                            <Text
                                as='pre'
                                whiteSpace='pre-wrap'
                                fontFamily='inherit'
                                m={0}
                                mt={1}
                            >
                                {mixedDrink.additionalNotes}
                            </Text>
                        </Box>
                    )}
                    {loggedIn && (
                        <Grid
                            justifyContent='end'
                            alignItems='center'
                            gridAutoFlow='column'
                            mt={2}
                            gridGap={2}
                        >
                            <Link
                                to={`/mixed-drink?id=${mixedDrink._id}`}
                                className='standard-button'
                            >
                                <Button>
                                    <StyledOcticon icon={PencilIcon} mr={2} />
                                    Edit
                                </Button>
                            </Link>
                            <ButtonDanger>
                                <StyledOcticon icon={TrashIcon} mr={2} />
                                Delete
                            </ButtonDanger>
                        </Grid>
                    )}
                </BorderBox>
            )}
        </React.Fragment>
    );
}
