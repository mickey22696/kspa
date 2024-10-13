import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../components/cardBig.module.css';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import router from 'next/router';
// import { getRoomBlock } from '../../GraphQL/queries';
// import { useQuery } from '@apollo/client';
// import CustomLoadingWrapper from './CustomLoadingWrapper';
// import { isFirstDayOfMonth } from 'date-fns';

export default function CardBigCat({ props, locale }) {
    const [isActive, setActive] = useState(false);
    const [isKey, setKey] = useState(null);
    // const { loading, error, data } = useQuery(getRoomBlock);
    const toggleClass = (prop) => {
        setActive(!isActive);
        setKey(prop);
    };

    const { t } = useTranslation('common');
    // if (loading) return <CustomLoadingWrapper />;
    // if (error) console.error(error);

    // if (data) {
    //     console.log('_-----=========---------');
    //     console.log(data);
    // }
    const translating_number = (value) => {
        let value_str = JSON.stringify(value);
        let translated_Value = '';
        console.log('THIS');
        for (let i = 0; i < value_str.length; i++) {
            translated_Value += t(value_str[i]);
        }
        console.log(translated_Value);
        return translated_Value;
    };
    return (
        <>
            {props && (
                <div>
                    <div className={styles.cardBig}>
                        <div className={styles.cardBig_col_alt}>
                            <div className={styles.cardBig_name}>
                                {t(`${props.realServices[0].ServiceSubcategory}`)}
                            </div>
                            <div className={styles.hero_desc} style={{ height: '15px' }}>
                                {/* {t('Some Description here...')} */}
                            </div>
                        </div>
                        <div className={styles.cardBig_hero}>
                            <div className={styles.herodiv_img}>
                                <Image
                                    src={
                                        props.realServices[0].ServiceImage
                                            ? props.realServices[0].ServiceImage.url
                                            : '/images/Kingsley.png'
                                    }
                                    alt='image'
                                    layout={'fill'}
                                    objectFit={'cover'}
                                />
                            </div>
                            <div className={styles.cardBig_col}>
                                <div className={styles.cardBig_name}>
                                    {t(`${props.realServices[0].ServiceSubcategory}`)}
                                </div>
                                <div
                                    className={styles.hero_desc}
                                    style={{ height: '15px' }}
                                >
                                    {/* {t('Some Description here...')} */}
                                </div>
                            </div>
                        </div>
                        <div className={styles.cardBig_c2}>
                            <div className={styles.cardBig_options}>
                                {props.realServices.map((options) => (
                                    <Link
                                        as={`/products/${encodeURIComponent(
                                            options.slug
                                        )}`}
                                        href='/products/[slug]'
                                        passHref
                                        key={options.id}
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
                                            <div className={styles.cardBig_options_test}>
                                                <p>
                                                    {' '}
                                                    {locale &&
                                                    options?.localizations[0]?.ServiceName
                                                        ? options.localizations[0]
                                                              .ServiceName
                                                        : options.ServiceName}
                                                </p>
                                                <p className={styles.cardBig_price}>
                                                    <span
                                                        style={
                                                            router.locale == 'ar'
                                                                ? {
                                                                      fontSize: '15px',
                                                                      marginLeft: '4px',
                                                                  }
                                                                : {
                                                                      fontSize: '15px',
                                                                      marginRight: '2px',
                                                                  }
                                                        }
                                                    >
                                                        {t('From')}
                                                    </span>
                                                    {translating_number(
                                                        options?.ServicePrices[0]?.Price
                                                    )}{' '}
                                                    {t('kwd')}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
