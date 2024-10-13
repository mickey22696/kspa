import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import useSide from '../../context/SidebarFlow';
import useAuth from '../../context/useAuth';
import { useTranslation } from 'react-i18next';
import CalendarPicker from '@material-ui/lab/CalendarPicker';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import styles from './pickDate.module.css';
import GetAddress from './getAddress';
import { useQuery, gql } from '@apollo/client';
import PickTime from './pickTime';
import CustomLoadingWrapper from '../components/CustomLoadingWrapper';
import { useRouter } from 'next/router';
const get_BLOCKED_DAYS = gql`
    query {
        dayBlocks {
            BlockDay
            notforRoom
        }
    }
`;

function PickDate() {
    const { loading, error, data } = useQuery(get_BLOCKED_DAYS);
    const {
        picktime,
        togglePickTime,
        setDate,
        AppointDur,
        AppointAmt,
        togglePickDate,
        closeAll,
        isBook,
        isCartBook,
        isKHome,
        setCartTogContext,
    } = useSide();
    const { giftOrBookNow, setGiftOrBookNow, currentCartOrder, setCurrentCartOrder } =
        useAuth();
    const [date, setDate1] = useState(new Date());
    let formated_date = date.toISOString().split('T')[0];
    let total = 0;
    let totaldur = 0;
    console.log(currentCartOrder);
    const router = useRouter();
    const addDate = () => {
        setDate(formated_date);
        togglePickTime(true);
    };
    console.log('------------ISBOOK', isBook);

    const AddDateCart = () => {
        console.log('CURRENT CART PICK DATE ', currentCartOrder);

        console.log('CARTORDWER', currentCartOrder);
        currentCartOrder.date = date.toISOString().split('T')[0];
        setCurrentCartOrder(currentCartOrder);

        togglePickTime(true);
    };

    const get_blockDay = (date) => {
        let blockdateArray = [];
        data.dayBlocks.map((item) => {
            if (item.notforRoom) {
                blockdateArray.push(item.BlockDay);
            }
        });
        let mnth = ('0' + (date.getMonth() + 1)).slice(-2);
        let day = ('0' + date.getDate()).slice(-2);
        let full_date = [date.getFullYear(), mnth, day].join('-');
        console.log(full_date);
        if (blockdateArray.includes(full_date)) {
            return true;
        } else {
            return false;
        }
    };

    const disableWeekends = (date) => {
        return get_blockDay(date);
    };

    const addDate_now = () => {
        giftOrBookNow.date = formated_date;
        setGiftOrBookNow(giftOrBookNow);
        togglePickTime(true);
    };

    const totalCartCalc = () => {
        if (currentCartOrder) {
            return currentCartOrder.Amount;
        }
    };
    const totalCartDurCalc = () => {
        if (currentCartOrder) {
            console.log('Current order', currentCartOrder.duration);
            return currentCartOrder.duration.split('n')[1];
        }
    };
    const totalCalc_now = () => {
        if (giftOrBookNow) {
            return giftOrBookNow.Amount;
        }
    };
    const totalDurCalc_now = () => {
        if (giftOrBookNow) {
            return giftOrBookNow.duration * 60;
        }
    };
    const totalCalc = () => {
        total = Math.round(AppointAmt);
        return total;
    };
    const totalDurCalc = () => {
        totaldur = Math.round(AppointDur * 60);
        return totaldur;
    };
    const get_max_date = () => {
        let curr_date = new Date();
        let max_date = new Date(curr_date);
        max_date.setDate(max_date.getDate() + 31);
        return max_date;
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

    const { t } = useTranslation('navbar');
    if (loading) return <CustomLoadingWrapper />;
    if (error) console.log('error');
    return (
        <>
            {picktime ? (
                <PickTime />
            ) : (
                <div>
                    {isKHome ? <GetAddress /> : null}
                    <div className={styles.container}>
                        <div className={styles.topBar}>
                            {isBook ? null : (
                                <Image
                                    src='/images/back_arrow.svg'
                                    alt='back'
                                    width={28}
                                    height={22}
                                    onClick={() => {
                                        togglePickDate(false);
                                        if (isCartBook) setCartTogContext(false);
                                    }}
                                />
                            )}
                            <h1
                                style={{
                                    fontWeight: 'normal',
                                }}
                            >
                                {t('Pick Date')}
                            </h1>
                            <Image
                                src='/images/Cross.svg'
                                alt='close'
                                width={22}
                                height={22}
                                onClick={() => closeAll()}
                            />
                        </div>
                        <div className={styles.flex}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <CalendarPicker
                                    date={date}
                                    onChange={(newDate) => setDate1(newDate)}
                                    minDate={new Date()}
                                    maxDate={get_max_date()}
                                    shouldDisableDate={disableWeekends}
                                    sx={{
                                        '.MuiButtonBase-root-MuiPickersDay-root.Mui-disabled':
                                            {
                                                backgroundColor: 'red !important',
                                            },
                                    }}
                                />
                            </LocalizationProvider>
                            {isBook ? (
                                <button className={styles.btn} onClick={addDate_now}>
                                    {t('Confirm Date')}
                                </button>
                            ) : isCartBook ? (
                                <button
                                    className={styles.btn}
                                    onClick={() => AddDateCart()}
                                >
                                    {t('Confirm Date')}
                                </button>
                            ) : (
                                <button className={styles.btn} onClick={addDate}>
                                    {t('Confirm Date')}
                                </button>
                            )}
                            <div className={styles.row}>
                                <p>
                                    {t('Total')}:{' '}
                                    {isBook
                                        ? translating_number(totalCalc_now())
                                        : isCartBook
                                        ? translating_number(totalCartCalc())
                                        : translating_number(totalCalc())}{' '}
                                    {t('kwd')}
                                </p>
                                <p>
                                    {t('Duration')}:{' '}
                                    {router.locale == 'ar'
                                        ? t(
                                              'min' +
                                                  (isBook
                                                      ? totalDurCalc_now()
                                                      : isCartBook
                                                      ? totalCartDurCalc()
                                                      : totalDurCalc())
                                          )
                                        : (isBook
                                              ? totalDurCalc_now()
                                              : isCartBook
                                              ? totalCartDurCalc()
                                              : totalDurCalc()) + ' Mins'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PickDate;
