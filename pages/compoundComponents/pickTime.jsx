import * as React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { FINDTIMESLOT, DFINDTIMESLOT, DFINDTIMESLOT3 } from '../../GraphQL/queries';
import useSide from '../../context/SidebarFlow';
import useAuth from '../../context/useAuth';
import styles from './pickDate.module.css';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useState } from 'react';
import CustomLoadingWrapper from '../components/CustomLoadingWrapper';
import { MenuItem, Select } from '@mui/material';
import OrderConfirm from './orderConfirm';

const timingD = gql`
    query {
        timing {
            OpeningTime
            ClosingTime
        }
    }
`;

function PickTime() {
    // const [eventListnerPm, setAddedEventListnerPm] = useState(false);
    // const [eventListnerAm, setAddedEventListnerAm] = useState(false);
    //    const [value, setValue] = useState('10/02/2024 13:00');
    // const [value, setValue] = useState(2024, 10, 2, 13, 0);

    // const [pm, setPm] = useState(null);
    // const [am, setAm] = useState(null);

    const [isLoading, setLoading] = useState(false);
    // const [isPm, setIsPm] = useState(true);

    const {
        AppointDate,
        AppointOrder,
        // AppointDur,
        setTime,
        togglePickTime,
        togglePickDate,
        closeAll,
        setNavTogContext,
        isBook,
        isCartBook,
        setCartTogContext,
        isKHome,
    } = useSide();
    const {
        giftOrBookNow,
        setTimeBookNow,
        currentCartOrder,
        setCurrentCartOrder,
        addToCart,
        cart,
    } = useAuth();

    const [amPm, setAmPm] = useState('pm');
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [minute2, setMinute2] = useState('');

    const [minutes, setMinutes] = useState(null);
    const [hours, setHours] = useState([]);
    const [confirmed, setConfirmed] = useState(false);

    const timing = useQuery(timingD);
    const [findtime, { loading, data }] = useMutation(FINDTIMESLOT);
    const [Dfindtime, { loading: loading2, data: data2 }] = useMutation(DFINDTIMESLOT);
    const [Dfindtime2, { loading: loading3, data: data3 }] = useMutation(DFINDTIMESLOT3);

    // const [isMorn, setIsMorn] = useState(1);
    const [isActive, setIsActive] = useState(null);

    const hoursAreAvailable = (timeValue, amPm2, dataType) => {
        let hour = timeValue;
        if (amPm2 == 'pm' && timeValue < 12) {
            return false;
        } else if (amPm2 == 'am' && timeValue > 11) {
            return false;
        }
        let available_time = [];
        if (dataType == 'data' && data) {
            available_time = data.findTimes.filter((item) => {
                return Math.floor(item.time) == hour && item.room != null;
            });
        } else if (dataType == 'data2' && data2) {
            available_time = data2.DfindTimes.filter((item) => {
                return Math.floor(item.time) == hour && item.room != null;
            });
        }
        if (available_time.length > 0) return true;
        else return false;
    };

    const parseMinutes = (timeValue) => {
        let x = data ? data.findTimes : data2.DfindTimes;
        let minuteArray = [];
        let filtered_x = x.filter((item) => {
            if (Math.floor(item.time) == timeValue && item.room) {
                minuteArray.push({
                    label:
                        Math.round((item.time - Math.floor(item.time)) * 60) == 0
                            ? '00'
                            : JSON.stringify(
                                  Math.round((item.time - Math.floor(item.time)) * 60)
                              ),
                    data: item,
                });
            }
        });
        console.log(filtered_x);
        return minuteArray;
    };

    const formatTime = (timeValue) => {
        if (timeValue > 12) {
            return JSON.stringify(timeValue - 12);
        } else if (timeValue > 0 && timeValue <= 12) {
            return JSON.stringify(timeValue);
        } else if (timeValue == 0 && timeValue != null) {
            return JSON.stringify(timeValue + 12);
        } else {
            return timeValue;
        }
    };

    useEffect(() => {
        if (isBook) {
            findtime({
                variables: {
                    findTimesInput: {
                        day: giftOrBookNow.date,
                        id: giftOrBookNow.id,
                    },
                },
            });

            // setValue(new Date(`${giftOrBookNow.date} 13:00`));
        } else if (isCartBook && isKHome) {
            let duration = 0;
            if (typeof currentCartOrder.duration != 'number') {
                duration = parseInt(currentCartOrder.duration.split('n')[1]) / 60;
            } else {
                console.log('This was the problem', currentCartOrder.duration);
                duration = currentCartOrder.duration;
            }
            Dfindtime2({
                variables: {
                    findTimesInput: {
                        day: currentCartOrder.date,
                        id: currentCartOrder.serviceId,
                        order: {
                            Duration: duration,
                        },
                    },
                },
            });

            // setValue(new Date(`${currentCartOrder.date} 13:00`));
        } else if (isCartBook && !isKHome) {
            let duration = 0;
            if (typeof currentCartOrder.duration != 'number') {
                duration = parseInt(currentCartOrder.duration.split('n')[1]) / 60;
            } else {
                console.log('This was the problem', currentCartOrder.duration);
                duration = currentCartOrder.duration;
            }
            Dfindtime({
                variables: {
                    findTimesInput: {
                        day: currentCartOrder.date,
                        id: currentCartOrder.serviceId,
                        order: {
                            Duration: duration,
                        },
                    },
                },
            });
        } else {
            findtime({
                variables: {
                    findTimesInput: {
                        day: AppointDate,
                        id: AppointOrder,
                    },
                },
            });

            // setValue(new Date(`${AppointDate} 13:00`));
        }
    }, [AppointDate, AppointOrder, findtime, giftOrBookNow, isBook, currentCartOrder]);
    const { t } = useTranslation('navbar');

    // const settingpm = useCallback(() => {
    //     setIsPm(true);
    //     console.log('PM');
    // });
    // const settingam = useCallback(() => {
    //     setIsPm(false);
    //     console.log('AM');
    // });

    const checking_if_it_is_available = (time) => {
        console.log('checking_if_it_is_available');
        console.log('CART,::', cart);
        let filtered_cart = cart.filter((item) => {
            console.log('ITEM - Date -', item.date);
            return item.date == currentCartOrder.date;
        });
        if (filtered_cart.length >= 1) {
            let filtered_time = time.filter((item1) => {
                let filtered_cart2 = filtered_cart.filter(
                    (item2) =>
                        item2.AppointTime == item1.time && item2.AppointRoom == item1.room
                );
                if (filtered_cart2.length >= 1) {
                    return false;
                } else {
                    return true;
                }
            });

            return filtered_time;
        } else {
            return time;
        }
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
    const TimeIsAvailable = (FTime) => {
        let date = new Date();
        let formatTime1 = date.toISOString().split('T')[0];

        if (giftOrBookNow != null && giftOrBookNow.date == formatTime1) {
            let hrs = date.getHours();
            let time_to_use = hrs + date.getMinutes() / 60;

            let filtered_obj = FTime.filter((item1) => item1.time > time_to_use);
            return filtered_obj;
        } else if (currentCartOrder != null && currentCartOrder.date == formatTime1) {
            let hrs = date.getHours();
            let time_to_use = hrs + date.getMinutes() / 60;
            let filtered_obj = FTime.filter((item1) => item1.time > time_to_use);
            console.log('FilteredObject----', filtered_obj);

            return filtered_obj;
        } else if (AppointDate != null && AppointDate === formatTime1) {
            let hrs = date.getHours();
            let time_to_use = hrs + date.getMinutes() / 60;

            let filtered_obj = FTime.filter((item1) => item1.time > time_to_use);
            return filtered_obj;
        } else {
            return FTime;
        }
    };
    // const morningTimeIsAvailable = () => {
    //     if (data) {
    //         let formatedTime = TimeIsAvailable(data.findTimes);
    //         let filterForCheck = formatedTime.filter((item) => item.time < 12);
    //         if (filterForCheck.length > 0) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     } else {
    //         let formatedTime = TimeIsAvailable(data2.DfindTimes);
    //         let filterForCheck = formatedTime.filter((item) => item.time < 12);
    //         if (filterForCheck.length > 0) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     }
    // };
    // const afternoonTimeIsAvailable = () => {
    //     if (data) {
    //         let formatedTime = TimeIsAvailable(data.findTimes);
    //         let filterForCheck = formatedTime.filter(
    //             (item) => item.time >= 12 && item.time < 17
    //         );
    //         if (filterForCheck.length > 0) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     } else {
    //         let formatedTime = TimeIsAvailable(data2.DfindTimes);
    //         let filterForCheck = formatedTime.filter(
    //             (item) => item.time >= 12 && item.time < 17
    //         );
    //         if (filterForCheck.length > 0) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     }
    // };
    // const eveningTimeIsAvailable = () => {
    //     if (data) {
    //         let formatedTime = TimeIsAvailable(data.findTimes);

    //         let filterForCheck = formatedTime.filter((item) => item.time > 17);

    //         if (filterForCheck.length > 0) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     } else {
    //         let formatedTime = TimeIsAvailable(data2.DfindTimes);

    //         let filterForCheck = formatedTime.filter((item) => item.time > 17);

    //         if (filterForCheck.length > 0) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     }
    // };
    // const endtime = (prop) => {
    //     let end_time = '';
    //     if (isBook) {
    //         end_time = formattime(prop + giftOrBookNow.duration);
    //     } else if (isCartBook) {
    //         let duration = 0;
    //         if (typeof currentCartOrder.duration != 'number') {
    //             duration = parseInt(currentCartOrder.duration.split('n')[1]) / 60;
    //         } else {
    //             duration = currentCartOrder.duration;
    //         }
    //         console.log('This was the problem', prop + duration);

    //         end_time = formattime(prop + duration);
    //     } else {
    //         end_time = formattime(prop + AppointDur);
    //     }
    //     return end_time;
    // };
    // // const display = (prop) => {
    // //     if (isMorn == 1) {
    // //         if (prop.time < 12) {
    // //             return true;
    // //         } else return false;
    // //     }
    // //     if (isMorn == 2) {
    // //         if (prop.time >= 12 && prop.time < 17) {
    // //             return true;
    // //         } else return false;
    // //     }
    // //     if (isMorn == 3) {
    // //         if (prop.time >= 17) {
    // //             return true;
    // //         } else return false;
    // //     }
    // // };
    // const display2 = (prop) => {
    //     if (isMorn == 1) {
    //         if (prop.time < 13) {
    //             return true;
    //         } else return false;
    //     }
    //     if (isMorn == 2) {
    //         if (prop.time >= 13 && prop.time < 15) {
    //             return true;
    //         } else return false;
    //     }
    //     if (isMorn == 3) {
    //         if (prop.time >= 15 && prop.time < 17) {
    //             return true;
    //         } else return false;
    //     }
    //     if (isMorn == 4) {
    //         if (prop.time >= 17 && prop.time < 19) {
    //             return true;
    //         } else return false;
    //     }
    //     if (isMorn == 5) {
    //         if (prop.time >= 19 && prop.time < 21) {
    //             return true;
    //         } else return false;
    //     }
    //     if (isMorn == 6) {
    //         if (prop.time >= 21) {
    //             return true;
    //         } else return false;
    //     }
    // };
    const set_time = (prop) => {
        setIsActive(prop);
    };

    // const removeEventListners = () => {
    //     pm.removeEventListener('click', settingpm);
    //     am.removeEventListener('click', settingam);
    // };

    const book_now = () => {
        setLoading(true);
        setTimeBookNow(isActive).then(() => setLoading(false));

        togglePickTime(false);
        togglePickDate(false);
    };
    const book = () => {
        setLoading(true);
        setTime(isActive).then(() => {
            setLoading(false);
            setConfirmed(true);
        });
        // alert('Your order has been Booked');

        //        closeAll();
        setNavTogContext(true);
    };

    const AddToCartOrder = () => {
        console.log('THIS---------------------------', isActive.time);
        setLoading(true);
        currentCartOrder.AppointTime = isActive.time;
        currentCartOrder.AppointRoom = isActive.room;
        setCurrentCartOrder(currentCartOrder);
        addToCart({ ...currentCartOrder });
        //.then(() => {

        // });setLoading(false);
        closeAll();
        setCartTogContext(true);

        //closeAll();
        //setNavTogContext(true);
    };
    const ifNoRoom = () => {
        var abc = false;
        data.findTimes.map((prop) => {
            if (prop.room != null) {
                abc = true;
            }
        });
        return abc;
    };
    const ifNoRoomCart = () => {
        var abc = false;
        data2.DfindTimes.map((prop) => {
            if (prop.room != null) {
                abc = true;
            }
        });
        return abc;
    };
    const ifNoRoomHome = () => {
        var abc = false;
        data3.DfindTimes3.map((prop) => {
            if (prop.room != null) {
                abc = true;
            }
        });
        return abc;
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
    // let pmButton2;
    // if (typeof window != 'undefined') {
    //     pmButton2 = document.querySelectorAll(
    //         '.PrivatePickersToolbar-root .MuiButtonBase-root'
    //     );
    // }
    // if (pmButton2) {
    //     console.log('Important', pmButton2);
    //     console.log(pm);
    //     console.log(am);

    //     pmButton2.forEach((element) => {
    //         if (
    //             element.children[0].innerHTML == 'PM' &&
    //             !pm &&
    //             element.offsetParent.style.transform == 'translateX(0px) translateZ(0px)'
    //         ) {
    //             setPm(element);
    //         } else if (
    //             element.children[0].innerHTML == 'AM' &&
    //             !am &&
    //             element.offsetParent.style.transform == 'translateX(0px) translateZ(0px)'
    //         ) {
    //             setAm(element);
    //         }
    //     });
    // }
    // if (pm && !eventListnerPm) {
    //     console.log('THIS IS PM', pm);
    //     pm.addEventListener('click', settingpm);
    //     setAddedEventListnerPm(true);
    // }
    // if (am && !eventListnerAm) {
    //     am.addEventListener('click', settingam);
    //     setAddedEventListnerAm(true);
    // }

    // const timeisAvailable = (timeValue) => {
    //     if ((timeValue / 10) % 1) return false;
    //     // !((timeValue / 10) % 1);

    //     let Hour = value.getHours();
    //     let thisHourTimes = data.findTimes.filter((item) => {
    //         if (Math.floor(item.time) == Hour && item.room != null) {
    //             if (Math.round((item.time - Math.floor(item.time)) * 60) == timeValue) {
    //                 return true;
    //             } else return false;
    //         }
    //     });
    //     if (thisHourTimes.length > 0) return true;
    //     else return false;
    // };

    // const hoursAreAvailable = (timeValue) => {
    //     let hour = timeValue;
    //     if (isPm && timeValue < 11) {
    //         hour = timeValue + 12;
    //     }
    //     // isAm ? timeValue : timeValue + 12;
    //     // console.log(isAm, hour, timeValue);
    //     let available_time = data.findTimes.filter((item) => {
    //         return Math.floor(item.time) == hour && item.room != null;
    //     });
    //     if (available_time.length > 0) return true;
    //     else return false;
    // };

    // const timeisAvailable2 = (timeValue) => {
    //     if ((timeValue / 10) % 1) return false;
    //     // !((timeValue / 10) % 1);

    //     let Hour = value.getHours();
    //     let thisHourTimes = data2.DfindTimes.filter((item) => {
    //         if (Math.floor(item.time) == Hour && item.room != null) {
    //             if (Math.round((item.time - Math.floor(item.time)) * 60) == timeValue) {
    //                 return true;
    //             } else return false;
    //         }
    //     });
    //     if (thisHourTimes.length > 0) return true;
    //     else return false;
    // };

    // const hoursAreAvailable2 = (timeValue) => {
    //     // console.log('HOUR', timeValue);
    //     let hour = timeValue;
    //     if (isPm && timeValue < 11) {
    //         hour = timeValue + 12;
    //     } else if (!isPm && timeValue < 11) {
    //         hour = timeValue;
    //     }
    //     // console.log('HOUR2', hour, isPm);

    //     // isAm ? timeValue : timeValue + 12;
    //     // console.log(isAm, hour, timeValue);
    //     let available_time = data2.DfindTimes.filter((item) => {
    //         return Math.floor(item.time) == hour && item.room != null;
    //     });
    //     if (available_time.length > 0) return true;
    //     else return false;
    // };
    // // const useFullFormatHour = (timeS) => {
    // //     return Math.floor(timeS);
    // // };
    // // const useFullFormatMinute = (timeS) => {
    // //     return Math.round((timeS % 1) * 60);
    // // };
    // const setTimeFromPicker = (timeValue) => {
    //     console.log('timeValue', timeValue);
    //     // let time =
    //     //     parseInt(newValue.getHours()) +
    //     //     parseFloat((parseInt(newValue.getMinutes()) / 60).toFixed(3));
    //     // let room = '';
    //     let times = data.findTimes.filter((item) => {
    //         if (
    //             Math.floor(item.time) == parseInt(timeValue.getHours()) &&
    //             Math.round((item.time % 1) * 60) == parseInt(timeValue.getMinutes())
    //         ) {
    //             return true;
    //         }
    //     });
    //     console.log('times', times);
    //     setIsActive(times[0]);
    // };
    // const setTimeFromPicker2 = (timeValue) => {
    //     console.log('timeValue', timeValue);
    //     // let time =
    //     //     parseInt(newValue.getHours()) +
    //     //     parseFloat((parseInt(newValue.getMinutes()) / 60).toFixed(3));
    //     // let room = '';
    //     let times = data2.DfindTimes.filter((item) => {
    //         if (
    //             Math.floor(item.time) == parseInt(timeValue.getHours()) &&
    //             Math.round((item.time % 1) * 60) == parseInt(timeValue.getMinutes())
    //         ) {
    //             return true;
    //         }
    //     });
    //     console.log('times', times);
    //     setIsActive(times[0]);
    // };

    // const openingTime = () => {
    //     if (timing) {
    //         let hour = parseInt(timing.data.timing.OpeningTime.split(':')[0]);
    //         console.log(hour);
    //         let TimeStamp = new Date(
    //             isCartBook
    //                 ? currentCartOrder.date
    //                 : isBook
    //                 ? giftOrBookNow.date
    //                 : AppointDate
    //         ).setHours(
    //             hour,
    //             parseInt(timing.data.timing.OpeningTime.split(':')[1]),
    //             parseInt(timing.data.timing.OpeningTime.split(':')[2])
    //         );
    //         let openingTime2 = new Date(TimeStamp);
    //         console.log('openingt', openingTime2);
    //         return openingTime2;
    //     }
    // };

    // const closingTime = () => {
    //     if (timing) {
    //         let TimeStamp = new Date().setHours(
    //             parseInt(timing.data.timing.ClosingTime.split(':')[0]) - 1,
    //             // parseInt(timing.data.timing.ClosingTime.split(':')[1]) ,
    //             55,
    //             parseInt(timing.data.timing.ClosingTime.split(':')[2])
    //         );
    //         let closingTime2 = new Date(TimeStamp);
    //         console.log('openingt', closingTime2);
    //         return closingTime2;
    //     }
    // };

    const handleAmPm = (value) => {
        if (value && value !== '') {
            console.log('am,pm change', value);
            setHour('');
            setMinute('');
            setMinute2('');
            setIsActive(null);
            setAmPm(value);

            let listOfHours = [];

            for (let i = 0; i < 25; i++) {
                if (hoursAreAvailable(i, value, data ? 'data' : 'data2')) {
                    listOfHours.push({ label: formatTime(i), data: i });
                }
            }
            setHours(listOfHours);
        }
    };
    console.log(hours, data, data2);
    if (hours.length == 0 && (data || data2)) {
        console.log('getting Hours');
        if (data) {
            if (amPm != '' && data) {
                let listOfHours = [];

                for (let i = 0; i < 25; i++) {
                    if (hoursAreAvailable(i, amPm, 'data')) {
                        listOfHours.push({ label: formatTime(i), data: i });
                    }
                }
                setHours(listOfHours);
            }
        } else if (data2) {
            if (amPm != '' && data2) {
                let listOfHours = [];

                for (let i = 0; i < 25; i++) {
                    if (hoursAreAvailable(i, amPm, 'data2')) {
                        listOfHours.push({ label: formatTime(i), data: i });
                    }
                }
                setHours(listOfHours);
            }
        }
    }
    const handleHour = (value) => {
        if (value) {
            setHour(value);
            setMinute('');
            setMinute2('');
            setIsActive(null);
            let minutesValues = parseMinutes(value);
            setMinutes(minutesValues);
        }
    };

    const handleMinutes = (value) => {
        let index = minutes.findIndex((item) => item.label == value);
        console.log(minutes[index]);
        setMinute(minutes[index]);
        setMinute2(value);
        setIsActive(minutes[index].data);
    };

    if (timing.loading) return <CustomLoadingWrapper />;
    if (loading) return <CustomLoadingWrapper />;
    if (loading2) return <CustomLoadingWrapper />;
    if (loading3) return <CustomLoadingWrapper />;
    //if (data) <CustomLoadingWrapper />;

    console.log(screen.width);
    return (
        <>
            {isLoading && <CustomLoadingWrapper />}
            {confirmed ? (
                <OrderConfirm isToBook={true} />
            ) : (
                <div className={styles.container}>
                    <div className={styles.topBar}>
                        <Image
                            src='/images/back_arrow.svg'
                            alt='back'
                            width={28}
                            height={22}
                            onClick={() => togglePickTime(false)}
                        />
                        <h1
                            style={{
                                fontWeight: 'normal',
                            }}
                        >
                            {t('Pick Time')}
                        </h1>
                        <Image
                            src='/images/Cross.svg'
                            alt='close'
                            width={22}
                            height={22}
                            onClick={() => closeAll()}
                        />
                    </div>
                    {isLoading && <CustomLoadingWrapper />}
                    <div className={styles.flex}>
                        {isBook ? (
                            <h1>{convertISODatetoShortDate(giftOrBookNow.date)}</h1>
                        ) : isCartBook ? (
                            <h1>{convertISODatetoShortDate(currentCartOrder.date)}</h1>
                        ) : (
                            <h1>{convertISODatetoShortDate(AppointDate)}</h1>
                        )}
                    </div>
                    {data && timing && ifNoRoom() ? (
                        <div className={styles.flex}>
                            {/* <h4 style={{ marginBottom: '20px' }}>
                            {t('Choice part of day')}
                        </h4> */}
                            <div className={styles.TimePickerOver}>
                                <div
                                    style={{
                                        color: 'white',
                                        fontSize: '20px',
                                        marginTop: '30px',

                                        marginBottom: '40px',
                                    }}
                                >
                                    <p style={{ fontSize: '20px', letterSpacing: '2px' }}>
                                        {hour ? formatTime(hour) : '--'}:
                                        {minute ? minute.label : '-- '} {amPm}
                                    </p>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        width: '100%',
                                        // justifyContent: 'space-between',
                                    }}
                                >
                                    <div className={styles.timePickerAm}>
                                        <Select
                                            value={amPm}
                                            sx={
                                                screen.width >= 300 && screen.width <= 400
                                                    ? {
                                                          width: '100%',

                                                          maxWidth: '50px',
                                                          fontSize: '13px',
                                                      }
                                                    : { width: '100%', minWidth: '50px' }
                                            }
                                            onChange={(e) => {
                                                handleAmPm(e.target.value);
                                            }}
                                            label='Hours'
                                            displayEmpty
                                            // inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value={'am'}>am</MenuItem>
                                            <MenuItem value={'pm'}>pm</MenuItem>
                                        </Select>
                                    </div>
                                    <div className={styles.timePickerHourMin}>
                                        {hours && (
                                            <div
                                                className='hourSelector'
                                                style={{
                                                    marginRight: '10px',
                                                    width: '50%',
                                                }}
                                            >
                                                <Select
                                                    value={hour}
                                                    sx={
                                                        screen.width >= 1920
                                                            ? {
                                                                  width: '100%',

                                                                  //   minWidth: '135px',
                                                              }
                                                            : screen.width >= 400
                                                            ? {
                                                                  width: '100%',

                                                                  //   minWidth: '105px',
                                                              }
                                                            : screen.width >= 300
                                                            ? {
                                                                  width: '100%',

                                                                  //   maxWidth: '80px',
                                                                  fontSize: '13px',
                                                              }
                                                            : {
                                                                  width: '100%',

                                                                  //   maxWidth: '80px',
                                                              }
                                                    }
                                                    onChange={(e) => {
                                                        handleHour(e.target.value);
                                                    }}
                                                    displayEmpty
                                                    inputProps={{
                                                        'aria-label': 'Without label',
                                                    }}
                                                >
                                                    <MenuItem value={''}>
                                                        {' '}
                                                        {t('Hours')}
                                                    </MenuItem>
                                                    {hours.map((item) => [
                                                        <MenuItem
                                                            key={item.label + 150}
                                                            value={item.data}
                                                        >
                                                            {item.label}
                                                        </MenuItem>,
                                                    ])}
                                                </Select>
                                            </div>
                                        )}

                                        <div style={{ width: '50%' }}>
                                            <Select
                                                value={minute2}
                                                sx={
                                                    screen.width >= 1920
                                                        ? {
                                                              width: '100%',

                                                              //   minWidth: '135px',
                                                          }
                                                        : screen.width >= 400
                                                        ? {
                                                              width: '100%',

                                                              //   minWidth: '105px',
                                                          }
                                                        : screen.width >= 300
                                                        ? {
                                                              width: '100%',

                                                              //   maxWidth: '80px',
                                                              fontSize: '13px',
                                                          }
                                                        : {
                                                              width: '100%',

                                                              //   maxWidth: '80px',
                                                          }
                                                }
                                                onChange={(e) => {
                                                    handleMinutes(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{
                                                    'aria-label': 'Without label',
                                                }}
                                            >
                                                <MenuItem value={''}>
                                                    {' '}
                                                    {t('Minutes')}
                                                </MenuItem>
                                                {minutes &&
                                                    minutes.map((item) => [
                                                        <MenuItem
                                                            key={item.label + 150}
                                                            value={item.label}
                                                        >
                                                            {item.label}
                                                        </MenuItem>,
                                                    ])}
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {isBook ? (
                                <button
                                    onClick={() => book_now()}
                                    className={styles.btn}
                                    disabled={!isActive}
                                >
                                    {t('Confirm Time and Book Now')}
                                </button>
                            ) : (
                                <button
                                    onClick={() => book()}
                                    className={styles.btn}
                                    disabled={!isActive}
                                >
                                    {t('Confirm Time and Book')}
                                </button>
                            )}
                        </div>
                    ) : data2 && timing && ifNoRoomCart() ? (
                        <div className={styles.flex}>
                            {/* <h4>{t('Choice part of day')}</h4> */}
                            <div className={styles.TimePickerOver}>
                                <div
                                    style={{
                                        color: 'white',
                                        fontSize: '20px',
                                        marginTop: '30px',

                                        marginBottom: '40px',
                                    }}
                                >
                                    <p style={{ fontSize: '20px', letterSpacing: '2px' }}>
                                        {hour ? formatTime(hour) : '--'}:
                                        {minute ? minute.label : '-- '} {amPm}
                                    </p>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        width: '100%',
                                        // justifyContent: 'space-between',
                                    }}
                                >
                                    <div className={styles.timePickerAm}>
                                        <Select
                                            value={amPm}
                                            sx={
                                                screen.width >= 300 && screen.width <= 400
                                                    ? {
                                                          width: '100%',

                                                          maxWidth: '50px',
                                                          fontSize: '13px',
                                                      }
                                                    : { width: '100%', minWidth: '50px' }
                                            }
                                            onChange={(e) => {
                                                handleAmPm(e.target.value);
                                            }}
                                            label='Hours'
                                            displayEmpty
                                            // inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value={'am'}>am</MenuItem>
                                            <MenuItem value={'pm'}>pm</MenuItem>
                                        </Select>
                                    </div>
                                    <div className={styles.timePickerHourMin}>
                                        {hours && (
                                            <div
                                                className='hourSelector'
                                                style={{
                                                    width: '50%',
                                                    marginRight: '10px',
                                                }}
                                            >
                                                {console.log('22,', screen.width >= 400)}
                                                <Select
                                                    value={hour}
                                                    variant='outlined'
                                                    sx={
                                                        screen.width >= 1920
                                                            ? {
                                                                  width: '100%',

                                                                  //   minWidth: '135px',
                                                              }
                                                            : screen.width >= 400
                                                            ? {
                                                                  width: '100%',

                                                                  //   minWidth: '105px',
                                                              }
                                                            : screen.width >= 300
                                                            ? {
                                                                  width: '100%',

                                                                  //   maxWidth: '80px',
                                                                  fontSize: '13px',
                                                              }
                                                            : {
                                                                  width: '100%',

                                                                  //   maxWidth: '80px',
                                                              }
                                                    }
                                                    onChange={(e) => {
                                                        handleHour(e.target.value);
                                                    }}
                                                    displayEmpty
                                                    inputProps={{
                                                        'aria-label': 'Without label',
                                                    }}
                                                >
                                                    <MenuItem value={''}>
                                                        {t('Hours')}
                                                    </MenuItem>
                                                    {hours.map((item) => [
                                                        <MenuItem
                                                            key={item.label + 150}
                                                            value={item.data}
                                                        >
                                                            {item.label}
                                                        </MenuItem>,
                                                    ])}
                                                </Select>
                                            </div>
                                        )}

                                        <div style={{ width: '50%' }}>
                                            <Select
                                                value={minute2}
                                                sx={
                                                    screen.width >= 1920
                                                        ? {
                                                              width: '100%',

                                                              //   minWidth: '135px',
                                                          }
                                                        : screen.width >= 400
                                                        ? {
                                                              width: '100%',

                                                              //   minWidth: '105px',
                                                          }
                                                        : screen.width >= 300
                                                        ? {
                                                              width: '100%',

                                                              //   maxWidth: '80px',
                                                              fontSize: '13px',
                                                          }
                                                        : {
                                                              width: '100%',

                                                              //   maxWidth: '80px',
                                                          }
                                                }
                                                onChange={(e) => {
                                                    handleMinutes(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{
                                                    'aria-label': 'Without label',
                                                }}
                                            >
                                                <MenuItem value={''}>
                                                    {t('Minutes')}
                                                </MenuItem>
                                                {minutes &&
                                                    minutes.map((item) => [
                                                        <MenuItem
                                                            key={item.label + 150}
                                                            value={item.label}
                                                        >
                                                            {item.label}
                                                        </MenuItem>,
                                                    ])}
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isBook ? (
                                <button
                                    onClick={() => book_now()}
                                    className={styles.btn}
                                    disabled={!isActive}
                                >
                                    {t('Confirm Time and Book Now')}
                                </button>
                            ) : isCartBook ? (
                                <button
                                    onClick={AddToCartOrder}
                                    className={styles.btn}
                                    disabled={!isActive}
                                >
                                    {t('Confirm Time and Add to Cart')}
                                </button>
                            ) : (
                                <button
                                    onClick={() => book()}
                                    className={styles.btn}
                                    disabled={!isActive}
                                >
                                    {t('Confirm Time and Book')}
                                </button>
                            )}
                        </div>
                    ) : data3 && ifNoRoomHome() ? (
                        <div className={styles.flex}>
                            <h4>Choice time</h4>
                            <div className={styles.choosetod}>
                                {TimeIsAvailable(
                                    checking_if_it_is_available(data3.DfindTimes3)
                                ).map(
                                    (ftime, key) =>
                                        //<div key={key}>
                                        // &&
                                        // display(ftime)
                                        ftime.room &&
                                        ftime && (
                                            <div
                                                key={key}
                                                className={
                                                    isActive == ftime
                                                        ? `${styles.activetime}`
                                                        : `${styles.timechoicebtn}`
                                                }
                                                onClick={() => set_time(ftime)}
                                            >
                                                {console.log('THIS IS findTimes')}
                                                {formattime(ftime.time)}
                                                {/* -{' '}
                                            {endtime(ftime.time)} */}
                                            </div>
                                        )
                                    // </div>
                                )}
                            </div>

                            {isBook ? (
                                <button
                                    onClick={() => book_now()}
                                    className={styles.btn}
                                    disabled={!isActive}
                                >
                                    {t('Confirm Time and Book Now')}
                                </button>
                            ) : isCartBook ? (
                                <button
                                    onClick={AddToCartOrder}
                                    className={styles.btn}
                                    disabled={!isActive}
                                >
                                    {t('Confirm Time and Add to Cart')}
                                </button>
                            ) : (
                                <button
                                    onClick={() => book()}
                                    className={styles.btn}
                                    disabled={!isActive}
                                >
                                    {t('Confirm Time and Book')}
                                </button>
                            )}
                        </div>
                    ) : (
                        <h4>{t('No Rooms found. Choose another Date')}</h4>
                    )}
                </div>
            )}
        </>
    );
}

export default PickTime;
