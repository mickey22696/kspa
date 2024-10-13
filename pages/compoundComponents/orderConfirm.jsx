import * as React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import useSide from '../../context/SidebarFlow';
import useAuth from '../../context/useAuth';
import styles from './pickDate.module.css';
function OrderConfirm(props) {
    const { t } = useTranslation('navbar');
    const {
        togglePaymentMethod,
        closeAll,
        setNavTogContext,
        setCartTogContext,
        setIsInfo,
        setForceFetch,
        forceFetch,
        togglePickTime,
        togglePickDate,
    } = useSide();
    const { cart, removeFromCart } = useAuth();
    const clear = () => {
        let was_pakage = false;
        cart.map((order) => {
            if (order.serviceSubcategory == 'Packages') {
                was_pakage = true;
            }
            removeFromCart(order);
        });
        togglePaymentMethod(false);
        setCartTogContext(false);
        if (was_pakage) {
            setIsInfo(false);
        }
        if (props && props.isToBook) {
            togglePickTime(false);
            togglePickDate(false);
        }
        setNavTogContext(true);
        setForceFetch(!forceFetch);
    };
    return (
        <>
            <div className={styles.container}>
                <div className={styles.topBar}>
                    <Image
                        src='/images/Cross.svg'
                        alt='close'
                        width={22}
                        height={22}
                        onClick={() => closeAll()}
                    />
                </div>
                <div className={styles.flex}>
                    <div className={styles.logo}>
                        <Image
                            src='/images/check_circle_black_24dp.svg'
                            alt='tick'
                            width={100}
                            height={100}
                        />
                    </div>
                    <h1>
                        {props && props.isToBook
                            ? t('Your Order is Booked')
                            : t('Your Order is Complete')}
                    </h1>
                </div>
                <button onClick={clear} className={styles.btn}>
                    {t('View Order')}
                </button>
            </div>
        </>
    );
}

export default OrderConfirm;
