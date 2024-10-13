import Head from 'next/head';
import { useRouter } from 'next/router';
import Product from '../components/product';
import { useQuery, gql } from '@apollo/client';
import CustomLoadingWrapper from '../components/CustomLoadingWrapper';

// const GET_SERVICE = gql`
//     query allRealServices {
//         realServices {
//             slug
//         }
//     }
// `;

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
    console.log(slug);
    if (loading) <CustomLoadingWrapper />;
    if (error) console.log('error');
    console.log(data);
    if (data?.realServices) {
        // switching data locale based on the current locale
        // console.log({ ...realServices[0] });
    }
    console.log('LOCALE', locale);
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
