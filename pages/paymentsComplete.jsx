import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import ClientOnlyPortal from './components/ClientOnlyPortal';
import useAuth from '../context/useAuth';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import CustomLoadingWrapper from './components/CustomLoadingWrapper';

const GoSell = dynamic(
    () => {
        return import('./components/goSellStuff');
    },
    { ssr: false }
);

export default function Payments() {
    const router = useRouter();
    const { userDetails, cartTotal: total, cart, createBookingComplete } = useAuth();
    const transac = true;
    console.log('ROUTER PATHHHH', router.pathname);
    console.log('ROUTER PATHHHH', router.asPath);

    async function callbackFunc(callback) {
        console.log('callBack_func-----', callback);
    }
    async function callbackonClose(callback) {
        console.log('OnCloseCALLBACK-----', callback);
        router.push('/');
        return null;
    }

    const sellProps = {
        callbackonClose,
        callbackFunc,
        userDetails,
        transac,
        total,
    };
    useEffect(async () => {
        if (cart && cart[0]) {
            console.log('TRANSACTION ID', cart[0]);

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${cart[0].trnx}`)
                .then((res) => res.json())
                .then(async (result) => {
                    if (result.PaymentStatus == 'CAPTURED') {
                        await createBookingComplete();
                        cookie.set('cart', []);
                        alert(result.PaymentStatus == 'CAPTURED' ? 'Success' : 'Failed');
                        router.push('/');
                    } else {
                        cookie.set('cart', []);
                        alert(result.PaymentStatus == 'CAPTURED' ? 'Success' : 'Failed');
                        router.push('/');
                    }
                });
        } else if (router.asPath == '/paymentsComplete') {
            router.push('/');
        }
        // else if (transac) {
        //     console.log('INSIDE transac', transac);
        //     console.log('------', transactionCtx);
        //     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${transac}`)
        //         .then((res) => res.json())
        //         .then(async (result) => {
        //             if (result.PaymentStatus == 'CAPTURED') {
        //                 await createBookingComplete();
        //                 cookie.set('cart', []);
        //                 alert(result.PaymentStatus == 'CAPTURED' ? 'Success' : 'Failed');

        //                 router.push('/');
        //             } else {
        //                 cookie.set('cart', []);
        //                 alert(result.PaymentStatus == 'CAPTURED' ? 'Success' : 'Failed');

        //                 router.push('/');
        //             }
        //         });
        // }
    }, [cart]);
    // useEffect(() => {
    //     if (router.asPath == '/paymentsComplete') {
    //         // await createBookingComplete();
    //         // manually do this as contextapi is too slow for us!
    //         cookie.set('cart', []);
    //         // router.push('/');
    //         return null;
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [userDetails, setCart]);
    return (
        <>
            {/* {'TXN:' + JSON.stringify(transac)} */}
            {transac && !cart[0] && (
                <ClientOnlyPortal selector='#__next'>
                    {console.log('HELLO') /* {'TXN:' + JSON.stringify(transac)} */}

                    <GoSell {...sellProps} />
                </ClientOnlyPortal>
            )}
            {transac && cart[0] && (
                <>
                    <div className='hero'>
                        <h1>
                            <CustomLoadingWrapper />
                        </h1>
                    </div>
                </>
            )}
        </>
    );
}
