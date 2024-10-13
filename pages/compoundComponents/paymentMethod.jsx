import * as React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import useSide from '../../context/SidebarFlow';
import useAuth from '../../context/useAuth';
import OrderConfirm from './orderConfirm';
import PaymentComp from '../components/PaymentsComp';
import styles from './pickDate.module.css';
import { useState } from 'react';
import CustomLoadingWrapper from '../components/CustomLoadingWrapper';
import { gql, useQuery } from '@apollo/client';

const get_cash_On = gql`
    query {
        kingsleyCash {
            cash1
        }
    }
`;

function PaymentMethod() {
    const { loading, error, data } = useQuery(get_cash_On);
    const [open, setOpen] = useState(false);
    const [isWallet, setWallet] = useState();

    const [isLoading, setLoading] = useState(false);
    const { isGift, togglePaymentMethod, closeAll, isBook } = useSide();
    const {
        cart,
        giftOrBookNow,
        userDetails,
        createorders,
        emptyCart,
        createGifts,
        createTransactionBook,
    } = useAuth();
    const [isOrderConfirm, setIsOrderConfirm] = useState(false);
    const processBookNow = (prop) => {
        setLoading(true);
        createTransactionBook(prop).then(() => {
            setIsOrderConfirm(true);
            setLoading(false);
        });
        console.log('ProcessBookNow');
    };
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
    const processNormal = (prop) => {
        setLoading(true);
        createorders(prop).then(() => {
            setIsOrderConfirm(true);
            emptyCart();
            setLoading(false);
            console.log('processNormal');
        });
    };

    const processGift = (prop) => {
        setLoading(true);
        createGifts(prop).then(() => {
            setIsOrderConfirm(true);
            setLoading(false);
        });
        console.log('processGift');
        // setIsOrderConfirm(true);
    };
    const [isClub, setIsClub] = useState(false);
    const [isPackage, setIsPackage] = useState(false);
    let total = 0;
    const totalcalc = () => {
        if (isBook) {
            total = giftOrBookNow.Amount;
        } else {
            cart.map((order) => {
                console.log('-----==========------------');
                console.log(order.clubCredit);
                if (
                    (order.serviceSubcategory === 'Club' || order.clubCredit > 0) &&
                    isClub === false
                ) {
                    setIsClub(true);
                }
                if (order.serviceSubcategory === 'Packages' && isPackage === false) {
                    setIsPackage(true);
                }
                total = total + order.Amount;
            });
        }
        return total;
    };
    const { t } = useTranslation('navbar');
    if (loading) return <CustomLoadingWrapper />;
    if (error) console.log('error');
    return (
        <>
            {isOrderConfirm ? (
                <OrderConfirm />
            ) : (
                // ) : open ? (
                //     <PlaceOrder setIsOrderConfirm={setIsOrderConfirm} isWallet={isWallet} />
                // ) : (
                <div className={styles.container}>
                    <div className={styles.topBar}>
                        {isBook ? null : (
                            <Image
                                src='/images/back_arrow.svg'
                                alt='back'
                                width={28}
                                height={22}
                                onClick={() => togglePaymentMethod(false)}
                            />
                        )}
                        <h1
                            style={{
                                fontWeight: 'normal',
                            }}
                        >
                            {open ? 'Confirm Payment' : t('Payment Method')}
                        </h1>
                        <Image
                            src='/images/Cross.svg'
                            alt='close'
                            width={22}
                            height={22}
                            onClick={() => {
                                closeAll();
                            }}
                        />
                    </div>

                    {isLoading && <CustomLoadingWrapper />}
                    {open ? (
                        isGift ? (
                            <div style={{ marginTop: '40px' }}>
                                <button
                                    className={styles.btn}
                                    onClick={() => processGift('wallet')}
                                >
                                    Place Order
                                </button>
                                <div className={styles.row}>
                                    <p> Wallet</p>
                                    <p>
                                        {' '}
                                        {isGift ? giftOrBookNow.Amount : totalcalc()} kwd
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div style={{ marginTop: '40px' }}>
                                <button
                                    className={styles.btn}
                                    onClick={() => {
                                        isBook
                                            ? processBookNow(isWallet ? 'wallet' : 'cash')
                                            : processNormal(isWallet ? 'wallet' : 'cash');
                                    }}
                                >
                                    Place Order
                                </button>
                                <div className={styles.row}>
                                    <p> {isWallet ? 'Wallet' : 'Cash'}</p>
                                    <p>
                                        {' '}
                                        {translating_number(
                                            isGift ? giftOrBookNow.Amount : totalcalc()
                                        )}{' '}
                                        {t('kwd')}
                                    </p>
                                </div>
                            </div>
                        )
                    ) : (
                        <>
                            {isGift ? (
                                <div className={styles.flex}>
                                    <PaymentComp className={styles.btn}>
                                        {t('Knet/Visa/Master')}
                                    </PaymentComp>
                                    {giftOrBookNow.serviceSubcategory != 'Club' &&
                                    !(giftOrBookNow.clubCredit > 0) ? (
                                        <button
                                            onClick={() => setOpen(true)}
                                            //processGift('wallet')}
                                            className={styles.btn}
                                            disabled={
                                                giftOrBookNow.Amount <=
                                                userDetails?.walletBalance
                                                    ? false
                                                    : true
                                            }
                                        >
                                            {t('My Wallet')}:{' '}
                                            {translating_number(
                                                userDetails?.walletBalance
                                            )}{' '}
                                            {t('kwd')}
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            ) : (
                                <div className={styles.flex}>
                                    <PaymentComp className={styles.btn}>
                                        {t('Knet/Visa/Master')}
                                    </PaymentComp>
                                    {data.kingsleyCash && (
                                        <>
                                            {data.kingsleyCash.cash1 ? (
                                                <button
                                                    onClick={
                                                        () => {
                                                            setOpen(true);
                                                            setWallet(true);
                                                        }
                                                        // isBook
                                                        //     ? processBookNow('cash')
                                                        //     : processNormal('cash')
                                                    }
                                                    className={styles.btn}
                                                    disabled={isClub || isPackage}
                                                >
                                                    {t('Cash')}
                                                </button>
                                            ) : null}
                                        </>
                                    )}
                                    {totalcalc() <= userDetails?.walletBalance ? (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setOpen(true);
                                                    setWallet(true);
                                                    // isBook
                                                    //     ? setfunc(processBookNow('wallet'))
                                                    //     : setfunc(processNormal('wallet'));
                                                }}
                                                disabled={isClub}
                                                className={styles.btn}
                                            >
                                                {t('My Wallet')}:{' '}
                                                {translating_number(
                                                    userDetails?.walletBalance
                                                )}{' '}
                                                {t('kwd')}
                                            </button>
                                        </>
                                    ) : null}
                                </div>
                            )}{' '}
                        </>
                    )}
                </div>
            )}
        </>
    );
}

// {giftOrBookNow.serviceSubcategory != 'Club' ? (
// : (
//     <button
//         onClick={() => processGift('wallet')}
//         className={styles.btn}
//         disabled={true}
//     >
//         {t('My Wallet')}: {userDetails?.walletBalance} KWD
//     </button>
// )}

export default PaymentMethod;
