import {
    ButtonInvisible,
    ButtonPrimary,
    FormGroup,
    Grid,
    StyledOcticon,
    TextInput,
} from '@primer/components';
import { CheckIcon, InfoIcon, QuoteIcon, XIcon } from '@primer/octicons-react';
import {
    Link,
    Redirect,
    RouteComponentProps,
    withRouter,
} from 'react-router-dom';
import {
    MixedDrinkRecipe,
    MixedDrinkRecipeIngredient,
} from '@dgoudie/ddm-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { displayErrorToast, errorToastEffect } from '../../utils/toast';
import { saveMixedDrink, useFetchFromApi } from '../../utils/fetch-from-api';

import Loader from '../../components/loader/Loader';
import { LoggedInStatusContext } from '../../App';
import MixedDrinkIngredientEditor from '../../components/mixed-drink-ingredient-editor/MixedDrinkIngredientEditor';
import classNames from 'classnames';
import styles from './MixedDrink.module.scss';
import toast from 'react-hot-toast';

function MixedDrink({ location }: RouteComponentProps) {
    const id = new URLSearchParams(location.search).get('id');
    const [response, error, loading] = useFetchFromApi<MixedDrinkRecipe>(
        `/mixed-drink/${id}`,
        null,
        null,
        !id
    );

    const { loggedIn } = useContext(LoggedInStatusContext);

    const responsePopulated = !!response?.data;

    const [name, setName] = useState<string>('');
    const [requiredBeersOrLiquors, setRequiredBeersOrLiquors] = useState<
        Partial<MixedDrinkRecipeIngredient>[]
    >([]);
    const [additionalNotes, setAdditionalNotes] = useState<string | undefined>(
        ``
    );

    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (responsePopulated) {
            setName(response!.data.name);
            setRequiredBeersOrLiquors(response!.data.requiredBeersOrLiquors);
            setAdditionalNotes(response!.data.additionalNotes);
        }
        // eslint-disable-next-line
    }, [responsePopulated]);

    const normalizeName = (name: string) =>
        name.replace(/[^A-z1-9 ]/g, '').toLowerCase();

    const save = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const fn = async () => {
                const nameNormalized = normalizeName(name);
                try {
                    await saveMixedDrink(id, {
                        name,
                        nameNormalized,
                        requiredBeersOrLiquors: requiredBeersOrLiquors as MixedDrinkRecipeIngredient[],
                        additionalNotes,
                    });
                    toast.success('Item saved successfully.');
                    setSaved(true);
                } catch (e) {
                    displayErrorToast(e.response.data);
                }
            };
            fn();
        },
        [id, name, additionalNotes, requiredBeersOrLiquors]
    );

    errorToastEffect(error?.response?.data ?? error);
    if (loggedIn === false) {
        return <Redirect to='/mixed-drinks' />;
    }
    if (!!error) {
        return null;
    }
    if (loading) {
        return <Loader className={styles.loader} />;
    }
    if (saved) {
        return <Redirect to='/mixed-drinks' />;
    }
    return (
        <form className={styles.root} onSubmit={save}>
            <FormGroup>
                <FormGroup.Label htmlFor='name'>Name</FormGroup.Label>
                <TextInput
                    className={styles.input}
                    autoFocus
                    id='name'
                    autoComplete='off'
                    spellCheck={false}
                    required
                    type='text'
                    icon={QuoteIcon}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <FormGroup.Label>Ingredients</FormGroup.Label>
                <MixedDrinkIngredientEditor
                    value={requiredBeersOrLiquors}
                    valueChanged={setRequiredBeersOrLiquors}
                />
            </FormGroup>
            <FormGroup>
                <FormGroup.Label htmlFor='notes'>
                    Additional Notes
                </FormGroup.Label>
                <TextInput
                    as='textarea'
                    p={2}
                    className={classNames(styles.input, styles.textarea)}
                    id='notes'
                    autoComplete='off'
                    spellCheck={false}
                    type='text'
                    icon={InfoIcon}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                />
            </FormGroup>
            <Grid justifyContent='end' gridAutoFlow='column' gridGap={2}>
                <Link to='/mixed-drinks'>
                    <ButtonInvisible>
                        <StyledOcticon icon={XIcon} mr={2} />
                        Cancel
                    </ButtonInvisible>
                </Link>
                <ButtonPrimary type='submit'>
                    <StyledOcticon icon={CheckIcon} mr={2} />
                    Save
                </ButtonPrimary>
            </Grid>
        </form>
    );
}

export default withRouter(MixedDrink);
