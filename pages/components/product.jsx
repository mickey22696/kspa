import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import styles from './product.module.css';
import useAuth from '../../context/useAuth';
import useSide from '../../context/SidebarFlow';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
export default function Product({ props, locale }) {
    // console.log(props, locale);

    const [isActive] = useState(true);
    const [isKey, setKey] = useState(0);

    const [order, setOrder] = useState(null);

    const {
        IsLoggedIn,
        // addToCart,
        addToGiftorBook,
        // bookNow,
        setCurrentCartOrder,
        currentCartOrder,
        addToCart,
    } = useAuth();
    const {
        setCartTogContext,
        setNavTogContext,
        toggleGift,
        // toggleBook,
        toggleKHome,
        toggleCartBook,
    } = useSide();
    const router = useRouter();
    const addGift = () => {
        if (!IsLoggedIn) {
            setNavTogContext(true);
        } else {
            addToGiftorBook(order);
            toggleGift(true);
            setCartTogContext(true);
        }
    };

    const addCart = () => {
        //order.duration = props.ServicePrices[isKey].Time;
        if (props.ServiceSubcategory == 'Club') {
            order.duration = props.ServicePrices[isKey].Time;

            addToCart(order);
            setCartTogContext(true);
        } else {
            if (props.ServiceCategory === 'Kingsley_Home') {
                toggleKHome(true);
            }
            console.log('HELLO THIS IS ADD CART IN PRODUCTS', currentCartOrder);
            console.log('order before', order);
            if (order.AppointRoom) {
                delete order.AppointRoom;
            }
            if (order.AppointTime) {
                delete order.AppointTime;
            }
            if (order.date) {
                delete order.date;
            }
            console.log('Order', order);
            setCurrentCartOrder(order);
            //toggleBook(true);
            setCartTogContext(true);
            toggleCartBook(true);
            //addToCart(order);
            //setCartTogContext(false);
        }
    };
    // const addCart2 = () => {
    //     order.duration = props.ServicePrices[isKey].Time;

    //     addToCart(order);
    //     setCartTogContext(true);
    // };
    // const booknow = async () => {
    //     if (!IsLoggedIn) {
    //         setNavTogContext(true);
    //     } else {
    //         if (props.ServiceCategory === 'Kingsley_Home') {
    //             toggleKHome(true);
    //         }
    //         bookNow(order);
    //         //toggleBook(true);
    //         setCartTogContext(true);
    //     }
    // };

    useEffect(() => {
        console.log('===========================');
        console.log(props);
        const tempOrder = {
            serviceId: props.id,
            duration: props.ServicePrices[isKey].Time,
            Amount: props.ServicePrices[isKey].Price,
            slug: props.id,
            name: props.ServiceName,
            clubCredit: props.clubCredit,
            Arabicname:
                props.localizations &&
                props.localizations[0] &&
                props.localizations[0].ServiceName
                    ? props.localizations[0].ServiceName
                    : '',
            serviceCategory: props.ServiceCategory,
            serviceSubcategory: props.ServiceSubcategory,
        };
        setOrder(tempOrder);
        // order.duration = props.ServicePrices[isKey].Time;
        // order.Amount = props.ServicePrices[isKey].Price;
        // order.slug = props.id;
        // order.name = props.ServiceName;
        console.log('TempOrder is ', tempOrder, 'And Order is ', order);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isKey]);

    const { t } = useTranslation('common');
    const translating_number = (value) => {
        let value_str = JSON.stringify(value);
        let translated_Value = '';
        console.log('THIS');
        for (let i = 0; i < value_str.length; i++) {
            translated_Value += t(value_str[i]);
        }
        console.log(translated_Value);
        return translated_Value;
    };
    return (
        <>
            {props && (
                <div className={styles.cardBig}>
                    <div className={styles.cardBig_col_alt}>
                        <div
                            className={
                                router.locale == 'ar'
                                    ? styles.cardBig_name_ar
                                    : styles.cardBig_name
                            }
                        >
                            {locale && props.localizations[0]?.ServiceName
                                ? props.localizations[0]?.ServiceName
                                : props.ServiceName}
                        </div>
                    </div>
                    <div className={styles.cardBig_hero}>
                        <div className={styles.herodiv_img}>
                            <Image
                                src={
                                    props.ServiceImage
                                        ? props.ServiceImage.url
                                        : '/images/Kingsley.png'
                                }
                                alt='image'
                                width={150}
                                height={150}
                                objectFit={'cover'}
                            />
                        </div>
                        <div className={styles.cardBig_col}>
                            <div className={styles.cardBig_name}>
                                {locale && props.localizations[0]?.ServiceName
                                    ? props.localizations[0]?.ServiceName
                                    : props.ServiceName}
                            </div>
                        </div>
                    </div>
                    <div className={styles.prod_col}>
                        <div className={styles.prod_desc}>
                            {locale && props.localizations[0]?.ServiceDesc
                                ? props.localizations[0]?.ServiceDesc
                                : props.ServiceDesc}
                        </div>
                        {props.ServiceSubcategory != 'Club' &&
                            props.ServiceSubcategory != 'Product' && (
                                <h1>{t('Duration')} :</h1>
                            )}
                        {props.ServicePrices &&
                            props.ServiceSubcategory != 'Club' &&
                            props.ServiceSubcategory != 'Product' && (
                                <div className={styles.prod_dur}>
                                    {props.ServicePrices.map((duration, index) => (
                                        <label
                                            key={index}
                                            className={
                                                isActive && isKey == index
                                                    ? `${styles.btnactive}`
                                                    : null
                                            }
                                        >
                                            <input
                                                type='radio'
                                                value={duration}
                                                checked={isKey == index}
                                                onChange={() => setKey(index)}
                                            />
                                            {t(`${duration.Time}`)}
                                        </label>
                                    ))}
                                </div>
                            )}
                        {props.ServicePrices && (
                            <div className={styles.prod_price}>
                                <h1>
                                    {t('Price')} :{' '}
                                    {locale ? (
                                        <span dir='rtl'>
                                            <span style={{ marginLeft: '2px' }}>
                                                {translating_number(
                                                    props.ServicePrices[isKey]?.Price
                                                )}{' '}
                                            </span>{' '}
                                            {t('kwd')}
                                        </span>
                                    ) : (
                                        <span>
                                            {translating_number(
                                                props.ServicePrices[isKey]?.Price
                                            )}{' '}
                                            {t('kwd')}
                                        </span>
                                    )}
                                </h1>
                            </div>
                        )}
                        {props.ServiceCategory == 'Gifts' ? (
                            <div className={styles.prod_btn}>
                                <motion.button
                                    whileTap={{
                                        scale: 0.95,
                                    }}
                                    onClick={addGift}
                                    disabled={!isActive}
                                >
                                    {t('Gift a friend')}
                                </motion.button>
                            </div>
                        ) : (
                            <div className={styles.prod_btn}>
                                <motion.button
                                    whileTap={{
                                        scale: 0.95,
                                    }}
                                    onClick={addCart}
                                >
                                    {t('Add to Cart')}
                                </motion.button>
                                {/* {props.ServiceSubcategory != 'Club' && (
                                    <button onClick={booknow}>{t('Book Now')}</button>
                                )} */}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
