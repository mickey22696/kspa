import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { get_kingsley_homep, GET_PRODS_INDEX } from '../GraphQL/queries';
import { motion } from 'framer-motion';
import CustomLoadingWrapper from './components/CustomLoadingWrapper';
import { initializeApollo } from '../GraphQL/apollo';
import { useRouter } from 'next/dist/client/router';

const PWAPrompt = dynamic(() => import('react-ios-pwa-prompt'), {
    ssr: false,
});

export default function Home() {
    const { t } = useTranslation('common');
    const prod_index = useQuery(GET_PRODS_INDEX);
    const { loading, error, data } = useQuery(get_kingsley_homep);
    const router = useRouter();

    if (prod_index.loading) return <CustomLoadingWrapper />;
    if (prod_index.error) console.log('error');

    if (loading) return <CustomLoadingWrapper />;
    if (error) console.log('error');
    let kingsleyData = [];
    if (data) {
        Object.keys(data.kingsleyIsOn).map((key) => {
            if (data.kingsleyIsOn[key] == true) {
                kingsleyData.push(key);
            }
        });
    }
    if (kingsleyData.length == 1) {
        router.push(`/${kingsleyData[0]}`);
    }

    return (
        <div id='hero' className='hero'>
            <Head>
                <title>Kingsley</title>
            </Head>
            {prod_index.data && data && (
                <div id='herorow' className='herorow'>
                    {prod_index.data.realServicesConnection.groupBy.ServiceCategory.slice(
                        0
                    )
                        .reverse()
                        .map((service) => (
                            <>
                                {data && (
                                    <>
                                        {console.log(data.kingsleyIsOn[service.key])}
                                        {data.kingsleyIsOn[service.key] ? (
                                            <Link
                                                key={`${service.key}`}
                                                href={`/${encodeURIComponent(
                                                    service.key
                                                )}`}
                                                passHref
                                            >
                                                <motion.div
                                                    whileTap={{ scale: 0.98 }}
                                                    className='herodiv'
                                                >
                                                    <div className='herodiv_img'>
                                                        <Image
                                                            src={`/images/${service.key}.png`}
                                                            alt='Home'
                                                            layout={'fill'}
                                                            objectFit={'contain'}
                                                        />
                                                    </div>
                                                    <div className='herodiv_col'>
                                                        <div
                                                            className={
                                                                router.locale == 'ar'
                                                                    ? 'hero_name_ar'
                                                                    : 'hero_name'
                                                            }
                                                        >
                                                            {t(`${service.key}`)}
                                                        </div>
                                                        <div
                                                            className='hero_desc'
                                                            dir={
                                                                router.locale == 'ar'
                                                                    ? 'rtl'
                                                                    : 'ltr'
                                                            }
                                                        >
                                                            {t(`desc${service.key}`)}
                                                        </div>
                                                        <Image
                                                            src='/images/arrow.png'
                                                            alt='arrow'
                                                            width={30}
                                                            height={15}
                                                        />
                                                    </div>
                                                </motion.div>
                                            </Link>
                                        ) : null}
                                    </>
                                )}
                            </>
                        ))}
                </div>
            )}
            <PWAPrompt />
        </div>
    );
}

export const getStaticProps = async ({ locale }) => {
    const apolloClient = initializeApollo();
    await apolloClient.query({
        query: GET_PRODS_INDEX,
    });
    await apolloClient.query({
        query: get_kingsley_homep,
    });
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar'])),
            initialApolloState: apolloClient.cache.extract(),
            revalidate: 60,
        },
    };
};
