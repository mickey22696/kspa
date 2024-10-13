import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PREFETCH_SEARCH, SEARCH } from '../GraphQL/queries';
import { useQuery } from '@apollo/client';
import styles from './components/cardBig.module.css';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { initializeApollo } from '../GraphQL/apollo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DebounceInput } from 'react-debounce-input';
import LoadingOverlay from 'react-loading-overlay';

// Search.propTypes = {
//     realServices: PropTypes.any.isRequired,
//     onClickOut: PropTypes.func,
// };

export default function Search() {
    const [isActive, setActive] = useState(false);
    const [isKey, setKey] = useState(null);
    const toggleClass = (prop) => {
        setActive(!isActive);
        setKey(prop);
    };
    const [keyword, setKeyword] = useState('');
    let arr = [];
    const { data, loading, error } = useQuery(SEARCH, {
        variables: {
            realServicesWhere: {
                ServiceName_contains: keyword,
            },
        },
    });
    if (error) {
        console.error(error);
    }
    arr = data;
    const { t } = useTranslation('common');
    return (
        <>
            <div>
                <div className={styles.cardBig}>
                    <div
                        style={{ marginBottom: 2 + 'rem' }}
                        className={styles.cardBig_col_alt}
                    >
                        <div className={styles.cardBig_name}>{t(`Search`)}</div>
                    </div>
                    <div className={styles.cardBig_hero}>
                        <div className='herodiv_img'>
                            <Image
                                src={'/images/Kingsley.png'}
                                alt='image'
                                layout={'fill'}
                                objectFit={'contain'}
                            />
                        </div>
                        <div className={styles.cardBig_col}>
                            <div className={styles.cardBig_name}>{t(`Search`)}</div>
                        </div>
                    </div>
                    <div className={styles.cardBig_c2}>
                        <div className={styles.cardBig_options}>
                            <div className={styles.search}>
                                <DebounceInput
                                    value={keyword}
                                    minLength={2}
                                    debounceTimeout={300}
                                    type='text'
                                    placeholder='Search here'
                                    onChange={(event) => setKeyword(event.target.value)}
                                />
                            </div>
                            {/* This is a really really really really really
                            hacky way to do this, please never do this in prod*/}
                            {loading && (
                                <button
                                    disabled
                                    style={{
                                        background: 'transparent',
                                        border: '0px',
                                    }}
                                >
                                    <LoadingOverlay
                                        active={true}
                                        spinner
                                        text={t('Searching...')}
                                    />
                                </button>
                            )}
                            {arr &&
                                arr.realServices.map((options) => (
                                    <Link
                                        key={options.id}
                                        as={`/products/${options.slug}`}
                                        href='/products/[slug]'
                                        passHref
                                    >
                                        <motion.div
                                            whileHover={{
                                                scale: 1.03,
                                                backgroundColor: '#ffffff3a',
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => toggleClass(options.id)}
                                            className={
                                                isActive && isKey == options.id
                                                    ? `${styles.btnactive}`
                                                    : null
                                            }
                                        >
                                            <div>{options.ServiceName}</div>
                                        </motion.div>
                                    </Link>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export const getStaticProps = async ({ locale }) => {
    const apolloClient = initializeApollo();
    await apolloClient.query({
        query: PREFETCH_SEARCH,
    });
    return {
        props: {
            ...(await serverSideTranslations(locale, ['navbar', ['common']])),
            initialApolloState: apolloClient.cache.extract(),
            revalidate: 60,
        },
    };
};
