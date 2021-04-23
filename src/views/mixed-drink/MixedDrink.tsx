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
        MixedDrinkRecipeIngredient[]
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
                        requiredBeersOrLiquors,
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
            <label>Name</label>
            <input
                autoFocus
                autoComplete='off'
                spellCheck={false}
                required
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <div className={styles.buttonBar}>
                <Link
                    to='/mixed-drinks'
                    className={classNames(
                        'standard-button',
                        styles.cancelButton
                    )}
                >
                    <i className='fas fa-chevron-left' />
                    Cancel
                </Link>
                <button type='submit' className='standard-button'>
                    <i className='fas fa-save' />
                    Save
                </button>
            </div>
        </form>
    );
}

export default withRouter(MixedDrink);
