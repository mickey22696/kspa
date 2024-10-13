import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import useAuth from '../../context/useAuth';
import styles from './sucess.module.css';
const Sucess = () => {
    // const [Number, setNumber] = useState(0);
    const { handlejwt } = useAuth();
    const router = useRouter();
    console.log('query..', router.query);
    if (router.query.token) {
        handlejwt(router.query.token);
    }
    // let first = setInterval(() => {
    //     setNumber(Number + 1);
    // }, 1000);

    // if (Number == 5) {
    //     clearInterval(first);
    // }
    useEffect(() => {
        setTimeout(() => {
            router.pathname == '/confirmation/sucess'
                ? router.push('/')
                : console.log('NOTHING');
        }, 5000);
    }, []);

    return (
        <div className={styles.centeredDiv}>
            <div className={styles.card}>
                <div className={styles.card_int}>
                    <div>
                        <h2>User Confirmed</h2>
                        {/* <h2>Redirecting {Number}</h2> */}
                    </div>
                    <div className={styles.prod_btn}>
                        <motion.button
                            whileTap={{
                                scale: 0.95,
                            }}
                            onClick={() => {
                                router.push('/');
                            }}
                        >
                            Continue
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sucess;
