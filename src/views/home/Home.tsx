import { Link } from 'react-router-dom';
import styles from './Home.module.scss';

export default function Home() {
    return (
        <div className={styles.root}>
            <Link className={styles.link} to='/mixed-drinks'>
                <i className='fas fa-glass-martini-alt' />
                Mixed Drinks
            </Link>
            <Link className={styles.link} to='/beers-and-liquors'>
                <i className='fas fa-beer' />
                Beers & Liquors
            </Link>
        </div>
    );
}
