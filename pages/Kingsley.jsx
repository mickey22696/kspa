import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import CardBig from './components/cardBig';
import { useQuery } from '@apollo/client';
// import { useRouter } from 'next/router';
import { GET_PRODS, get_kingsley_homep } from '../GraphQL/queries';
import CustomLoadingWrapper from './components/CustomLoadingWrapper';
import { initializeApollo } from '../GraphQL/apollo';

export default function Kingsley({ locale }) {
    // const router = useRouter();
    const { loading, error, data } = useQuery(GET_PRODS, {
        variables: {
            ServiceCategory: 'Kingsley',
        },
    });
    const kingsleyPage = useQuery(get_kingsley_homep);

    if (loading) return <CustomLoadingWrapper />;
    if (error) console.log('error');

    if (kingsleyPage.loading) return <CustomLoadingWrapper />;
    if (kingsleyPage.error) console.log('error');

    return (
        <div id='hero'>
            <Head>
                <title>Kingsley</title>
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <meta name='description' content='description' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            {kingsleyPage.data && (
                <>
                    {kingsleyPage.data.kingsleyIsOn.Kingsley ? (
                        <>
                            {data && (
                                <CardBig
                                    prods={data.realServices}
                                    locale={locale === 'ar'}
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
            ServiceCategory: 'Kingsley',
        },
    });
    return {
        props: {
            ...(await serverSideTranslations(locale, ['navbar', 'common'])),
            initialApolloState: apolloClient.cache.extract(),
            locale: locale,
            revalidate: 60,
        },
    };
};
