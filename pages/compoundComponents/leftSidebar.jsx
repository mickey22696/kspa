import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import Sidebar from '../components/sidebar';
import styles from './leftSidebar.module.css';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/dist/client/router';
import { useQuery, gql } from '@apollo/client';
import { get_kingsley_homep } from '../../GraphQL/queries';
import CustomLoadingWrapper from '../components/CustomLoadingWrapper';
const GET_PRODS = gql`
    query GetCategory {
        realServicesConnection {
            groupBy {
                ServiceCategory {
                    key
                }
            }
        }
    }
`;

function LeftSidebar({ navToggle, setNavToggle, onRight }) {
    const { loading, error, data } = useQuery(GET_PRODS);
    const kingsleyPage = useQuery(get_kingsley_homep);

    const closeAll = () => {
        close_sidebar();
    };

    const sidebarProps = {
        navToggle,
        setNavToggle,
        closeAll,
        onRight,
    };

    const close_sidebar = () => {
        setNavToggle(false);
    };

    const router = useRouter();
    const { t } = useTranslation('navbar');
    if (loading) <CustomLoadingWrapper />;
    if (error) console.log('error');
    if (kingsleyPage.loading) <CustomLoadingWrapper />;
    if (kingsleyPage.error) console.log('error');
    return (
        <Sidebar {...sidebarProps}>
            <div className={styles.sidebar1}>
                <Image
                    src='/images/Cross.svg'
                    alt='close'
                    width={30}
                    height={30}
                    onClick={close_sidebar}
                />
                <Link href='/' locale={router.locale === 'en' ? 'ar' : 'en'} passHref>
                    <button>
                        {router.locale === 'en' ? (
                            <Image
                                src='/images/arabic.svg'
                                alt='AR'
                                width={30}
                                height={30}
                            />
                        ) : (
                            'EN'
                        )}
                    </button>
                </Link>
            </div>
            {data && (
                <div className={styles.sidebar2}>
                    {data.realServicesConnection.groupBy.ServiceCategory.slice(0)
                        .reverse()
                        .map((service) => (
                            <>
                                {kingsleyPage.data && (
                                    <>
                                        {kingsleyPage.data.kingsleyIsOn[service.key] ? (
                                            <Link
                                                key={service.key}
                                                href={`/${service.key}`}
                                                passHref
                                            >
                                                <a onClick={close_sidebar}>
                                                    {t(`${service.key}`)}
                                                </a>
                                            </Link>
                                        ) : null}
                                    </>
                                )}
                            </>
                        ))}
                </div>
            )}
            <div className={styles.sidebar3}>
                <p>{t('needhelp')}</p>
                <a href='tel:+96522254455'>
                    <Image src='/images/Call.svg' alt='insta' width={15} height={15} />
                    <span>+965 2225 4455</span>
                </a>
                <a href='mailto:info@kingsleymenspa.com'>
                    <Image src='/images/Mail.svg' alt='insta' width={15} height={15} />
                    <span>info@kingsleymenspa.com</span>
                </a>
                <a href='#'>
                    <Image
                        src='/images/Instagram_Icon.svg'
                        alt='insta'
                        width={15}
                        height={15}
                    />
                    <span>Kingsleymenspa</span>
                </a>
                <a
                    href='https://goo.gl/maps/bvUTgozAj9WUEanF8'
                    target='_blank'
                    rel='noreferrer'
                >
                    <Image
                        src='/images/location1.svg'
                        alt='location1'
                        width={15}
                        height={15}
                    />
                    <span>{t('address')}</span>
                </a>
            </div>
        </Sidebar>
    );
}

LeftSidebar.propTypes = {
    navToggle: PropTypes.bool,
    onRight: PropTypes.bool,
    setNavToggle: PropTypes.func,
};

export default LeftSidebar;
