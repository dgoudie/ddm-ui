import {
    Box,
    Button,
    ButtonPrimary,
    Details,
    Dropdown,
    FilteredSearch,
    Flex,
    Heading,
    TextInput,
    useDetails,
} from '@primer/components';
import React, {
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from 'react';

import { BeerOrLiquorBrand } from '@dgoudie/ddm-types';
import { BeerOrLiquorListItem } from '../../components/beer-or-liquor-list-item/BeerOrLiquorListItem';
import Divider from '../../components/divider/Divider';
import { Link } from 'react-router-dom';
import Loader from '../../components/loader/Loader';
import { LoggedInStatusContext } from '../../App';
import { SearchIcon } from '@primer/octicons-react';
import { displayErrorToast } from '../../utils/toast';
import styles from './BeersAndLiquors.module.scss';
import { useDebouncedEffect } from '../../utils/use-debounced-effect';
import { useFetchFromApi } from '../../utils/fetch-from-api';

type ShowOnlyFilter = 'In Stock' | 'Out Of Stock' | null;

export default function BeersAndLiquors() {
    const [showOnly, setShowOnly] = useState<ShowOnlyFilter>(null);
    const { getDetailsProps, setOpen } = useDetails({
        closeOnOutsideClick: true,
    });

    const updateFilter = useCallback(
        (value: ShowOnlyFilter) => {
            setOpen(false);
            setShowOnly(value);
        },
        [setOpen, setShowOnly]
    );

    const [filterText, setFilterText] = useState('');
    const [debouncedfilterText, setDebouncedFilterText] = useState(filterText);

    const { loggedIn } = useContext(LoggedInStatusContext);

    useDebouncedEffect(() => setDebouncedFilterText(filterText), 300, [
        filterText,
    ]);

    const params = useMemo(
        () => ({
            onlyInStock: showOnly === 'In Stock',
            onlyOutOfStock: showOnly === 'Out Of Stock',
            filter: debouncedfilterText,
        }),
        [showOnly, debouncedfilterText]
    );

    const headers = useRef({});

    const [response, error] = useFetchFromApi<BeerOrLiquorBrand[]>(
        `/beers-and-liquors`,
        params,
        headers,
        false,
        true
    );

    if (!!error) {
        displayErrorToast(error.response?.data ?? error);
    }
    return (
        <React.Fragment>
            <Flex justifyContent={'space-between'} alignItems='center' mt={3}>
                <Heading fontSize={3}>Beers & Liquors</Heading>
                <Link to='/mixed-drinks'>
                    <Button>
                        <i className='fas fa-glass-martini-alt' />
                        Mixed Drinks
                    </Button>
                </Link>
            </Flex>
            <FilteredSearch my={3} className={styles.search}>
                <Details {...getDetailsProps()} className={styles.details}>
                    <Dropdown.Button>
                        {!!showOnly ? showOnly : 'Filter'}
                    </Dropdown.Button>
                    <Dropdown.Menu direction='se' className={styles.menu}>
                        <Dropdown.Item onClick={() => updateFilter(null)}>
                            Show all
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => updateFilter('In Stock')}>
                            Show only in stock
                        </Dropdown.Item>
                        {loggedIn && (
                            <Dropdown.Item
                                onClick={() => updateFilter('Out Of Stock')}
                            >
                                Show only out of stock
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Details>
                <TextInput
                    icon={SearchIcon}
                    className={styles.textInput}
                    type='search'
                    autoCorrect='off'
                    autoCapitalize='none'
                    onChange={(event) => setFilterText(event.target.value)}
                />
            </FilteredSearch>
            {!!response?.data ? (
                <React.Fragment>
                    <Box>
                        <Divider />
                        {response.data.map((beerOrLiquor) => (
                            <React.Fragment key={beerOrLiquor._id}>
                                <BeerOrLiquorListItem
                                    beerOrLiquor={beerOrLiquor}
                                />
                                <Divider />
                            </React.Fragment>
                        ))}
                    </Box>

                    <Flex justifyContent='center' pt={3} pb={10}>
                        {loggedIn && (
                            <Link
                                className={'standard-button'}
                                to='/beer-or-liquor'
                            >
                                <ButtonPrimary>
                                    <i className='fas fa-beer'></i>
                                    New Beer / Liquor
                                </ButtonPrimary>
                            </Link>
                        )}
                    </Flex>
                </React.Fragment>
            ) : (
                <Box margin={`48px auto 0`}>
                    <Loader className={styles.loader} />
                </Box>
            )}
        </React.Fragment>
    );
}
