import axios, { AxiosError, AxiosResponse } from 'axios';

import React from 'react';
import { ServiceError } from '@dgoudie/service-error';

export type FetchFromApiOptions = {
    token: string | null;
    params?: any;
    headers?: any;
};

export const fetchFromApi = <T>(
    path: string,
    params?: any,
    headers?: any
): Promise<AxiosResponse<T>> => {
    return axios.get<T>(`${process.env.REACT_APP_API}${path}`, {
        withCredentials: true,
        params,
        headers,
    });
};

interface UseFetchState<T> {
    response: AxiosResponse<T> | null;
    error: AxiosError<ServiceError> | null;
    loading: boolean;
}

export const useFetchFromApi = <T>(
    path: string,
    params?: any,
    headers?: any
): [AxiosResponse<T> | null, AxiosError<ServiceError> | null, boolean] => {
    const [state, setState] = React.useState<UseFetchState<T>>({
        response: null,
        error: null,
        loading: true,
    });
    React.useEffect(() => {
        const fetchData = async () => {
            setState({ ...state, loading: true });
            try {
                const response = await fetchFromApi<T>(path, params, headers);
                setState({ response, error: null, loading: false });
            } catch (error) {
                setState({ response: null, error, loading: false });
            }
        };
        fetchData();
        //eslint-disable-next-line
    }, [path, headers, params]);
    return [state.response, state.error, state.loading];
};
