import dynamic from 'next/dynamic';
import { useState } from 'react';
import ClientOnlyPortal from './components/ClientOnlyPortal';
import useAuth from '../context/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CustomLoadingWrapper from './components/CustomLoadingWrapper';
import cookie from 'js-cookie';

const GoSell = dynamic(
    () => {
        return import('./components/goSellStuff');
    },
    { ssr: false }
);

export default function Payments() {
    const router = useRouter();
    const [total, setTotal] = useState(null);
    const { trnx: transac } = router.query;
    const { userDetails, IsLoggedIn } = useAuth();
    const [ready, setReady] = useState(false);

    const sellProps = {
        callbackonClose,
        callbackFunc,
        userDetails,
        transac,
        total,
    };

    useEffect(() => {
        if (IsLoggedIn && userDetails && transac) {
            console.log('Logged in is True:', userDetails);
            // fetch the transaction amount
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${transac}`)
                .then((res) => res.json())
                .then(
                    (result) => {
                        setReady(true);
                        setTotal(result.TransactionAmount);
                    },
                    (error) => {
                        setReady(false);
                        console.error(error);
                        router.push('/');
                    }
                );
            console.log('SellProps are', sellProps);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [IsLoggedIn, userDetails, transac]);

    function callbackFunc(callback) {
        console.log(callback);
    }

    function callbackonClose() {
        // console.log();
        // call the mutation for voiding the transaction now
        // might be a bit problematic is the user has already paid the order
        // as we can then void the transaction even though it has been already paid
        cookie.set('cart', []);
        router.push('/');
    }

    return (
        <>
            {ready ? (
                <ClientOnlyPortal selector='#__next'>
                    <GoSell {...sellProps} />
                </ClientOnlyPortal>
            ) : (
                <CustomLoadingWrapper />
            )}
        </>
    );
}
