import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import CardBig from './components/cardBig';
import { useQuery, gql } from '@apollo/client';
import CustomLoadingWrapper from './components/CustomLoadingWrapper';
import { initializeApollo } from '../GraphQL/apollo';
import { get_kingsley_homep } from '../GraphQL/queries';

const GET_PRODS = gql`
    query getGifts {
        realServices(where: { ServiceCategory: "Gifts" }, sort: "updated_at:desc") {
            id
            ServiceCategory
            ServiceName
            ServiceDesc
            ServiceSubcategory
            Promotion
            promoDesc
            slug
            ServiceImage {
                url
            }
            ServicePrices {
                Time
                Price
            }
        }
    }
`;

export default function Gifts() {
    const { loading, error, data } = useQuery(GET_PRODS);
    if (loading) <CustomLoadingWrapper />;
    if (error) console.log('error');
    const kingsleyPage = useQuery(get_kingsley_homep);
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
                    {kingsleyPage.data.kingsleyIsOn.Gifts ? (
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
    });
    return {
        props: {
            ...(await serverSideTranslations(locale, ['navbar', 'common'])),
            initialApolloState: apolloClient.cache.extract(),
            revalidate: 60,
        },
    };
};
