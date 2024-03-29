import {
  Details,
  Relative,
  SelectMenu,
  TextInput,
  useDetails,
} from '@primer/components';
import { useCallback, useEffect, useRef, useState } from 'react';

import { BeerOrLiquorBrand } from '@dgoudie/ddm-types';
import { singletonHook } from 'react-singleton-hook';
import styles from './BeerOrLiquorSelect.module.scss';
import { useErrorToastEffect } from '../../utils/toast';
import { useFetchFromApi } from '../../utils/fetch-from-api';

const useAllBeersAndLiquors = singletonHook<BeerOrLiquorBrand[]>([], () => {
  const params = useRef({});
  const headers = useRef({});
  const [response, error] = useFetchFromApi<BeerOrLiquorBrand[]>(
    `/beers-and-liquors`,
    params.current,
    headers.current,
    false,
    true
  );

  useErrorToastEffect(error?.response?.data ?? error);

  if (!!error) {
    return [];
  }
  return response?.data ?? [];
});

type Props = {
  id?: string;
  idChanged: (id: string) => void;
};

export default function BeerOrLiquorSelect({ id, idChanged }: Props) {
  const [name, setName] = useState<string>('');

  const beersAndLiquors = useAllBeersAndLiquors();

  useEffect(() => {
    const bol = beersAndLiquors.find((bol) => bol._id === id);
    !!bol && setName(bol.name);
  }, [id, setName, beersAndLiquors]);

  const { getDetailsProps, setOpen } = useDetails({
    closeOnOutsideClick: true,
  });

  const selected = useCallback(
    (beerOrLiquor: BeerOrLiquorBrand) => {
      idChanged(beerOrLiquor._id as unknown as string);
      setName(beerOrLiquor.name);
      setOpen(false);
    },
    [setOpen, idChanged]
  );

  return (
    <Details {...getDetailsProps()} className={styles.root}>
      <summary>
        <Relative>
          <TextInput
            className={styles.textInput}
            required
            onKeyPress={() => false}
            value={name}
            onChange={() => null}
            onClick={() => setOpen(true)}
            block
            placeholder={'Select Beer or Liquor...'}
          />
        </Relative>
      </summary>
      <SelectMenu.Modal>
        <SelectMenu.Header>Beers & Liquors</SelectMenu.Header>
        <SelectMenu.List>
          {beersAndLiquors.map((bol) => (
            <SelectMenu.Item
              key={bol._id as unknown as string}
              onClick={() => selected(bol)}
            >
              {bol.name}
            </SelectMenu.Item>
          ))}
        </SelectMenu.List>
      </SelectMenu.Modal>
    </Details>
  );
}
