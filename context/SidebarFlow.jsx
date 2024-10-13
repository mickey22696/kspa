import { useContext, createContext, useState } from 'react';
import { BOOKROOM } from '../GraphQL/queries';
import { useMutation } from '@apollo/client';
export const SideContext = createContext();
export function SideProvider({ children }) {
    const [forceFetch, setForceFetch] = useState(false);
    const [AppointDate, setAppointDate] = useState(null);
    const [AppointTime, setAppointTime] = useState(null);
    const [AppointDur, setAppointDur] = useState(null);
    const [AppointAmt, setAppointAmt] = useState(null);
    const [AppointOrder, setAppointOrder] = useState(null);
    const [AppointRoom, setAppointRoom] = useState(null);
    const [navTogCon, setNavTogCon] = useState(false);
    const [cartTogCon, setCartTogCon] = useState(false);

    const [booknow, { data }] = useMutation(BOOKROOM);
    if (data) {
        console.log(data);
    }
    let formated_time = '';
    const setDate = (prop) => {
        setAppointDate(prop);
    };
    const setTime = async (prop) => {
        console.log('settingTime', prop);
        if (prop.time % 1) {
            formated_time =
                Math.floor(prop.time) +
                ':' +
                Math.floor(Math.round((prop.time % 1) * 60)) +
                ':00.00';
            console.log('formatedTime', formated_time);
        } else formated_time = Math.floor(prop.time) + ':00:00';
        if (Math.floor(prop.time) < 10) {
            formated_time = '0' + formated_time;
        }
        console.log('formatedTimeFinal', formated_time);

        // formated_time = JSON.stringify(formated_time);
        setAppointTime(formated_time);
        setAppointRoom(prop.room);
        console.log(
            prop.time,
            formated_time,
            AppointOrder,
            AppointDate,
            AppointTime,
            AppointDur,
            AppointRoom
        );
        await booknow({
            variables: {
                bookRoomInput: {
                    id: AppointOrder,
                    day: AppointDate,
                    time: formated_time,
                    duration: AppointDur,
                    room: prop.room,
                    // address: AppointAddress,
                },
            },
        });

        return null;
    };
    const setOrder = (prop) => {
        setAppointDur(prop.Duration);
        setAppointOrder(prop.id);
        setAppointAmt(prop.Amount);
    };

    const setNavTogContext = (prop) => {
        setNavTogCon(prop);
    };
    const setCartTogContext = (prop) => {
        setCartTogCon(prop);
    };

    const [pickdate, setPickdate] = useState(false);
    const [picktime, setPickTime] = useState(false);
    const [isInfo, setIsInfo] = useState(true);
    const [isUpcoming, setIsUpcoming] = useState(true);
    const [isPaymentMethod, setIsPaymentMethod] = useState(false);
    const [isGift, setIsGift] = useState(false);
    const [isBook, setIsBook] = useState(false);
    const [isCartBook, setIsCartBook] = useState(false);
    const [isKHome, setIsKHome] = useState(false);
    const toggleKHome = (prop) => {
        setIsKHome(prop);
    };
    const toggleClass = (prop) => {
        setIsInfo(prop);
    };
    const toggleUpcoming = (prop) => {
        setIsUpcoming(prop);
    };
    const togglePickDate = (prop) => {
        setPickdate(prop);
    };
    const togglePickTime = (prop) => {
        setPickTime(prop);
    };
    const togglePaymentMethod = (prop) => {
        setIsPaymentMethod(prop);
    };
    const toggleGift = (prop) => {
        setIsGift(prop);
    };
    const toggleBook = (prop) => {
        setIsBook(prop);
        setPickdate(prop);
    };
    const toggleCartBook = (prop) => {
        setIsCartBook(prop);
        setPickdate(prop);
    };
    const closeAll = () => {
        toggleKHome(false);
        toggleGift(false);
        toggleBook(false);
        toggleCartBook(false);
        setIsInfo(true);
        setIsUpcoming(true);
        setPickdate(false);
        setPickTime(false);
        setIsPaymentMethod(false);
        setNavTogCon(false);
        setCartTogContext(false);
    };

    return (
        <SideContext.Provider
            value={{
                AppointDur,
                AppointAmt,
                AppointDate,
                AppointOrder,
                AppointTime,
                AppointRoom,
                pickdate,
                isInfo,
                isGift,
                isUpcoming,
                isPaymentMethod,
                picktime,
                navTogCon,
                cartTogCon,
                isBook,
                forceFetch,
                isKHome,
                isCartBook,
                toggleKHome,
                toggleBook,
                togglePickDate,
                toggleClass,
                toggleUpcoming,
                togglePickTime,
                togglePaymentMethod,
                toggleGift,
                setIsInfo,
                setDate,
                setTime,
                setOrder,
                setNavTogContext,
                setCartTogContext,
                closeAll,
                setForceFetch,
                toggleCartBook,
            }}
        >
            {children}
        </SideContext.Provider>
    );
}
export default function useSide() {
    return useContext(SideContext);
}
