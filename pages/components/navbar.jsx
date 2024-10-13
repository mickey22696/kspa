import { Badge } from '@material-ui/core';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';
import useAuth from '../../context/useAuth';
import styles from './navbar.module.css';

Navbar.propTypes = {
    setNavToggle: PropTypes.func,
    setUserToggle: PropTypes.func,
    setCartToggle: PropTypes.func,
};

function Navbar({ setNavToggle, setUserToggle, setCartToggle }) {
    const { cart } = useAuth();
    return (
        <div id='navbar' className={styles.navbar}>
            <div className={styles.main_container}>
                <ul className={styles.list}>
                    <li>
                        <Image
                            src='/images/Hamburger_Button.svg'
                            alt='Menu'
                            width={30}
                            height={20}
                            onClick={() => setNavToggle(true)}
                        />
                    </li>
                    <li>
                        <Link href='/'>
                            <a>
                                <Image
                                    src='/images/logo2x.svg'
                                    alt='Home'
                                    width={100}
                                    height={30}
                                    //srcSet='images/logo-p-500.png 500w, images/logo-p-800.png 800w, images/logo-p-1080.png 1080w, images/logo.png 1227w'
                                />
                            </a>
                        </Link>
                    </li>
                    <li className={styles.listright}>
                        <Link href='/search'>
                            <a>
                                <Image
                                    src='/images/Search.svg'
                                    alt='Search'
                                    width={20}
                                    height={20}
                                />
                            </a>
                        </Link>
                    </li>
                    <li onClick={() => setUserToggle(true)}>
                        {/* <Link href='/logintest'> */}
                        <a>
                            <Image
                                src='/images/User.svg'
                                alt='User'
                                width={20}
                                height={20}
                            />
                        </a>
                        {/* </Link> */}
                    </li>
                    <li onClick={() => setCartToggle(true)}>
                        <Badge
                            badgeContent={cart.length ? cart.length : 0}
                            color='primary'
                        >
                            <a>
                                <Image
                                    src='/images/Cart.svg'
                                    alt='Cart'
                                    width={20}
                                    height={20}
                                />
                            </a>
                        </Badge>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Navbar;
