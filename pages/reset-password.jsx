import Image from 'next/dist/client/image';
import styles from './components/cardBig.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { RESET_PASS } from '../GraphQL/queries';
import CustomLoadingWrapper from './components/CustomLoadingWrapper';

export default function ForgetPass() {
    const router = useRouter();
    const { code } = router.query;
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [resetpassword, { loading }] = useMutation(RESET_PASS);

    useEffect(() => {
        if (router.isReady && !code) {
            router.push('/');
        }
    }, [router, code]);

    const resetnow = (event) => {
        event.preventDefault();
        if (
            passwordConfirmation !== password ||
            password === '' ||
            passwordConfirmation === ''
        ) {
            alert('Please check your inputs');
            return;
        }
        resetpassword({
            variables: {
                resetPasswordPassword: password,
                resetPasswordPasswordConfirmation: passwordConfirmation,
                resetPasswordCode: code,
            },
        })
            .then(() => {
                alert('Your password has been reset');
                router.push('/');
            })
            .catch((err) => {
                console.error(err);
                alert('Code is invalid!');
            });
    };

    const { t } = useTranslation();
    return (
        <>
            {loading && <CustomLoadingWrapper />}
            <div className={styles.cardBig}>
                {/* This col only appears on desktop and such devices */}
                <div
                    style={{ marginBottom: 2 + 'rem' }}
                    className={styles.cardBig_col_alt}
                >
                    <div className={styles.cardBig_name}>{t('Reset Password')}</div>
                </div>
                {/* Alt Block ends */}
                <div className={styles.cardBig_hero}>
                    <div className='herodiv_img'>
                        <Image
                            src='/images/Kingsley.png'
                            alt='image'
                            layout={'fill'}
                            objectFit={'contain'}
                        />
                    </div>
                    {/* The info block that appears for mobile devices */}
                    <div className={styles.cardBig_col}>
                        <div className={styles.cardBig_name}>{t('Reset Password')}</div>
                    </div>
                </div>
                <div className={styles.cardBig_c2}>
                    <div className={styles.cardBig_options}>
                        <form className={styles.form} onSubmit={resetnow}>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type='password'
                                placeholder={t('Password')}
                            />
                            <input
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                type='password'
                                placeholder={t('Confirm Password')}
                            />
                            <button type='submit'>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
