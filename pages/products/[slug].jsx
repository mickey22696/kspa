import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { initializeApollo } from '../../GraphQL/apollo';
import Product from '../components/product';
import { useQuery, gql } from '@apollo/client';
import CustomLoadingWrapper from '../components/CustomLoadingWrapper';
// import ProductD from '../components/ProductD';

const GET_SERVICE = gql`
    query allRealServices {
        realServices {
            slug
        }
    }
`;

const GET_PRODS = gql`
    query getService($abc: String!) {
        realServices(where: { slug: $abc }) {
            id
            ServiceCategory
            ServiceSubcategory
            ServiceName
            ServiceDesc
            slug
            clubCredit
            ServicePrices {
                Time
                Price
            }
            locale
            localizations {
                locale
                ServiceName
                ServiceDesc
            }
            ServiceImage {
                url
            }
        }
    }
`;
export default function Prod({ locale }) {
    const router = useRouter();
    const { slug } = router.query;
    const { loading, error, data } = useQuery(GET_PRODS, {
        variables: { abc: slug },
    });
    // if (typeof window !== 'undefined') {
    //     console.log('routing');
    //     router.push(`/productsD/${router.asPath.split('/')[2]}`);
    // }
    if (router.isFallback) {
        console.log('FALLBACKING');
        console.log('AS PATH', router.asPath);
        if (typeof window !== 'undefined') {
            console.log('THIS IS  WORKING');

            router.push(`/productsD/${router.asPath.split('/')[2]}`);
        }
        console.log('THIS IS not WORKING');
    }
    if (loading) <CustomLoadingWrapper />;
    if (error) console.log('error');
    // if (data?.realServices) {
    //     // switching data locale based on the current locale
    //     // console.log({ ...realServices[0] });
    // }
    return (
        <div id='hero'>
            <Head>
                <title>Kingsley</title>
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <meta name='description' content='description' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            {data?.realServices && (
                <Product props={{ ...data?.realServices[0] }} locale={locale === 'ar'} />
            )}
        </div>
    );
}

export const getStaticProps = async ({ locale, params }) => {
    const apolloClient = initializeApollo();
    console.log(`Rendering prods with params ${JSON.stringify(params)}`);

    await apolloClient.query({
        query: GET_PRODS,
        variables: { abc: params.slug },
    });

    return {
        props: {
            ...(await serverSideTranslations(locale, ['navbar', ['common']])),
            initialApolloState: apolloClient.cache.extract(),
            locale: locale,
        },
        revalidate: 30,
    };
};

export async function getStaticPaths({ locales }) {
    const apolloClient = initializeApollo();

    const { data } = await apolloClient.query({
        query: GET_SERVICE,
    });

    console.log(`Rendering prod paths for ${JSON.stringify(locales)}`);
    const paths = locales.reduce(
        (acc, next) => [
            ...acc,
            ...data?.realServices.map((service) => ({
                params: {
                    slug: service.slug,
                },
                locale: next,
            })),
        ],
        []
    );

    return {
        paths,
        fallback: true,
    };
}
