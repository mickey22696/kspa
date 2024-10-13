import { useState } from 'react';
import useAuth from '../../context/useAuth';
import useSide from '../../context/SidebarFlow';
import { useRouter } from 'next/router';

const PaymentComp = ({ children, className }) => {
    const router = useRouter();
    const { isBook, isGift } = useSide();
    const { createTransactionBook, createorders2, setTransactionCtx, createGifts } =
        useAuth();
    const [loading, setLoading] = useState(false);

    const clicker = () => {
        if (isBook) {
            processBookNow();
            return;
        }
        if (isGift) {
            processGift();
            return;
        }
        processCart();
    };

    function processBookNow() {
        setLoading(true);
        console.log('BookNow');
        createTransactionBook('online').then((trnx) => {
            console.log('This trans for alt booking', trnx);
            setTransactionCtx(trnx);
            if (trnx !== null) {
                setTimeout(() => {
                    const query = { trnx };
                    const url = { pathname: '/payments', query };
                    // const urlAs = { pathname: '/payments', query };
                    router.push(url);
                    setLoading(false);
                }, 500);
            }
            console.log('Moving on');
        });
    }

    function processCart() {
        setLoading(true);
        console.log('Cart');
        createorders2('online').then((trnx) => {
            console.log('This trans', trnx);
            setTransactionCtx(trnx);
            if (trnx !== null) {
                setTimeout(() => {
                    const query = { trnx };
                    const url = { pathname: '/payments', query };
                    // const urlAs = { pathname: '/payments', query };
                    router.push(url);
                    setLoading(false);
                }, 500);
            }
            console.log('Moving on');
        });
    }

    function processGift() {
        setLoading(true);
        console.log('Gift');
        createGifts('online').then((trnx) => {
            console.log('This trans', trnx);
            setTransactionCtx(trnx);
            if (trnx !== null) {
                setTimeout(() => {
                    const query = { trnx };
                    const url = { pathname: '/payments', query };
                    // const urlAs = { pathname: '/payments', query };
                    router.push(url);
                    setLoading(false);
                }, 500);
            }
            console.log('Moving on');
        });
    }

    return (
        <>
            <button className={className} onClick={clicker}>
                {loading ? 'Loading...' : children}
            </button>
        </>
    );
};

export default PaymentComp;
