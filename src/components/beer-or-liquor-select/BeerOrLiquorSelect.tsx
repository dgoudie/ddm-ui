import { Details, SelectMenu, TextInput, useDetails } from '@primer/components';
import { useCallback, useEffect, useRef, useState } from 'react';

import { BeerOrLiquorBrand } from '@dgoudie/ddm-types';
import { errorToastEffect } from '../../utils/toast';
import { singletonHook } from 'react-singleton-hook';
import styles from './BeerOrLiquorSelect.module.scss';
import { useFetchFromApi } from '../../utils/fetch-from-api';

const useAllBeersAndLiquors = singletonHook<BeerOrLiquorBrand[]>([], () => {
    const params = useRef({});
    const headers = useRef({});
    const [response, error] = useFetchFromApi<BeerOrLiquorBrand[]>(
        `/beers-and-liquors`,
        params,
        headers,
        false,
        true
    );

    errorToastEffect(error?.response?.data ?? error);

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
            idChanged(beerOrLiquor._id);
            setName(beerOrLiquor.name);
            setOpen(false);
        },
        [setOpen, idChanged]
    );

    return (
        <Details {...getDetailsProps()} className={styles.root}>
            <summary>
                <TextInput
                    className={styles.textInput}
                    required
                    readOnly
                    value={name}
                    onFocus={() => setOpen(true)}
                    block
                    placeholder={'Select Beer or Liquor...'}
                />
            </summary>
            <SelectMenu.Modal>
                <SelectMenu.Header>Beers & Liquors</SelectMenu.Header>
                <SelectMenu.List>
                    {beersAndLiquors.map((bol) => (
                        <SelectMenu.Item
                            key={bol._id}
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
