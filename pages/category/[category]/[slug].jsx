import Head from 'next/head';
import { useRouter } from 'next/router';
import CardBigCat from '../../components/cardBigCat';
import { useQuery, gql } from '@apollo/client';
import CustomLoadingWrapper from '../../components/CustomLoadingWrapper';

// const GET_SERVICE = gql`
//     query GetRealServiceCatPairs {
//         realServices {
//             ServiceSubcategory
//             ServiceCategory
//         }
//     }
// `;

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
