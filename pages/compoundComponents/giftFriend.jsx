import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import useSide from '../../context/SidebarFlow';
import useAuth from '../../context/useAuth';
import { useInput } from '../../utils/inputHelper';
import styles from './registrationSidebar.module.scss';
// import { useRef } from 'react';
export default function GiftFriend() {
    const { t } = useTranslation('navbar');
    const { giftOrBookNow, setGiftOrBookNow } = useAuth();
    const { togglePaymentMethod, toggleGift, closeAll } = useSide();
    const { value: recpName, bind: bindRecpName, reset: resetRecpName } = useInput('');
    const {
        value: recpAddress,
        bind: bindrecpAddress,
        reset: resetrecpAddress,
    } = useInput('');
    // const checkBoxRef = useRef(true);
    const {
        value: recpNumber,
        bind: bindrecpNumber,
        reset: resetrecpNumber,
    } = useInput('');
    const {
        value: confRecpNumber,
        bind: bindconfRecpNumber,
        reset: resetconfRecpNumber,
    } = useInput('');
    const { value: Block, bind: bindBlock, reset: resetBlock } = useInput('');
    const { value: Area, bind: bindArea, reset: resetArea } = useInput('');
    const gifted = (event) => {
        event.preventDefault();
        toggleGift(true);
        // let send_message = checkBoxRef.current.checked;
        //   console.log(send_message);
        // setLoading(true);
        if (recpName == '' || recpNumber == '') {
            alert('Cant be empty!');
            return;
        }
        // add details for gifting
        if (confRecpNumber === recpNumber) {
            // WE save this info
            const modGift = giftOrBookNow;

            modGift.recpName = recpName;
            modGift.recpNumber = recpNumber;
            // modGift.sendMessage = send_message;
            if (giftOrBookNow && giftOrBookNow.serviceSubcategory === 'Product') {
                modGift.recpAddress = recpAddress;
                modGift.Area = Area;
                modGift.Block = Block;
            }
            // got new info now parsing it
            setGiftOrBookNow(modGift);
            // setLoading(false);
            togglePaymentMethod(true);
            resetrecpAddress();
            resetrecpNumber();
            resetRecpName();
            resetArea();
            resetBlock();
            resetconfRecpNumber();
            return;
        }
        alert('Please Check your inputs!');
    };
    return (
        <>
            <div className={styles.container}>
                <div className={styles.topBar}>
                    <h1
                        style={{
                            fontWeight: 'normal',
                        }}
                    >
                        {t('Gift a Friend')}
                    </h1>
                    <Image
                        src='/images/Cross.svg'
                        alt='close'
                        width={22}
                        height={22}
                        onClick={() => closeAll()}
                    />
                </div>
                <form className={styles.accForm}>
                    <input
                        type='text'
                        placeholder={t('Recievers Name')}
                        {...bindRecpName}
                    />
                    {giftOrBookNow && giftOrBookNow.serviceSubcategory === 'Product' ? (
                        <>
                            <input type='text' placeholder={t('Area')} {...bindArea} />
                            <input type='text' placeholder={t('Block')} {...bindBlock} />

                            <input
                                type='text'
                                placeholder={t('Recievers Address')}
                                {...bindrecpAddress}
                            />
                        </>
                    ) : null}
                    <input
                        type='tel'
                        placeholder={t('Recievers Phone No.')}
                        {...bindrecpNumber}
                    />
                    <input
                        type='tel'
                        placeholder={t('Confirm Recievers Phone No.')}
                        {...bindconfRecpNumber}
                    />

                    <button onClick={gifted}>{t('Gift')}</button>
                </form>
            </div>
        </>
    );
}

// {console.log('=-0-134====')}
// <label>SEND YOUR NAME TO FRIEND</label>
// <input type='checkbox' ref={checkBoxRef} defaultChecked />
