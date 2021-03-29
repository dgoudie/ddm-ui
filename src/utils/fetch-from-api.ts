import axios, { AxiosResponse } from 'axios';

import React from 'react';

export const fetchFromApi = <T>(
    path: string,
    params?: any
): Promise<AxiosResponse<T>> => {
    return axios.get<T>(`${process.env.REACT_APP_API}${path}`, { params });
};

export const useFetchFromApi = <T>(path: string, params?: any) => {
    const [response, setResponse] = React.useState<T | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchFromApi<T>(path, params);
                setResponse(res.data);
                setError(null);
            } catch (error) {
                setResponse(null);
                setError(error?.message);
            }
        };
        fetchData();
    }, [path, params]);
    return { response, error };
};
