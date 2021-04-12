import { BeerOrLiquorBrand, BeerOrLiquorBrandType } from '@dgoudie/ddm-types';
import {
    Link,
    Redirect,
    RouteComponentProps,
    withRouter,
} from 'react-router-dom';
import { saveBeerOrLiquor, useFetchFromApi } from '../../utils/fetch-from-api';
import { useCallback, useEffect, useMemo, useState } from 'react';

import CurrencyInput from 'react-currency-input-field';
import Loader from '../../components/loader/Loader';
import { capitalCase } from 'capital-case';
import classNames from 'classnames';
import { displayErrorToast } from '../../utils/toast';
import styles from './BeerOrLiquor.module.scss';
import toast from 'react-hot-toast';

const ALL_TYPES: BeerOrLiquorBrandType[] = [
    'BEER',
    'WINE',
    'CIDER',
    'MEAD',
    'SAKE',
    'GIN',
    'BRANDY',
    'WHISKEY',
    'RUM',
    'TEQUILA',
    'VODKA',
    'ABSINTHE',
    'EVERCLEAR',
    'OTHER',
];

function BeerOrLiquor({ location }: RouteComponentProps) {
    const id = new URLSearchParams(location.search).get('id');
    const [response, error, loading] = useFetchFromApi<BeerOrLiquorBrand>(
        `/beer-or-liquor/${id}`,
        null,
        null,
        !id
    );

    const responsePopulated = !!response?.data;

    const originalPrice = useMemo(() => response?.data.price.toFixed(2), [
        response?.data.price,
    ]);

    const [name, setName] = useState<string>('');
    const [type, setType] = useState<BeerOrLiquorBrandType>('BEER');
    const [price, setPrice] = useState<number>(0);
    const [inStock, setInStock] = useState<boolean>(true);

    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (responsePopulated) {
            setName(response!.data.name);
            setType(response!.data.type);
            setPrice(response!.data.price);
            setInStock(response!.data.inStock);
        }
        // eslint-disable-next-line
    }, [responsePopulated]);

    const normalizeName = (name: string) =>
        name.replaceAll(/[^A-z1-9 ]/g, '').toLowerCase();

    const save = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const fn = async () => {
                const nameNormalized = normalizeName(name);
                try {
                    await saveBeerOrLiquor(id, {
                        name,
                        type,
                        price,
                        inStock,
                        nameNormalized,
                    });
                    toast.success('Item saved successfully.');
                    setSaved(true);
                } catch (e) {
                    displayErrorToast(e);
                }
            };
            fn();
        },
        [id, name, type, price, inStock]
    );

    if (!!error) {
        displayErrorToast(error.response?.data ?? error);
        return null;
    }
    if (loading) {
        return <Loader className={styles.loader} />;
    }
    if (saved) {
        return <Redirect to='/beers-and-liquors' />;
    }
    return (
        <form className={styles.root} onSubmit={save}>
            <label>Name</label>
            <input
                autoFocus
                required
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <label>Type</label>
            <select
                required
                value={type}
                onChange={(e) =>
                    setType(e.target.value as BeerOrLiquorBrandType)
                }
            >
                {ALL_TYPES.map((type) => (
                    <option key={type} value={type}>
                        {capitalCase(type)}
                    </option>
                ))}
            </select>
            <label>Price</label>
            <CurrencyInput
                required
                prefix='$'
                defaultValue={originalPrice}
                decimalScale={2}
                disableGroupSeparators={true}
                fixedDecimalLength={2}
                allowDecimals
                onValueChange={(price) =>
                    setPrice(!!price ? parseFloat(price) : 0)
                }
            />
            <label>In Stock?</label>
            <select
                required
                value={inStock ? 'true' : 'false'}
                onChange={(e) => setInStock(e.target.value === 'true')}
            >
                <option value={'true'}>Yes</option>
                <option value={'false'}>No</option>
            </select>
            <div className={styles.buttonBar}>
                <Link
                    to='/beers-and-liquors'
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

export default withRouter(BeerOrLiquor);
