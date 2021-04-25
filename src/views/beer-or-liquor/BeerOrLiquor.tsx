import { BeerOrLiquorBrand, BeerOrLiquorBrandType } from '@dgoudie/ddm-types';
import {
    ButtonInvisible,
    ButtonPrimary,
    Details,
    Dropdown,
    FormGroup,
    Grid,
    Relative,
    StyledOcticon,
    TextInput,
    useDetails,
} from '@primer/components';
import {
    CheckIcon,
    CreditCardIcon,
    QuoteIcon,
    XIcon,
} from '@primer/octicons-react';
import {
    Link,
    Redirect,
    RouteComponentProps,
    withRouter,
} from 'react-router-dom';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { displayErrorToast, errorToastEffect } from '../../utils/toast';
import { saveBeerOrLiquor, useFetchFromApi } from '../../utils/fetch-from-api';

import CurrencyInput from '../../components/currency-input/CurrencyInput';
import Loader from '../../components/loader/Loader';
import { LoggedInStatusContext } from '../../App';
import { beerOrLiquorTypes } from '../../utils/beer-liquor-type-icon-map';
import { capitalCase } from 'capital-case';
import styles from './BeerOrLiquor.module.scss';
import toast from 'react-hot-toast';

function BeerOrLiquor({ location }: RouteComponentProps) {
    const id = new URLSearchParams(location.search).get('id');
    const [response, error, loading] = useFetchFromApi<BeerOrLiquorBrand>(
        `/beer-or-liquor/${id}`,
        null,
        null,
        !id
    );

    const { loggedIn } = useContext(LoggedInStatusContext);

    const responsePopulated = !!response?.data;

    const {
        getDetailsProps: getTypeDetailsProps,
        setOpen: setTypeOpen,
    } = useDetails({
        closeOnOutsideClick: true,
    });

    const {
        getDetailsProps: getInStockDetailsProps,
        setOpen: setInStockOpen,
    } = useDetails({
        closeOnOutsideClick: true,
    });

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
        name.replace(/[^A-z1-9 ]/g, '').toLowerCase();

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
                    displayErrorToast(e.response.data);
                }
            };
            fn();
        },
        [id, name, type, price, inStock]
    );

    const typeClicked = useCallback(
        (type: BeerOrLiquorBrandType) => {
            setType(type);
            setTypeOpen(false);
        },
        [setType, setTypeOpen]
    );

    const inStockClicked = useCallback(
        (inStock: boolean) => {
            setInStock(inStock);
            setInStockOpen(false);
        },
        [setInStock, setInStockOpen]
    );

    errorToastEffect(error?.response?.data ?? error);
    if (loggedIn === false) {
        return <Redirect to='/beers-and-liquors' />;
    }
    if (!!error) {
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
                <FormGroup.Label>Type</FormGroup.Label>
                <Relative>
                    <Details
                        {...getTypeDetailsProps()}
                        className={styles.details}
                    >
                        <Dropdown.Button>{capitalCase(type)}</Dropdown.Button>
                        <Dropdown.Menu
                            direction='se'
                            className={styles.dropdown}
                        >
                            {beerOrLiquorTypes.map((type) => (
                                <Dropdown.Item
                                    key={type}
                                    onClick={() => typeClicked(type)}
                                    className={styles.dropdownItem}
                                >
                                    {capitalCase(type)}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Details>
                </Relative>
            </FormGroup>
            <FormGroup>
                <FormGroup.Label htmlFor='price'>Price</FormGroup.Label>
                <CurrencyInput
                    className={styles.input}
                    icon={CreditCardIcon}
                    id='price'
                    autoComplete='off'
                    spellCheck={false}
                    required
                    prefix='$'
                    value={price}
                    onChange={(value) => setPrice(value)}
                />
            </FormGroup>
            <FormGroup>
                <FormGroup.Label>In Stock?</FormGroup.Label>
                <Relative>
                    <Details
                        {...getInStockDetailsProps()}
                        className={styles.details}
                    >
                        <Dropdown.Button>
                            {inStock ? 'Yes' : 'No'}
                        </Dropdown.Button>
                        <Dropdown.Menu
                            direction='se'
                            className={styles.dropdown}
                        >
                            <Dropdown.Item
                                onClick={() => inStockClicked(true)}
                                className={styles.dropdownItem}
                            >
                                Yes
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => inStockClicked(false)}
                                className={styles.dropdownItem}
                            >
                                No
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Details>
                </Relative>
            </FormGroup>
            <Grid justifyContent='end' gridAutoFlow='column' gridGap={2}>
                <Link to='/beers-and-liquors'>
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

export default withRouter(BeerOrLiquor);
