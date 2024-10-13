import React from 'react';
import useAuth from '../../context/useAuth';
import styles from './FloatingAB.module.css';
import Image from 'next/image';
import wallet from '../../public/images/wallet.svg';
import useSide from '../../context/SidebarFlow';
import gift from '../../public/images/gift.svg';
import { GET_GIFT_COUNT } from '../../GraphQL/queries';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'next-i18next';

function FloatingAB() {
    const { setIsInfo, setNavTogContext } = useSide();
    const { userDetails } = useAuth();
    const { data } = useQuery(GET_GIFT_COUNT);
    const { t } = useTranslation('navbar');
    const giftClicker = () => {
        // console.log(isInfo);
        // open the Gifts panel
        setIsInfo(false);
        // toggle the sidebar
        setNavTogContext(true);
    };
    const walletClicker = () => {
        // open info panel
        setIsInfo(true);
        // just toggle the sidebar
        setNavTogContext(true);
    };
    return (
        <>
            {data?.getGifts?.gift ? (
                <a className={styles.fabBG} onClick={giftClicker}>
                    <Image objectFit={'scale-down'} src={gift} height={20} />
                    {t(`You Have a Gift`)}
                </a>
            ) : (
                userDetails?.walletBalance != (null || undefined) && (
                    <a className={styles.fabBG} onClick={walletClicker}>
                        <Image objectFit={'scale-down'} src={wallet} height={16} />
                        {`${userDetails.walletBalance} KWD`}
                    </a>
                )
            )}
        </>
    );
}

export default FloatingAB;
