import Image from 'next/image';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import useAuth from '../../context/useAuth';
import useSide from '../../context/SidebarFlow';
import GiftFriend from './giftFriend';
import Sidebar from '../components/sidebar';
import styles from './cartSidebar.module.scss';
import PickDate from './pickDate';
import BookNow from './booknow';
import { useRouter } from 'next/router';

RightSidebar.propTypes = {
    navToggle: PropTypes.bool,
    onRight: PropTypes.bool,
    setNavToggle: PropTypes.func,
};

const PaymentMethod = dynamic(
    () => {
        return import('./paymentMethod');
    },
    { ssr: false }
);

function RightSidebar({ navToggle, setNavToggle, onRight }) {
    const router = useRouter();
    const {
        cartTogCon,
        setCartTogContext,
        setNavTogContext,
        pickdate,
        togglePickDate,
        togglePaymentMethod,
        isPaymentMethod,
        isGift,
        isBook,
        closeAll,
    } = useSide();
    const { IsLoggedIn, cart, removeFromCart, cartTotal: total } = useAuth();
    const sidebarProps = {
        navToggle,
        setNavToggle,
        onRight,
        closeAll,
    };
    console.log('update');
    useEffect(() => {
        setNavToggle(cartTogCon);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartTogCon]);

    useEffect(() => {
        setCartTogContext(navToggle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navToggle]);

    const close_sidebar = () => {
        togglePickDate(false);
        setNavToggle(false);
        setCartTogContext(false);
    };
    const open_login = () => {
        close_sidebar();
        setNavTogContext(true);
    };

    const convertISODatetoShortDate = (prop) => {
        let date = new Date();
        if (prop != null) date = prop;
        let formatedDate;
        formatedDate = date[8] + date[9] + 'th ';
        let Months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];
        let int = parseInt(date[5] + date[6], 10);
        formatedDate = formatedDate + Months[int - 1];
        console.log('THIS IS DATE FROM PICKTIME ' + formatedDate);
        return formatedDate;
    };
    function round5(x) {
        return Math.ceil(x / 5) * 5;
    }
    const formattime = (prop) => {
        const hrs = Math.floor(prop);
        const mins = round5(Math.floor((prop - hrs) * 60));

        const timeString = `${hrs.toString().padStart(2, '0')}:${mins
            .toString()
            .padStart(2, '0')}:00`;
        const timeString12hr = new Date(
            '1970-01-01T' + timeString + 'Z'
        ).toLocaleTimeString(
            {},
            { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }
        );
        return timeString12hr;
    };
    const { t } = useTranslation('navbar');
    //useEffect(() => { }, [pickdate]);
    return (
        <Sidebar {...sidebarProps}>
            {pickdate ? (
                <PickDate />
            ) : (
                <div>
                    {isBook ? (
                        <BookNow />
                    ) : (
                        <div>
                            {isPaymentMethod ? (
                                <PaymentMethod />
                            ) : (
                                <div>
                                    {isGift ? (
                                        <GiftFriend />
                                    ) : (
                                        <div className={styles.container}>
                                            <div className={styles.topBar}>
                                                <h1
                                                    style={{
                                                        fontWeight: 'normal',
                                                    }}
                                                >
                                                    {t('Cart')}
                                                </h1>
                                                <Image
                                                    src='/images/Cross.svg'
                                                    alt='close'
                                                    width={22}
                                                    height={22}
                                                    onClick={close_sidebar}
                                                />
                                            </div>
                                            <div
                                                className={
                                                    (styles.flex, styles.flexwithscroll)
                                                }
                                            >
                                                <div className={styles.options}>
                                                    <h3>{t('Services')}</h3>
                                                </div>
                                                {cart.map((order, index) => (
                                                    <div
                                                        key={index}
                                                        className={styles.order}
                                                    >
                                                        <div>
                                                            <h2>
                                                                {order.Arabicname
                                                                    ? order.Arabicname
                                                                    : order.name}
                                                            </h2>
                                                            <p
                                                                className={
                                                                    styles.orderAmount
                                                                }
                                                            >
                                                                {t(order.Amount)}{' '}
                                                                {t('kwd')}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            {' '}
                                                            <p
                                                                className={
                                                                    styles.orderDuration
                                                                }
                                                            >
                                                                {order.duration
                                                                    ? t(order.duration)
                                                                    : ''}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p>
                                                                {convertISODatetoShortDate(
                                                                    order.date
                                                                ) + ','}
                                                                {'  '}{' '}
                                                                {formattime(
                                                                    order.AppointTime
                                                                )}
                                                            </p>
                                                            <button
                                                                onClick={() =>
                                                                    removeFromCart(index)
                                                                }
                                                            >
                                                                {t('Remove')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className={styles.total}>
                                                    {router.locale === 'ar' ? (
                                                        <h3
                                                            dir='rtl'
                                                            className={styles.totalh32}
                                                        >
                                                            {t('Total')}:{' '}
                                                            <span>
                                                                {t(total)} {t('kwd')}
                                                            </span>
                                                        </h3>
                                                    ) : (
                                                        <h3 className={styles.totalh3}>
                                                            {t('Total')}:{' '}
                                                            <span>
                                                                {t(total)} {t('kwd')}
                                                            </span>
                                                        </h3>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        IsLoggedIn
                                                            ? togglePaymentMethod(true)
                                                            : open_login();
                                                    }}
                                                    // onClick={() =>
                                                    //     togglePaymentMethod(true)
                                                    // }
                                                    className={styles.btn}
                                                    disabled={cart.length === 0}
                                                >
                                                    {t('Checkout Cart')}
                                                </button>
                                                <button
                                                    onClick={close_sidebar}
                                                    // onClick={() =>
                                                    //     togglePaymentMethod(true)
                                                    // }
                                                    style={{
                                                        marginTop: '1rem',
                                                        cursor: 'pointer',
                                                    }}
                                                    className={styles.btn}
                                                >
                                                    {t('Continue Shopping')}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </Sidebar>
    );
}

export default RightSidebar;
