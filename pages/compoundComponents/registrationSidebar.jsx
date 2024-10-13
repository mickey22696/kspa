import Image from 'next/image';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import useAuth from '../../context/useAuth';
import useSide from '../../context/SidebarFlow';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/sidebar';
import Login from './logintest';
import styles from './registrationSidebar.module.scss';
import CustomLoadingWrapper from '../components/CustomLoadingWrapper';
import { useEffect } from 'react';

function RightSidebar({ navToggle, setNavToggle, onRight }) {
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailMarketing, setEmailMarketing] = useState('');
    const { registerUser, IsSignup, signup } = useAuth();
    const { navTogCon, setNavTogContext, closeAll } = useSide();
    const sidebarProps = {
        navToggle,
        setNavToggle,
        onRight,
        closeAll,
    };
    useEffect(() => {
        setNavToggle(navTogCon);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navTogCon]);

    useEffect(() => {
        setNavTogContext(navToggle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navToggle]);

    const close_sidebar = () => {
        setNavToggle(false);
    };

    const updateFormData = (event) => {
        console.log('Loading set to true');
        setIsLoading(true);
        event.preventDefault();
        registerUser(username, email, password, emailMarketing).then(() => {
            console.log('Loading set to false');
            setIsLoading(false);
        });
    };
    const { t } = useTranslation('navbar');
    return (
        <Sidebar {...sidebarProps}>
            {IsSignup ? (
                <Login {...{ close_sidebar }} />
            ) : (
                <div className={styles.container}>
                    <div className={styles.topBar}>
                        <Image
                            src='/images/back_arrow.svg'
                            alt='back'
                            width={28}
                            height={22}
                            onClick={close_sidebar}
                        />
                        <h1
                            style={{
                                fontWeight: 'normal',
                            }}
                        >
                            {t('Sign Up')}
                        </h1>
                        <Image
                            src='/images/Cross.svg'
                            alt='close'
                            width={22}
                            height={22}
                            onClick={close_sidebar}
                        />
                    </div>
                    {isLoading ? (
                        <CustomLoadingWrapper />
                    ) : (
                        <form className={styles.accForm} onSubmit={updateFormData}>
                            <input
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                placeholder={t('Name')}
                                type='text'
                                name='firstName'
                                required
                            />
                            <input
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder={t('Phone No.')}
                                type='phone'
                                name='email'
                                required
                            />
                            <input
                                value={emailMarketing}
                                onChange={(event) =>
                                    setEmailMarketing(event.target.value)
                                }
                                placeholder={t('Email') + '  Optional'}
                                type='email'
                                name='emailMarketing'
                            />
                            <input
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder={t('Password')}
                                type='password'
                                name='password'
                                required
                            />

                            <button type='submit'>{t('Submit')}</button>
                        </form>
                    )}
                    <div className={styles.options}>
                        <h4>{t('Have a Kingsley Account?')}</h4>
                        <a onClick={() => signup(true)}>{t('Sign in')}</a>
                    </div>
                </div>
            )}
            {/*
            <div className={styles.sidebar2}>
                <Link href='/kingsley'>
                    <a>{t('kingsley')}</a>
                </Link>
                <Link href='/kingsleyhome'>
                    <a>{t('khome')}</a>
                </Link>
                <Link href='/gifts'>
                    <a>{t('gifts')}</a>
                </Link>
            </div>
            <div className={styles.sidebar3}>
                <p>{t('needhelp')}</p>
            </div>
                        <div className={styles.sidebar4}>{t('socialmedia')}</div> */}
        </Sidebar>
    );
}

RightSidebar.propTypes = {
    navToggle: PropTypes.bool,
    onRight: PropTypes.bool,
    setNavToggle: PropTypes.func,
};

export default RightSidebar;
