import axios, { AxiosResponse } from 'axios';

import React from 'react';

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
        params,
        headers,
    });
};

export const useFetchFromApi = <T>(
    path: string,
    params?: any,
    headers?: any
) => {
    const [response, setResponse] = React.useState<AxiosResponse<T> | null>(
        null
    );
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchFromApi<T>(path, params, headers);
                setResponse(res);
            } catch (error) {
                setResponse(error.response);
            }
        };
        fetchData();
    }, [path, headers, params]);
    return response;
};
