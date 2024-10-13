/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRouter } from 'next/router';

import { useContext, createContext, useState, useEffect, useMemo } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import cookie from 'js-cookie';
import {
    GET_ME,
    LOGIN_USER,
    REGISTER_USER_MOD,
    CREATE_ORDER,
    CREATE_TRANSACTION,
    BOOKROOM,
    CREATE_GIFT,
} from '../GraphQL/queries';
import getErrorIDfromStrapi from '../utils/getErrorID';
import { decode } from 'jsonwebtoken';
export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [IsLoggedIn, setIsLoggedIn] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [cart, setCart] = useState([]);
    const [currentCartOrder, setCurrentCartOrder] = useState(null);
    const [giftOrBookNow, setGiftOrBookNow] = useState(null);
    const [transactionid, setTransactionId] = useState(null);

    const router = useRouter();
    const [IsSignup, setIsSignup] = useState(true);
    const [AppointAddress, setAppointAddress] = useState(null);
    // Helper to help me go Sell
    const [transactionCtx, setTransactionCtx] = useState(null);
    const signup = async (value) => {
        setIsSignup(value);
    };
    const [booknow, { data }] = useMutation(BOOKROOM);
    // Lazy Query to get Self details
    const [
        getMe,
        {
            called: userDetailsCalled,
            loading: userDetailsLoading,
            error: userDetailsError,
            data: userDetailsData,
            startPolling: userDetailsStartPolling,
            stopPolling: userDetailsStopPolling,
        },
    ] = useLazyQuery(GET_ME, {
        pollInterval: 5000,
        onCompleted: () => {
            console.log('Starting to poll');
            userDetailsStartPolling(5000);
        },
        onError: () => {
            console.log('Stopping the poll');
            userDetailsStopPolling();
        },
    });

    // Need to handle the unused vars
    useEffect(() => {
        // load jwt from localstorage if exists
        const retCookie = cookie.get('token');
        if (retCookie) {
            console.log('Cookie :', retCookie);
            handlejwt(retCookie, false);
        }

        // load cart if it exists in cookies
        const cart = cookie.get('cart');
        if (!cart) return;
        const retCart = JSON.parse(cart);
        if (retCart && retCart.length > 0) {
            console.log('Cart Exists, reloading state');
            console.log('Cart from cookie:', retCart);
            setCart(retCart);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handlejwt(jwt, resetCookie = true) {
        console.log('Handling JWT:', jwt);
        if (resetCookie) {
            console.log('Regenned the cookie');
            cookie.set('token', jwt, { expires: 0.99 });
        }
        try {
            const normalisedExpiry = new Date(0);
            const expiration = decode(jwt).exp;
            normalisedExpiry.setUTCSeconds(expiration);
            if (normalisedExpiry.valueOf() <= new Date().valueOf()) {
                throw new Error('Token was expired');
            }
            console.log("JWT hasn't expired, logging in the user");
            setIsLoggedIn(true);
        } catch (err) {
            console.log(err);
            logoutUser();
        }
    }

    useEffect(() => {
        console.log(IsLoggedIn, 'status changed');
        async function fetchMe() {
            // await getMe();
        }
        if (IsLoggedIn) {
            // check if cookie with user info exists
            const user = cookie.get('user');
            fetchMe();
            if (user && user != 'undefined') {
                console.log('cookie exists, using that');
                if (userDetailsData?.self == user) {
                    try {
                        console.log(user);
                        setUserDetails(JSON.parse(user));
                    } catch (err) {
                        setUserDetails(null);
                        console.log(err);
                    }
                } else if (userDetailsData?.self) {
                    // Update the user
                    console.log('updating the user');
                    cookie.set('user', userDetailsData?.self);
                    setUserDetails(userDetailsData?.self);
                }
            } else {
                // check if it's a useless refresh
                if (user && JSON.stringify(user) === JSON.stringify(userDetails)) {
                    console.log('Skipping useless refresh');
                    return;
                }
                console.log('User is logged in');
                fetchMe().then(() => {
                    // console.log('User Details are :', JSON.stringify(userDetailsData));
                    if (userDetailsData) {
                        console.log('setting user deets to :', userDetailsData);
                        try {
                            cookie.set('user', userDetailsData.self);
                        } catch (error) {
                            console.log(error);
                        }
                        setUserDetails(userDetailsData.self);
                        router.reload();
                    } else {
                        console.error("User Data couldn't be fetched");
                    }
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [IsLoggedIn, userDetailsData]);

    const [loginUserMutation, { loading: loginLoading, error: loginError }] =
        useMutation(LOGIN_USER);

    const [registerUserMutation, { loading: registerLoading, error: registerError }] =
        useMutation(REGISTER_USER_MOD);

    const [createorder, { loading: orderLoading, error: orderError }] =
        useMutation(CREATE_ORDER);

    const [createtransaction, { loading: transLoading, error: transError }] =
        useMutation(CREATE_TRANSACTION);

    const [createGift, { loading: giftLoading, error: giftError }] =
        useMutation(CREATE_GIFT);

    const loginUser = async (identifier, password) => {
        await loginUserMutation({ variables: { loginInput: { identifier, password } } })
            .then(({ data }) => {
                console.log('Trying logging in with', data);
                if (!data) {
                    console.log('There was no Data');
                    logoutUser();
                    return;
                }
                console.log('Trying logging in with', data);
                handlejwt(data.login.jwt);
            })
            .catch((errors) => {
                const errorID = getErrorIDfromStrapi(errors, router);
                console.error(errorID);
                alert(errorID.message);
            });
    };

    const removeFromCart = (index) => {
        let cartTemp = cart;
        cartTemp.splice(index, 1);
        // console.log('Cart is', cartTemp);
        setCart([...cartTemp]);
        return;
    };

    const logoutUser = async () => {
        console.log('Trying to log out user');
        cookie.remove('token');
        cookie.remove('user');
        setCart([]);
        setIsLoggedIn(false);
        router.push('/');
    };
    const emptyCart = () => {
        if (cookie.get('cart')) {
            cookie.remove('cart');
        }
        setCart([]);
        return;
    };

    const registerUser = async (username, email, password, emailMarketing) => {
        await registerUserMutation({
            variables: {
                customRegisterInput: {
                    username: username,
                    email: email,
                    password: password,
                    marketingEmail: emailMarketing,
                },
            },
        })
            .then(({ data }) => {
                console.log('Registered for the user with', data);
                // Tell them to verify phone number
                alert('Please confirm your mobile number. sms sent');
                router.push('/');
                signup(true);
                return;
            })
            .catch((errors) => {
                console.log('THIS ERROR');
                console.error(errors);
                const errorID = getErrorIDfromStrapi(errors, router);
                console.error(errorID);
                alert(
                    errorID.message ==
                        'error.graphQLErrors[0].extensions.exception.data.message[0] is undefined'
                        ? 'Email Confirmation Not Available'
                        : errorID.message
                );
                router.push('/');
            });
    };

    const bookNow = async (order) => {
        if (typeof order.Amount != 'number') {
            alert('An Error occured. Please try again');
            router.reload();
        } else {
            setGiftOrBookNow(order);
            //convert order.slug to number
            try {
                order.slug = parseInt(order.slug);
                // remove 'min' from order.duration
                if (typeof order.duration === 'string') {
                    order.duration = order.duration.replace('min', '');
                    order.duration = parseInt(order.duration);
                    order.duration = order.duration / 60.0;
                }
            } catch (err) {
                console.error('Error in book now', err);
            }
            await createorder({
                variables: {
                    createOrderInput: {
                        data: {
                            Amount: order.Amount,
                            Duration: order.duration,
                            user: userDetails.id,
                            real_service: order.slug,
                            OrderAddress: AppointAddress,
                        },
                    },
                },
            })
                .then(({ data }) => {
                    console.log('THIS IS WHERE I SHOULD LOOK FOR');
                    console.log('The data is', data);
                    order.id = data.createOrder.order.id;
                })
                .catch((err) => {
                    console.log('Caught order error in order', err);
                    return;
                });
            setGiftOrBookNow(order);
            console.log('Booking now for', order);
        }
    };

    const setTimeBookNow = async (prop) => {
        let formated_time = '';
        if (prop.time % 1) {
            formated_time = Math.floor(prop.time) + ':' + (prop.time % 1) * 60 + ':00';
        } else formated_time = Math.floor(prop.time) + ':00:00';
        if (Math.floor(prop.time) < 10) {
            formated_time = '0' + formated_time;
        }
        giftOrBookNow.time = formated_time;
        giftOrBookNow.room = prop.room;
        setGiftOrBookNow(giftOrBookNow);
    };

    const addToCart = async (order, clear = false) => {
        console.log(order);
        if (clear === true) {
            setCart([]);
        } else {
            if (typeof order.Amount != 'number') {
                alert('An Error occured. Please try again');
                router.reload();
            } else {
                setCart([...cart, order]);
            }
            // setCart([...cart, order]);
        }
        console.log(cart);
    };

    const addToGiftorBook = (order) => {
        setGiftOrBookNow(order);
    };

    const createTransaction = async (arr, type, gifts) => {
        console.log('PROCESSING TRANSACTION:::');
        console.log('The order arr is ', arr);
        console.log('The gift arr is', gifts);
        console.log('The type arr is', type);
        const { data } = await createtransaction({
            variables: {
                createTransactionInput: {
                    data: {
                        gifts: gifts,
                        orders: arr,
                        orderType: type,
                    },
                },
            },
        }).catch((error) => {
            console.error(error);
            throw error;
        });

        console.log('Transaction complete with id ', data);
        return data;
    };

    const createGifts = async (type) => {
        // remove 'min' from order.duration
        let arr = [];

        const giftInfo = giftOrBookNow;
        console.log('++++++====================================-');
        console.log(giftInfo);
        if (
            giftInfo.serviceSubcategory != 'Club' &&
            giftInfo.serviceSubcategory != 'Product'
        ) {
            if (
                typeof giftInfo.duration == 'string' &&
                giftInfo.duration?.includes('min')
            ) {
                giftInfo.duration = giftInfo.duration.replace('min', '');
                giftInfo.duration = parseInt(giftInfo.duration);
                giftInfo.duration = giftInfo.duration / 60.0;
            } else {
                console.log('Gift is Clean', giftInfo);
            }
            await createGift({
                variables: {
                    createGiftInput: {
                        data: {
                            Amount: giftInfo.Amount,
                            real_service: giftInfo.slug,
                            user: userDetails.id,
                            Duration: giftInfo.duration,
                            recpNumber: giftInfo.recpNumber,
                            recpName: giftInfo.recpName,
                        },
                    },
                },
            })
                .then(({ data }) => {
                    console.log('Created Gift with id', data);
                    arr = [data.createGift.gift.id];
                })
                .catch((error) => {
                    console.error(error);
                    throw error;
                });
        } else if (giftInfo.serviceSubcategory === 'Club') {
            await createGift({
                variables: {
                    createGiftInput: {
                        data: {
                            Amount: giftInfo.Amount,
                            real_service: giftInfo.slug,
                            user: userDetails.id,
                            recpNumber: giftInfo.recpNumber,
                            recpName: giftInfo.recpName,
                        },
                    },
                },
            })
                .then(({ data }) => {
                    console.log('Created Gift with id', data);
                    arr = [data.createGift.gift.id];
                })
                .catch((error) => {
                    console.error(error);
                    throw error;
                });
        } else if (giftInfo.serviceSubcategory === 'Product') {
            await createGift({
                variables: {
                    createGiftInput: {
                        data: {
                            Amount: giftInfo.Amount,
                            real_service: giftInfo.slug,
                            user: userDetails.id,
                            recpNumber: giftInfo.recpNumber,
                            recpName: giftInfo.recpName,
                            recpAddress: giftInfo.recpAddress,
                            Area: giftInfo.Area,
                            Block: giftInfo.Block,
                        },
                    },
                },
            })
                .then(({ data }) => {
                    console.log('Created Gift with id', data);
                    arr = [data.createGift.gift.id];
                })
                .catch((error) => {
                    console.error(error);
                    throw error;
                });
        }

        // console.log('What even', arr);
        const { createTransaction: transacData } = await createTransaction([], type, arr);
        // Setting transaction to
        console.log('Creating Gift Transaction with ctx ', transacData.transaction.id);
        return transacData.transaction.id;
    };

    const createTransactionBook = async (type) => {
        const arr = [giftOrBookNow.id];
        console.log('GiftorBookNow::', giftOrBookNow);
        console.log('arr for book Now transac is', arr);
        await booknow({
            variables: {
                bookRoomInput: {
                    id: giftOrBookNow.id,
                    day: giftOrBookNow.date,
                    time: giftOrBookNow.time,
                    duration: giftOrBookNow.duration,
                    room: giftOrBookNow.room,
                },
            },
        }).catch((err) => console.error(err));
        console.log('Room booked');
        const { createTransaction: transacData } = await createTransaction(arr, type);
        console.log('Creating Transaction with ctx ', transacData.transaction.id);
        return transacData.transaction.id;
    };

    function formatTime(time) {
        let formated_time = '';
        if (time % 1) {
            formated_time =
                Math.floor(time) +
                ':' +
                Math.floor(Math.round((time % 1) * 60)) +
                ':00.00';
        } else formated_time = Math.floor(time) + ':00:00.00';
        if (Math.floor(time) < 10) {
            formated_time = '0' + formated_time;
        }
        return formated_time;
    }
    const CreateBookingForCart = async (order, id) => {
        await booknow({
            variables: {
                bookRoomInput: {
                    id: id,
                    day: order.date,
                    time: formatTime(order.AppointTime),
                    duration: order.duration,
                    room: order.AppointRoom,
                },
            },
        })
            .then((data) => {
                console.log('BOOKING CREATED', data);
                return;
            })
            .catch((err) => console.error(err));
    };
    const createorders = async (type) => {
        let arr = [];

        await Promise.all(
            cart.map(async (order) => {
                order.slug = parseInt(order.slug);
                // remove 'min' from order.duration
                if (order.duration === null) order.duration = 'min30';
                if (typeof order.duration === 'string') {
                    order.duration = order.duration.replace('min', '');
                    order.duration = parseInt(order.duration);
                    order.duration = order.duration / 60.0;
                }

                // if (order.OrderAddress) {
                await createorder({
                    variables: {
                        createOrderInput: {
                            data: {
                                Amount: order.Amount,
                                Duration: order.duration,
                                user: userDetails.id,
                                real_service: order.slug,
                                OrderAddress: order.OrderAddress,
                                Area: order.Area,
                                Block: order.Block,
                                Address: order.Address,
                                ChangeAddress: order.ChangeAddress,
                            },
                        },
                    },
                })
                    .then(async ({ data }) => {
                        console.log('The data is', data);
                        await CreateBookingForCart(order, data.createOrder.order.id);
                        arr.push(data.createOrder.order.id);
                        return;
                    })
                    .catch((err) => {
                        console.log('Caught order error in order', err);
                        return;
                    });
                // } else {
                //     await createorder({
                //         variables: {
                //             createOrderInput: {
                //                 data: {
                //                     Amount: order.Amount,
                //                     Duration: order.duration,
                //                     user: userDetails.id,
                //                     real_service: order.slug,
                //                     OrderAddress: AppointAddress,
                //                 },
                //             },
                //         },
                //     })
                //         .then(({ data }) => {
                //             console.log('The data is', data);
                //             arr.push(data.createOrder.order.id);
                //             return;
                //         })
                //         .catch((err) => {
                //             console.log('Caught order error in order', err);
                //             return;
                //         });
                // }
            })
        );
        // console.log('What even', arr);
        const { createTransaction: transacData } = await createTransaction(arr, type);
        // Setting transaction to
        console.log('Creating Transaction with ctx ', transacData.transaction.id);
        return transacData.transaction.id;
    };

    const createorders2 = async (type) => {
        let arr = [];

        await Promise.all(
            cart.map(async (order, index) => {
                order.slug = parseInt(order.slug);
                // remove 'min' from order.duration
                if (order.duration === null) order.duration = 'min30';
                if (typeof order.duration === 'string') {
                    order.duration = order.duration.replace('min', '');
                    order.duration = parseInt(order.duration);
                    order.duration = order.duration / 60.0;
                }

                // if (order.OrderAddress) {
                await createorder({
                    variables: {
                        createOrderInput: {
                            data: {
                                Amount: order.Amount,
                                Duration: order.duration,
                                user: userDetails.id,
                                real_service: order.slug,
                                OrderAddress: order.OrderAddress,
                                Area: order.Area,
                                Block: order.Block,
                                Address: order.Address,
                                ChangeAddress: order.ChangeAddress,
                            },
                        },
                    },
                })
                    .then(async ({ data }) => {
                        // console.log('The data is', data);
                        // await CreateBookingForCart(order, data.createOrder.order.id);
                        arr.push(data.createOrder.order.id);
                        order.id = data.createOrder.order.id;
                        setCart((Previous) => {
                            let newarr = [...Previous];
                            newarr[index] = order;
                            return newarr;
                        });
                        console.log('UPDATED THE CART -----', cart);
                        return;
                    })
                    .catch((err) => {
                        console.log('Caught order error in order', err);
                        return;
                    });
            })
        );
        // console.log('What even', arr);
        const { createTransaction: transacData } = await createTransaction(arr, type);
        // Setting transaction to
        console.log('Creating Transaction with ctx ', transacData.transaction.id);
        console.log('THIS CART__------', cart);
        let newCartArrForTrnx = [];
        cart.map((item) => {
            item.trnx = transacData.transaction.id;
            newCartArrForTrnx.push(item);
        });
        setCart(newCartArrForTrnx);
        return transacData.transaction.id;
    };
    const createBookingComplete = async () => {
        await Promise.all(
            cart.map(async (order) => {
                console.log('ORDER ID', order.id);
                await CreateBookingForCart(order, order.id);
            })
        );
    };

    useEffect(() => {
        console.log('Cart changed, setting cart to', cart);
        cookie.set('cart', cart);
    }, [cart]);

    const cartTotal = useMemo(() => {
        let total = 0;
        cart.map((order) => {
            total = order.Amount + total;
        });
        return total;
    }, [cart]);

    return (
        <AuthContext.Provider
            value={{
                userDetails,
                IsLoggedIn,
                giftOrBookNow,
                setGiftOrBookNow,
                loginUser,
                logoutUser,
                registerUser,
                bookNow,
                setTimeBookNow,
                addToCart,
                addToGiftorBook,
                createorders,
                removeFromCart,
                IsSignup,
                emptyCart,
                signup,
                createorders2,
                cart,
                cartTotal,
                transactionCtx,
                setAppointAddress,
                setTransactionCtx,
                createTransactionBook,
                createGifts,
                currentCartOrder,
                createBookingComplete,
                handlejwt,
                setCurrentCartOrder,
                setTransactionId,
                transactionid,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default function useAuth() {
    return useContext(AuthContext);
}
