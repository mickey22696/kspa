import '../styles/normalize.css';
import '../styles/globals.css';
import { ApolloProvider } from '@apollo/client';
import { AnimatePresence, motion } from 'framer-motion';
import { appWithTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Script from 'next/script';
import { AuthProvider } from '../context/useAuth';
import { SideProvider } from '../context/SidebarFlow';
import { useApollo } from '../GraphQL/apollo';
import Navbar from './components/navbar';
import FloatingAB from './components/FloatingAB';
import CartSidebar from './compoundComponents/cartSidebar';
import LeftSidebar from './compoundComponents/leftSidebar';
import RegistrationSidebar from './compoundComponents/registrationSidebar';
import Layout from './components/layout';
import NextNprogress from 'nextjs-progressbar';
import * as gtag from '../lib/gtag';

function MyApp({ Component, pageProps, router }) {
    const client = useApollo(pageProps.initialApolloState);
    /**
     * Sidebar Items Start, this is a bad way of doing this, but it's needed
     * As we control the transitions in the _app itself, so we can't provide _app with context
     * without refactoring a large part of it....
     */
    const [leftSidebar, setLeftSidebar] = useState(false);
    const [userSidebar, setUserSidebar] = useState(false);
    const [cartSidebar, setCartSidebar] = useState(false);
    // The props for the leftsidebar
    const leftSidebarProps = {
        navToggle: leftSidebar,
        setNavToggle: setLeftSidebar,
        onRight: false,
    };
    // The props for the userSidebar
    const userSidebarProps = {
        navToggle: userSidebar,
        setNavToggle: setUserSidebar,
        onRight: true,
    };
    // The props for the cart sidebar
    const cartSidebarProps = {
        navToggle: cartSidebar,
        setNavToggle: setCartSidebar,
        onRight: true,
    };

    const navbarProps = {
        setNavToggle: setLeftSidebar,
        setUserToggle: setUserSidebar,
        setCartToggle: setCartSidebar,
    };

    useEffect(() => {
        const handleRouteChange = (url) => {
            gtag.pageview(url);
        };
        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);
    return (
        <>
            <Script
                strategy='afterInteractive'
                src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
            />
            <Script
                id='gtag-init'
                strategy='afterInteractive'
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
                }}
            />
            <ApolloProvider client={client}>
                <AuthProvider>
                    <Layout>
                        <LeftSidebar {...leftSidebarProps} />
                        <SideProvider>
                            <RegistrationSidebar {...userSidebarProps} />
                            <CartSidebar {...cartSidebarProps} />
                            <Navbar {...navbarProps} />
                            {/* Here lies the best loader that never was RIP loader */}
                            <NextNprogress
                                color='#FFFFFF80'
                                startPosition={0.3}
                                stopDelayMs={200}
                                height={3}
                                showOnShallow={true}
                            />
                            <AnimatePresence>
                                <motion.div
                                    key={router.route}
                                    initial='pageInitial'
                                    animate={
                                        leftSidebar | userSidebar | cartSidebar
                                            ? 'overlay'
                                            : 'pageAnimate'
                                    }
                                    variants={{
                                        pageInitial: {
                                            background: '',
                                            opacity: 0,
                                        },
                                        overlay: {
                                            opacity: 0.5,
                                            'pointer-events': 'none',
                                        },
                                        pageAnimate: {
                                            opacity: 1,
                                        },
                                    }}
                                >
                                    <div id='mainContainer'>
                                        <Component {...pageProps} />
                                    </div>
                                    <FloatingAB />
                                </motion.div>
                            </AnimatePresence>
                        </SideProvider>
                    </Layout>
                </AuthProvider>
            </ApolloProvider>
        </>
    );
}

MyApp.propTypes = {
    pageProps: PropTypes.shape({}),
    Component: PropTypes.elementType,
    router: PropTypes.object,
};

export default appWithTranslation(MyApp);
