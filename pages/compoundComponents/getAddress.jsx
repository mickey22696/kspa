import { useEffect, useState } from 'react';
import Image from 'next/dist/client/image';
import { useTranslation } from 'react-i18next';
import useAuth from '../../context/useAuth';
import useSide from '../../context/SidebarFlow';
import styles from './registrationSidebar.module.scss';
import { gql, useMutation } from '@apollo/client';
const UPDATE_ORDER = gql`
    mutation Mutation($updateOrderInput: updateOrderInput) {
        updateOrder(input: $updateOrderInput) {
            order {
                id
            }
        }
    }
`;
export default function GetAddress() {
    // eslint-disable-next-line no-unused-vars
    const [updateOrder, { data }] = useMutation(UPDATE_ORDER);
    const [isDone, setDone] = useState(false);
    const {
        isBook,
        AppointOrder,
        closeAll,
        toggleKHome,
        togglePickDate,
        isCartBook,
        setCartTogContext,
    } = useSide();
    const {
        setAppointAddress,
        giftOrBookNow,
        userDetails,
        currentCartOrder,
        setCurrentCartOrder,
    } = useAuth();
    const [adress, setAdress] = useState('');
    const [block, setBlock] = useState('');
    const [area, setArea] = useState('');
    const [isDifferent, setIsDifferent] = useState(false);
    const [save, setSave] = useState();
    const { t } = useTranslation();
    console.log(userDetails);

    useEffect(() => {
        if (
            userDetails &&
            userDetails.Area &&
            userDetails.Block &&
            userDetails.Address &&
            adress == '' &&
            block == '' &&
            area == ''
        ) {
            setAdress(userDetails.Address);
            setArea(userDetails.Area);
            setBlock(userDetails.Block);
        }
    }, []);
    useEffect(() => {
        if (
            !userDetails ||
            !userDetails.Address ||
            !userDetails.Area ||
            !userDetails.Block
        ) {
            setIsDifferent(false);
            setSave(true);
        } else if (
            adress != userDetails.Address ||
            area != userDetails.Area ||
            block != userDetails.Block
        ) {
            setIsDifferent(true);
        } else {
            setIsDifferent(false);
        }
    }, [adress, block, area]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        setAppointAddress(adress);
        console.log('The Order', AppointOrder);
        if (isCartBook) {
            //

            currentCartOrder.OrderAddress = `${area}, ${block}, ${adress}`;
            currentCartOrder.Area = area;
            currentCartOrder.Block = block;
            currentCartOrder.Address = adress;
            currentCartOrder.ChangeAddress = save;
            setCurrentCartOrder(currentCartOrder);
        } else if (!isBook) {
            console.log('HERE--');
            await updateOrder({
                variables: {
                    updateOrderInput: {
                        where: {
                            id: AppointOrder,
                        },
                        data: {
                            OrderAddress: `${area}, ${block}, ${adress}`,
                            Area: area,
                            Block: block,
                            Address: adress,
                            ChangeAddress: save,
                        },
                    },
                },
            });
        } else if (isBook) {
            await updateOrder({
                variables: {
                    updateOrderInput: {
                        where: {
                            id: giftOrBookNow.id,
                        },
                        data: {
                            OrderAddress: `${area}, ${block}, ${adress}`,
                            Area: area,
                            Block: block,
                            Address: adress,
                            ChangeAddress: save,
                        },
                    },
                },
            });
        }
        setDone(true);
    };
    const back = () => {
        toggleKHome(false);
        togglePickDate(false);
        setCartTogContext(false);
    };
    if (isDone) {
        return null;
    } else {
        return (
            <>
                <div style={{ height: '100vh' }} className={styles.container}>
                    <div className={styles.topBar}>
                        <Image
                            src='/images/back_arrow.svg'
                            alt='back'
                            width={28}
                            height={22}
                            onClick={() => back()}
                        />
                        <h1
                            style={{
                                fontWeight: 'normal',
                            }}
                        >
                            {t('Address')}
                        </h1>
                        <Image
                            src='/images/Cross.svg'
                            alt='close'
                            width={22}
                            height={22}
                            onClick={() => closeAll()}
                        />
                    </div>
                    <form className={styles.accForm} onSubmit={handleSubmit}>
                        <input
                            type='text'
                            placeholder={t('Area')}
                            value={area}
                            onChange={(event) => setArea(event.target.value)}
                        />
                        <input
                            type='text'
                            placeholder={t('Block')}
                            value={block}
                            onChange={(event) => setBlock(event.target.value)}
                        />
                        <input
                            type='text'
                            placeholder={t('Address')}
                            value={adress}
                            onChange={(event) => setAdress(event.target.value)}
                        />
                        {isDifferent && (
                            <>
                                <div className={styles.CheckboxContainer}>
                                    <input
                                        className={styles.CheckboxInput}
                                        type='checkbox'
                                        defaultChecked={false}
                                        onChange={(event) =>
                                            setSave(event.currentTarget.checked)
                                        }
                                    />
                                    <p className={styles.CheckboxLabel}> Save Address</p>
                                </div>
                            </>
                        )}
                        <button disabled={!(area && block && adress)} type='submit'>
                            {t('Submit')}
                        </button>
                    </form>
                </div>
            </>
        );
    }
}
