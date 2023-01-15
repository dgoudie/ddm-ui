import {
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

import Divider from '../../components/divider/Divider';
import { Link } from 'react-router-dom';
import Loader from '../../components/loader/Loader';
import { LoggedInStatusContext } from '../../App';
import { MixedDrinkListItem } from '../../components/mixed-drink-list-item/MixedDrinkListItem';
import { MixedDrinkRecipeWithIngredients } from '@dgoudie/ddm-types';
import { SearchIcon } from '@primer/octicons-react';
import styles from './MixedDrinks.module.scss';
import { useDebouncedEffect } from '../../utils/use-debounced-effect';
import { useErrorToastEffect } from '../../utils/toast';
import { useFetchFromApi } from '../../utils/fetch-from-api';

export default function MixedDrinks() {
  const [onlyInStock, setOnlyInStock] = useState(false);
  const { getDetailsProps, setOpen } = useDetails({
    closeOnOutsideClick: true,
  });

  const updateFilter = useCallback(
    (value: boolean) => {
      setOpen(false);
      setOnlyInStock(value);
    },
    [setOpen, setOnlyInStock]
  );
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

  const headers = useRef({});

  const [response, error] = useFetchFromApi<MixedDrinkRecipeWithIngredients[]>(
    `/mixed-drinks`,
    params,
    headers.current,
    false,
    true
  );

  useErrorToastEffect(error?.response?.data ?? error);
  return (
    <React.Fragment>
      <Flex justifyContent={'space-between'} alignItems='center' mt={3}>
        <Heading fontSize={3}>Mixed Drinks</Heading>
        <Link to='/beers-and-liquors'>
          <Button>
            <i className='fas fa-beer' />
            Beers & Liquors
          </Button>
        </Link>
      </Flex>
      <FilteredSearch className={styles.filteredSearch}>
        <Details {...getDetailsProps()} className={styles.details}>
          <Dropdown.Button>
            {!!onlyInStock ? 'In Stock' : 'Filter'}
          </Dropdown.Button>
          <Dropdown.Menu direction='se' className={styles.menu}>
            <Dropdown.Item onClick={() => updateFilter(false)}>
              Show all
            </Dropdown.Item>
            <Dropdown.Item onClick={() => updateFilter(true)}>
              Show only in stock
            </Dropdown.Item>
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
          <Divider />
          <Flex flexDirection='column'>
            {response.data.map((mixedDrink) => (
              <React.Fragment key={mixedDrink._id as unknown as string}>
                <MixedDrinkListItem mixedDrink={mixedDrink} />
                <Divider />
              </React.Fragment>
            ))}
          </Flex>
          <Flex justifyContent='center' pt={3} pb={10}>
            {loggedIn && (
              <Link className={'standard-button'} to='/mixed-drink'>
                <ButtonPrimary>
                  <i className='fas fa-cocktail'></i>
                  New Mixed Drink
                </ButtonPrimary>
              </Link>
            )}
          </Flex>
        </React.Fragment>
      ) : (
        <Loader className={styles.loader} />
      )}
    </React.Fragment>
  );
}
