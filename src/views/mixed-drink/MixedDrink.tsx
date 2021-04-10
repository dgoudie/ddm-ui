import { RouteComponentProps, withRouter } from 'react-router-dom';

import React from 'react';

function MixedDrink({ location }: RouteComponentProps) {
    const _id = new URLSearchParams(location.search).get('_id');
    return <div>{_id ?? 'none'}</div>;
}

export default withRouter(MixedDrink);
