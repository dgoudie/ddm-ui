import { RouteComponentProps, withRouter } from 'react-router-dom';

import { BeerOrLiquorBrand } from '@dgoudie/ddm-types';
import Loader from '../../components/loader/Loader';
import React from 'react';
import { displayErrorToast } from '../../utils/toast';
import { useFetchFromApi } from '../../utils/fetch-from-api';

function BeerOrLiquor({ location }: RouteComponentProps) {
    const id = new URLSearchParams(location.search).get('id');
    const [response, error, loading] = useFetchFromApi<BeerOrLiquorBrand>(
        `/beer-or-liquor/${id}`,
        null,
        null,
        !id
    );
    if (!!error) {
        displayErrorToast(error.response?.data ?? error);
        return null;
    }
    if (loading) {
        return <Loader />;
    }
    return <div>{JSON.stringify(response?.data)}</div>;
}

export default withRouter(BeerOrLiquor);
