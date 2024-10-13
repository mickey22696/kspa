import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import CardBig from './components/cardBig';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_PRODS, get_kingsley_homep } from '../GraphQL/queries';
import CustomLoadingWrapper from './components/CustomLoadingWrapper';
import { initializeApollo } from '../GraphQL/apollo';
import { useEffect } from 'react';

export default function Kingsley_home() {
    const router = useRouter();
    useEffect(() => {
        console.log('Router is:', router);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const { loading, error, data } = useQuery(GET_PRODS, {
        variables: {
            ServiceCategory: 'Kingsley_Home',
        },
    });

    if (loading) <CustomLoadingWrapper />;
    if (error) console.log('error');

    const kingsleyPage = useQuery(get_kingsley_homep);
    console.log(kingsleyPage);
    if (kingsleyPage.loading) <CustomLoadingWrapper />;
    if (kingsleyPage.error) console.log('error');

    return (
        <div id='hero' className='hero'>
            <Head>
                <title>Kingsley</title>
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <meta name='description' content='description' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            {kingsleyPage.data && (
                <>
                    {kingsleyPage.data.kingsleyIsOn.Kingsley_Home ? (
                        <>
                            {data && (
                                <CardBig
                                    key={data.realServices.id}
                                    prods={data.realServices}
                                />
                            )}
                        </>
                    ) : null}
                </>
            )}
        </div>
    );
}
export const getStaticProps = async ({ locale }) => {
    const apolloClient = initializeApollo();
    await apolloClient.query({
        query: GET_PRODS,
        variables: {
            ServiceCategory: 'Kingsley_Home',
        },
    });
    return {
        props: {
            ...(await serverSideTranslations(locale, ['navbar', 'common'])),
            initialApolloState: apolloClient.cache.extract(),
            revalidate: 60,
        },
    };
};
