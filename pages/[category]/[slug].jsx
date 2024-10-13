import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { initializeApollo } from '../../GraphQL/apollo';
import CardBigCat from '../components/cardBigCat';
import { useQuery, gql } from '@apollo/client';
import CustomLoadingWrapper from '../components/CustomLoadingWrapper';

const GET_SERVICE = gql`
    query GetRealServiceCatPairs {
        realServices {
            ServiceSubcategory
            ServiceCategory
        }
    }
`;

const GET_PRODS1 = gql`
    query getServiceByCatSlug($subcategory: String!, $category: String!) {
        realServices(
            where: { ServiceSubcategory: $subcategory, ServiceCategory: $category }
        ) {
            id
            ServiceCategory
            ServiceSubcategory
            slug
            ServiceName
            ServiceDesc
            localizations {
                ServiceName
                locale
                ServiceDesc
            }
            ServicePrices {
                Time
                Price
            }
            ServiceImage {
                url
            }
            Room {
                Room
            }
        }
    }
`;
export default function Massage({ locale }) {
    const router = useRouter();
    const {
        query: { category, slug },
    } = router;
    // We get to basically re-use the cache again here as we already got it when we generated this page
    const { loading, error, data } = useQuery(GET_PRODS1, {
        variables: {
            subcategory: slug,
            category: category,
        },
    });
    console.log('-------==============');
    if (data) {
        console.log(data);
    }
    if (router.isFallback) {
        console.log('FALLBACKING');
        console.log('AS PATH', router.asPath);
        if (typeof window !== 'undefined') {
            console.log('THIS IS  WORKING');

            router.push(
                `/category/${router.asPath.split('/')[1]}/${router.asPath.split('/')[2]}`
            );
        }
    }
    // Overlay Loading States
    if (loading) return <CustomLoadingWrapper />;
    if (error) console.log('error');
    return (
        <div id='hero'>
            <Head>
                <title>Kingsley</title>
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <meta name='description' content='description' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            {data && <CardBigCat props={{ ...data }} locale={locale === 'ar'} />}
        </div>
    );
}

export const getStaticProps = async ({ locale, params }) => {
    // console.log(locale);
    const apolloClient = initializeApollo();
    // Make the query at build time and store it int he Apollo Cache
    console.log(`Building for subcat: ${params?.slug} cat: ${params?.category}`);

    await apolloClient.query({
        query: GET_PRODS1,
        variables: {
            subcategory: params.slug,
            category: params.category,
        },
    });
    return {
        props: {
            ...(await serverSideTranslations(locale, ['navbar', ['common']])),
            initialApolloState: apolloClient.cache.extract(),
            locale: locale,
            revalidate: 30,
        },
    };
};

export async function getStaticPaths({ locales }) {
    const apolloClient = initializeApollo();
    const {
        data: { realServices },
    } = await apolloClient.query({
        query: GET_SERVICE,
    });
    const realServicesSet = [...new Set(realServices)];
    console.log('Real Services set:', realServicesSet.length);

    const paths = locales.reduce(
        (acc, next) => [
            ...acc,
            ...realServicesSet.map((service) => ({
                params: {
                    category: service.ServiceCategory,
                    slug: service.ServiceSubcategory,
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
