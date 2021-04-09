import { RouteComponentProps, withRouter } from 'react-router-dom';

function BeerOrLiquor({ location }: RouteComponentProps) {
    const _id = new URLSearchParams(location.search).get('_id');
    return <div>{_id ?? 'none'}</div>;
}

export default withRouter(BeerOrLiquor);
