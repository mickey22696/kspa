import Image from 'next/image';
import Link from 'next/link';
import styles from './cardBig.module.css';
import { useQuery, gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
// import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
// import { useState } from 'react';
import { motion } from 'framer-motion';
import CustomLoadingWrapper from './CustomLoadingWrapper';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Get_SubCategory_Images } from '../../GraphQL/queries';

CardBig.propTypes = {
    prods: PropTypes.any.isRequired,
};

const GET_PRODS = gql`
    query getService($sub: String) {
        realServicesConnection(where: { ServiceCategory: $sub }) {
            groupBy {
                ServiceSubcategory {
                    key
                }
            }
        }
    }
`;

export default function CardBig(props) {
    const [isActive, setActive] = useState(false);
    const [isKey, setKey] = useState(null);
    const router = useRouter();
    const toggleClass = (prop) => {
        setActive(!isActive);
        setKey(prop);
    };

    let temp = null;
    console.log('--21---');
    console.log(props);
    const { t } = useTranslation('common');
    if (props.prods) {
        temp = props.prods[0].ServiceCategory;
    }
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
    const { loading, error, data } = useQuery(GET_PRODS, {
        variables: { sub: temp },
    });
    const images = useQuery(Get_SubCategory_Images);
    let subCategoryHasProds = false;
    console.log('111111111');
    if (data) {
        console.log(data);
    }

    console.log('images', images);
    const get_image_url = (service) => {
        var checker = null;
        let found_an_image = false;
        props.prods.map((item) => {
            if (
                item.ServiceSubcategory === service &&
                item.ServiceImage &&
                !found_an_image
            ) {
                if (images.data && images.data.categoryImage[service]) {
                    checker = images.data && images.data.categoryImage[service].url;
                } else {
                    checker = item.ServiceImage.url;
                    if (checker != null) {
                        found_an_image = true;
                        return checker;
                    }
                }
                // console.log('returned image', item.ServiceImage.url);
            }
        });
        if (checker === null) {
            console.log('returned default');
            checker = '/images/Kingsley.png';
        }
        return checker;
    };
    if (loading) <CustomLoadingWrapper />;
    if (error) console.log('error');
    let filteredProds;
    if (props && props.prods) {
        filteredProds = props.prods.filter((item) => {
            return item.Promotion;
        });
    }

    console.log('locale', router.locale);

    return (
        <>
            {props.prods && (
                <div>
                    <div className={styles.cardBig}>
                        {/* This col only appears on desktop and such devices */}
                        <div className={styles.cardBig_col_alt}>
                            <div className={styles.cardBig_name}>
                                {props.prods && t(`${props.prods[0].ServiceCategory}`)}
                            </div>
                            <div className={styles.hero_desc}>
                                {props.prods &&
                                    t(`desc${props.prods[0].ServiceCategory}`)}
                            </div>
                        </div>
                        {/* Alt Block ends */}

                        {props.prods && (
                            <div className={styles.cardBig_hero}>
                                <div className={styles.herodiv_img}>
                                    <Image
                                        src={
                                            props.prods[0].ServiceCategory
                                                ? `/images/${props.prods[0].ServiceCategory}.png`
                                                : '/images/Kingsley.png'
                                        }
                                        alt='image'
                                        layout={'fill'}
                                        objectFit={'contain'}
                                    />
                                </div>
                                {/* The info block that appears for mobile devices */}
                                <div className={styles.cardBig_col}>
                                    <div className={styles.cardBig_name}>
                                        {t(`${props?.prods[0]?.ServiceCategory}`)}
                                    </div>
                                    <div className={styles.hero_desc}>
                                        {t(`desc${props?.prods[0]?.ServiceCategory}`)}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className={styles.cardBig_c2}>
                            {props.prods && filteredProds && filteredProds.length > 0 && (
                                <div>
                                    <h1
                                        className={
                                            router.locale == 'ar'
                                                ? styles.cardBig_h1_ar
                                                : styles.cardBig_h1
                                        }
                                    >
                                        {t('Promotion')}
                                    </h1>
                                    <div className={styles.cardBig_promotion}>
                                        {props.prods.map(
                                            (promo, idx) =>
                                                promo.Promotion && (
                                                    <Link
                                                        as={`/products/${promo.slug}`}
                                                        href='/products/[slug]'
                                                        passHref
                                                        key={idx}
                                                    >
                                                        <div className={styles.herodiv2}>
                                                            <div
                                                                className={
                                                                    styles.herodiv_img2
                                                                }
                                                            >
                                                                <Image
                                                                    src={
                                                                        promo.ServiceImage
                                                                            ? promo
                                                                                  .ServiceImage
                                                                                  .url
                                                                            : '/images/Kingsley.png'
                                                                    }
                                                                    alt='Home'
                                                                    // width={234}
                                                                    // height={264}
                                                                    layout={'fill'}
                                                                    objectFit={'cover'}
                                                                />
                                                            </div>
                                                            <div
                                                                className={
                                                                    styles.herodiv_col2
                                                                }
                                                            >
                                                                <div
                                                                    className={
                                                                        styles.hero_name2
                                                                    }
                                                                >
                                                                    {router.locale ==
                                                                        'ar' &&
                                                                    promo.localizations[0]
                                                                        ? promo
                                                                              .localizations[0]
                                                                              .ServiceName
                                                                        : promo.ServiceName}
                                                                </div>
                                                                <div
                                                                    className={
                                                                        styles.hero_desc2
                                                                    }
                                                                >
                                                                    {router.locale ==
                                                                        'ar' &&
                                                                    promo
                                                                        .localizations[0] &&
                                                                    promo.localizations[0]
                                                                        .promoDesc
                                                                        ? promo
                                                                              .localizations[0]
                                                                              .promoDesc
                                                                            ? promo
                                                                                  .localizations[0]
                                                                                  .promoDesc
                                                                            : promo
                                                                                  .localizations[0]
                                                                                  .ServiceDesc
                                                                        : promo.promoDesc
                                                                        ? promo.promoDesc
                                                                        : promo.ServiceDesc}
                                                                </div>

                                                                <Image
                                                                    src='/images/arrow.png'
                                                                    alt='arrow'
                                                                    width={30}
                                                                    height={15}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                )
                                        )}
                                    </div>
                                </div>
                            )}
                            {props.prods[0].ServiceCategory != 'Kingsley_Home' &&
                                props.prods[0].ServiceName && (
                                    <div>
                                        <h1
                                            className={
                                                router.locale == 'ar'
                                                    ? styles.cardBig_h1_ar
                                                    : styles.cardBig_h1
                                            }
                                        >
                                            {t('Services')}
                                        </h1>
                                        {data && props.prods && (
                                            <div className={styles.cardBig_services}>
                                                {data.realServicesConnection.groupBy.ServiceSubcategory.map(
                                                    (services, idx) => (
                                                        <>
                                                            {
                                                                (subCategoryHasProds = false)
                                                            }
                                                            {props.prods.map((item) => {
                                                                if (
                                                                    item.ServiceSubcategory ==
                                                                    services.key
                                                                ) {
                                                                    subCategoryHasProds = true;
                                                                }
                                                            })}
                                                            {subCategoryHasProds ? (
                                                                <Link
                                                                    key={idx}
                                                                    as={`/${encodeURIComponent(
                                                                        props.prods[0]
                                                                            .ServiceCategory
                                                                    )}/${encodeURIComponent(
                                                                        services.key
                                                                    )}`}
                                                                    href='/[category]/[slug]'
                                                                    passHref
                                                                >
                                                                    <motion.div
                                                                        whileHover={{
                                                                            scale: 1.05,
                                                                        }}
                                                                        whileTap={{
                                                                            scale: 0.98,
                                                                        }}
                                                                        className={
                                                                            styles.cardBig_service
                                                                        }
                                                                    >
                                                                        <div
                                                                            className={
                                                                                styles.cardBig_img
                                                                            }
                                                                        >
                                                                            <Image
                                                                                src={`${get_image_url(
                                                                                    services.key
                                                                                )}`}
                                                                                alt='image'
                                                                                layout={
                                                                                    'fill'
                                                                                }
                                                                                objectFit={
                                                                                    'cover'
                                                                                }
                                                                            />
                                                                        </div>
                                                                        <div
                                                                            className={
                                                                                styles.cardBig_desc
                                                                            }
                                                                        >
                                                                            {t(
                                                                                `${services.key}`
                                                                            )}
                                                                        </div>
                                                                    </motion.div>
                                                                </Link>
                                                            ) : null}
                                                        </>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            {props.prods[0].ServiceCategory == 'Kingsley_Home' && (
                                <div className={styles.cardBig_options}>
                                    <h1
                                        className={
                                            router.locale == 'ar'
                                                ? styles.cardBig_h12_ar
                                                : styles.cardBig_h12
                                        }
                                    >
                                        {t('Services')}
                                    </h1>
                                    {props.prods.map((options, idx) => (
                                        <Link
                                            key={idx}
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
                                                <div
                                                    className={
                                                        styles.cardBig_options_test
                                                    }
                                                >
                                                    {router.locale == 'ar' &&
                                                    options.localizations[0]
                                                        ? options.localizations[0]
                                                              .ServiceName
                                                        : options.ServiceName}{' '}
                                                    <p className={styles.cardBig_price}>
                                                        <span
                                                            style={{
                                                                fontSize: '15px',
                                                                marginRight: '2px',
                                                            }}
                                                        >
                                                            {t('From')}
                                                        </span>
                                                        {'  '}
                                                        {translating_number(
                                                            options?.ServicePrices[0]
                                                                ?.Price
                                                        )}{' '}
                                                        {t('kwd')}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// props.prods[0].ServiceCategory != 'Gifts' &&
//                                 props.prods[0].ServiceName &&

// {props.prods[0].ServiceCategory == 'Gifts' && (
//     <div className={styles.cardBig_options}>
//         {props.prods.map((options, idx) => (
//             <Link
//                 key={idx}
//                 as={`/products/${options.slug}`}
//                 href='/products/[slug]'
//                 passHref
//             >
//                 <motion.div
//                     whileHover={{
//                         scale: 1.03,
//                         backgroundColor: '#ffffff3a',
//                     }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => toggleClass(options.id)}
//                     className={
//                         isActive && isKey == options.id
//                             ? `${styles.btnactive}`
//                             : null
//                     }
//                 >
//                     <div>{options.ServiceName}</div>
//                 </motion.div>
//             </Link>
//         ))}
//     </div>
// )}
