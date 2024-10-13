import dynamic from 'next/dynamic';
import { useEffect } from 'react';
// import LoadingOverlay from 'react-loading-overlay';

const GoSell = dynamic(() => import('@tap-payments/gosell').then((mod) => mod.GoSell), {
    ssr: false,
});

// const GoSellStuff = (props) => {
const GoSellStuff = (props) => {
    const tempPOST = `${process.env.NEXT_PUBLIC_API_URL}/tap-callback`;
    const redirectURL = `${process.env.NEXT_PUBLIC_WEB_URL}/paymentsComplete`;
    const { callbackFunc, userDetails, transac, total, callbackonClose } = props;

    useEffect(() => {
        console.log('Opening Payments');
        if (transac && GoSell) {
            const GoSell = require('@tap-payments/gosell');
            GoSell.GoSell.openLightBox();
            // GoSell.GoSell.openPaymentPage();
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const gatewayConfig = {
        publicKey: process.env.NEXT_PUBLIC_TAP_PK,
        language: 'en',
        contactInfo: true,
        supportedCurrencies: ['KWD'],
        supportedPaymentMethods: ['KNET'],
        saveCardOption: true,
        customerCards: true,
        notifications: 'standard',
        backgroundImg: {
            opacity: '0.5',
        },
        callback: callbackFunc,
        onClose: callbackonClose,
        labels: {
            cardNumber: 'Card Number',
            expirationDate: 'MM/YY',
            cvv: 'CVV',
            cardHolder: 'Name on Card',
            actionButton: 'Pay',
        },
        style: {
            base: {
                color: '#535353',
                lineHeight: '18px',
                fontFamily: 'sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: 'rgba(0, 0, 0, 0.26)',
                    fontSize: '15px',
                },
            },
            invalid: {
                color: 'red',
                iconColor: '#fa755a ',
            },
        },
    };

    // handle names properly
    let email = '@';
    let first_name = '',
        middle_name = '',
        last_name = ' ';
    if (userDetails) {
        const { email: uEmail, username } = userDetails;
        const nameSplit = username.split(' ');

        email = uEmail;
        first_name = nameSplit[0];
        if (nameSplit.length > 2) {
            middle_name = nameSplit[1];
            last_name = nameSplit[2];
        } else {
            last_name = nameSplit[1];
        }
    }

    const customerConfig = {
        first_name,
        middle_name,
        last_name,
        email: email,
        phone: {
            country_code: '965',
            number: email.split('@')[0],
        },
    };

    const orderConfig = {
        amount: total,
        currency: 'KWD',
    };

    const transConfig = {
        mode: 'charge',
        charge: {
            saveCard: false,
            threeDSecure: true,
            description: `Transaction for Kingsley txn ${transac}`,
            statement_descriptor: null,
            reference: {
                transaction: transac,
            },
            receipt: {
                email: false,
                sms: true,
            },
            redirect: redirectURL,
            post: tempPOST,
        },
    };

    return (
        <>
            {transac && (
                <GoSell
                    gateway={gatewayConfig}
                    customer={customerConfig}
                    order={orderConfig}
                    transaction={transConfig}
                />
            )}
        </>
    );
};

export default GoSellStuff;
