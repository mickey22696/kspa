// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useState } from 'react';
import useAuth from '../../context/useAuth';
// import dynamic from 'next/dynamic';
import Account from './account';
import { useTranslation } from 'react-i18next';
import styles from './registrationSidebar.module.scss';
import useSide from '../../context/SidebarFlow';
import { FORGET_PASSWORD } from '../../GraphQL/queries';
import { useMutation } from '@apollo/client';
import CustomLoadingWrapper from '../components/CustomLoadingWrapper';
//import { GET_ME } from '../GraphQL/queries';

// const { Account } = dynamic(() => import('../compoundComponents/account'), {
//     ssr: false,
// });

export default function Login(props) {
    const [isLoading, setIsLoading] = useState(false);
    const { userDetails, IsLoggedIn, loginUser } = useAuth();
    const { closeAll } = useSide();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const { signup } = useAuth();
    // eslint-disable-next-line no-unused-vars
    const [forgetpassword, { loading: forgetpasswordLoading }] =
        useMutation(FORGET_PASSWORD);
    const forget_password = () => {
        if (identifier === '') {
            alert('Please enter a Phone Number');
        } else {
            forgetpassword({ variables: { forgotPasswordEmail: identifier } })
                .then(() => {
                    alert('Password has been sent to your registered Phone Number');
                    setPassword('');
                    setIdentifier('');
                })
                .catch(() => {
                    alert('Error sending Password');
                });
        }
    };
    const handleSubmit = (event) => {
        setIsLoading(true);
        event.preventDefault();
        loginUser(identifier, password).then(() => {
            setIsLoading(false);
        });
    };
    const { t } = useTranslation('navbar');
    //const { data } = useQuery(GET_ME);
    return (
        <>
            {IsLoggedIn && userDetails ? (
                <Account />
            ) : (
                <div className={styles.container}>
                    <div className={styles.topBar}>
                        <Image
                            src='/images/back_arrow.svg'
                            alt='back'
                            width={28}
                            height={22}
                            onClick={props.close_sidebar}
                        />
                        <h1
                            style={{
                                fontWeight: 'normal',
                            }}
                        >
                            {t('Sign in')}
                        </h1>
                        <Image
                            src='/images/Cross.svg'
                            alt='close'
                            width={22}
                            height={22}
                            onClick={() => closeAll()}
                        />
                    </div>
                    {isLoading ? (
                        <CustomLoadingWrapper />
                    ) : (
                        <form className={styles.accForm} onSubmit={handleSubmit}>
                            <input
                                type='tel'
                                value={identifier}
                                onChange={(event) => setIdentifier(event.target.value)}
                                placeholder={t('Phone No.')}
                            />
                            <input
                                type='password'
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder={t('Password')}
                            />
                            <button type='submit'>{t('Login')}</button>
                        </form>
                    )}
                    <div className={styles.options}>
                        <div style={{ textAlign: 'left' }}>
                            <h4>{t('New to Kingsley?')}</h4>
                            <a onClick={() => signup(false)}>{t('Sign Up')}</a>
                        </div>
                        <p onClick={() => forget_password()}>{t('Reset Password')}</p>
                    </div>
                </div>
            )}
        </>
    );
}

// export const getStaticProps = async ({ locale }) => ({
//     props: {
//         ...(await serverSideTranslations(locale, ['navbar'])),
//     },
// });
