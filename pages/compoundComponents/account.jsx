import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import useAuth from '../../context/useAuth';
import useSide from '../../context/SidebarFlow';
import { GET_ORDER, GET_ORDER_TO_BOOK } from '../../GraphQL/queries';
import { useQuery } from '@apollo/client';
import styles from './account.module.css';
import PickDate from './pickDate';
import closeButton from '../../public/images/Cross.svg';
import { useRouter } from 'next/router';

// import { useEffect } from 'react';
// import CustomLoadingWrapper from '../components/CustomLoadingWrapper';

function Account() {
    const today = new Date();
    const {
        pickdate,
        isInfo,
        isUpcoming,
        toggleClass,
        toggleUpcoming,
        togglePickDate,
        toggleKHome,
        setOrder,
        closeAll,
        // forceFetch,
    } = useSide();

    const { userDetails, logoutUser } = useAuth();
    console.log('userDetails', userDetails);
    const { data: booked } = useQuery(GET_ORDER, {
        variables: {
            ordersWhere: {
                user: {
                    id: userDetails?.id,
                },
                isBooked: true,
                isPaid: true,
                _and: [
                    {
                        real_service: {
                            ServiceSubcategory_ncontains: 'Product',
                        },
                    },
                    {
                        real_service: {
                            ServiceSubcategory_ncontains: 'Club',
                        },
                    },
                ],
            },
        },
        ssr: false,
        pollInterval: 2000,
    });
    const router = useRouter();
    const { data: tobook } = useQuery(GET_ORDER_TO_BOOK, {
        variables: {
            ordersWhere: {
                user: {
                    id: userDetails?.id,
                },
                isPaid: true,
                isBooked: false,
                _and: [
                    {
                        real_service: {
                            ServiceSubcategory_ncontains: 'Product',
                        },
                    },
                    {
                        real_service: {
                            ServiceSubcategory_ncontains: 'Club',
                        },
                    },
                ],
            },
        },
        ssr: false,
        pollInterval: 2000,
    });
    console.log('toBooK', tobook);
    // useEffect(() => {
    //     orderRefetcher();
    //     toBookRefetcher();
    //     console.log('refetching entries', isInfo);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isInfo, forceFetch]);

    const { t } = useTranslation('navbar');

    const booknow = (prop) => {
        if (prop.real_service.ServiceCategory === 'Kingsley_Home') {
            toggleKHome(true);
        }
        setOrder(prop);
        togglePickDate(true);
    };

    const convertISODatetoShortDate = (date) => {
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
        return formatedDate;
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
    const checkUpcoming = (order) => {
        //order.AppointmentDate format is 2021-12-08

        //making the format similat to order.AppointmentDate
        let todaysDate = today.toISOString().split('T')[0];

        //checking if the date is in future or today
        if (order.AppointmentDate === todaysDate) {
            //order.AppointTime format is hrs:mins:00.000 something
            let time1 = order.AppointmentTime;
            //formating time1 to hrsmins
            let formatedTime1 = time1.split(':');
            //[0] + time1.split(':')[1]
            let time0 = [
                JSON.stringify(today.getHours()),
                JSON.stringify(today.getMinutes()),
            ];
            //adding 0 if a single digit number
            console.log(parseInt(formatedTime1[0]) > parseInt(time0[0]));
            console.log(time0);
            //checking if the the appointment time has already passed
            if (
                parseInt(formatedTime1[0]) > parseInt(time0[0]) ||
                (parseInt(formatedTime1[0]) === parseInt(time0[0]) &&
                    parseInt(formatedTime1[1]) > parseInt(time0[1]))
            ) {
                console.log('YESSSS');
                return true;
            } else {
                return false;
            }
        } else if (order.AppointmentDate > todaysDate) {
            return true;
        } else {
            return false;
        }
    };

    const convertTime = (time) => {
        const formattedTime = new Date('1970-01-01T' + time + 'Z').toLocaleTimeString(
            {},
            { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }
        );
        // console.log(formattedTime);
        return formattedTime;
    };
    console.log('TRANSLATION TEST', t('55'));

    return (
        <>
            {pickdate ? (
                <PickDate />
            ) : (
                <div className={styles.container}>
                    <div className={styles.topBar}>
                        <h1
                            style={{
                                fontWeight: 'normal',
                            }}
                        >
                            {t('Account')}
                        </h1>
                        <Image
                            src={closeButton}
                            alt='close'
                            width={22}
                            height={22}
                            onClick={() => closeAll()}
                        />
                    </div>
                    <div className={styles.flex}>
                        <div className={styles.row}>
                            <button
                                onClick={() => toggleClass(true)}
                                className={isInfo ? `${styles.active}` : `${styles.btn}`}
                            >
                                {t('User Info')}
                            </button>

                            <button
                                onClick={() => toggleClass(false)}
                                className={
                                    !isInfo
                                        ? (tobook &&
                                              tobook.orders &&
                                              (tobook.orders.length
                                                  ? `${styles.activehas}`
                                                  : `${styles.active}`)) ||
                                          `${styles.active}`
                                        : (tobook &&
                                              tobook.orders &&
                                              (tobook.orders.length
                                                  ? `${styles.btnhas}`
                                                  : `${styles.btn}`)) ||
                                          `${styles.btn}`
                                }
                            >
                                {t('To Book/Gifts')}
                                {tobook && tobook.orders.length >= 1 && (
                                    <div className={styles.btnNotific}>
                                        {' '}
                                        {tobook.orders.length
                                            ? tobook.orders.length >= 100
                                                ? '99+'
                                                : tobook.orders.length
                                            : 0}
                                    </div>
                                )}
                            </button>
                        </div>
                        {isInfo ? (
                            <div className={styles.flex}>
                                <div className={styles.details}>
                                    <h4>{userDetails?.username}</h4>
                                    <h4>{userDetails?.email?.split('@')[0]}</h4>
                                </div>
                                <p style={{ cursor: 'pointer' }} onClick={logoutUser}>
                                    Logout
                                </p>
                                {router.locale == 'en' ? (
                                    <div dir='ltr'>
                                        {userDetails?.walletBalance > 0 && (
                                            <h1 style={{ fontSize: 21 }}>
                                                My Wallet : {userDetails?.walletBalance}{' '}
                                                KWD
                                            </h1>
                                        )}
                                    </div>
                                ) : (
                                    <div dir='rtl'>
                                        {userDetails?.walletBalance > 0 && (
                                            <h1 style={{ fontSize: 21 }}>
                                                {t('My Wallet')} :{' '}
                                                {translating_number(
                                                    userDetails?.walletBalance
                                                )}{' '}
                                                {t('kwd')}
                                            </h1>
                                        )}
                                    </div>
                                )}
                                {/* <h1>{t('Appointments')}</h1> */}
                                <div className={styles.row}>
                                    <button
                                        onClick={() => toggleUpcoming(true)}
                                        className={
                                            isUpcoming
                                                ? `${styles.active}`
                                                : `${styles.btn}`
                                        }
                                    >
                                        {t('Up Coming')}
                                    </button>
                                    <button
                                        onClick={() => toggleUpcoming(false)}
                                        className={
                                            !isUpcoming
                                                ? `${styles.active}`
                                                : `${styles.btn}`
                                        }
                                    >
                                        {t('History')}
                                    </button>
                                </div>
                                {booked && (
                                    <div>
                                        <div
                                            className={[
                                                styles.flex,
                                                styles.smaller,
                                                styles.flexwithscroll,
                                            ].join(' ')}
                                        >
                                            {booked.orders.map((order, key) => (
                                                <div key={key}>
                                                    {checkUpcoming(order) ===
                                                        isUpcoming && (
                                                        <div className={styles.order}>
                                                            <div className={styles.col1}>
                                                                {order.AppointmentDate
                                                                    ? convertISODatetoShortDate(
                                                                          order.AppointmentDate
                                                                      )
                                                                    : null}
                                                                <p>
                                                                    {order.AppointmentTime
                                                                        ? convertTime(
                                                                              order.AppointmentTime
                                                                          )
                                                                        : null}
                                                                </p>
                                                            </div>
                                                            <div className={styles.col2}>
                                                                {console.log(
                                                                    order.real_service
                                                                )}
                                                                {router.locale == 'ar' &&
                                                                order.real_service
                                                                    .localizations &&
                                                                order.real_service
                                                                    .localizations[0] &&
                                                                order.real_service
                                                                    .localizations[0]
                                                                    .ServiceName
                                                                    ? order.real_service
                                                                          .localizations[0]
                                                                          .ServiceName
                                                                    : order.real_service
                                                                          .ServiceName}
                                                                {order.real_service
                                                                    .ServiceCategory ==
                                                                    'Kingsley_Home' && (
                                                                    <p>Home</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className={styles.addpadd}></div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            tobook && (
                                <div className={(styles.flex, styles.flexwithscroll)}>
                                    {console.log('ORDERS', tobook.orders)}
                                    {tobook.orders.map(
                                        (order, key) =>
                                            order.real_service?.ServiceName && (
                                                <div key={key}>
                                                    {order.real_service
                                                        ?.ServiceSubcategory != 'Club' &&
                                                        order.real_service
                                                            ?.ServiceSubcategory !=
                                                            'Product' && (
                                                            <div className={styles.order}>
                                                                <div
                                                                    onClick={() =>
                                                                        booknow(order)
                                                                    }
                                                                    className={
                                                                        styles.col1
                                                                    }
                                                                >
                                                                    {t('Book Now')}
                                                                </div>
                                                                <div
                                                                    className={
                                                                        styles.col2
                                                                    }
                                                                >
                                                                    {router.locale ==
                                                                        'ar' &&
                                                                    order.real_service
                                                                        .localizations &&
                                                                    order.real_service
                                                                        .localizations[0]
                                                                        .ServiceName
                                                                        ? order
                                                                              .real_service
                                                                              .localizations[0]
                                                                              .ServiceName
                                                                        : order
                                                                              .real_service
                                                                              ?.ServiceName}
                                                                    <p>
                                                                        {t(
                                                                            'min' +
                                                                                Math.round(
                                                                                    order.Duration *
                                                                                        60
                                                                                )
                                                                        )}
                                                                    </p>
                                                                    {order.real_service
                                                                        .ServiceCategory ===
                                                                    'Gifts' ? (
                                                                        <p>GIFT</p>
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>
                                            )
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
export default Account;
