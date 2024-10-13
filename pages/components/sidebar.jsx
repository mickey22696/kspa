// import React } from 'react';
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useIsLG } from '../../utils/mediaQueryHelper';
import PropTypes from 'prop-types';
import styles from './sidebar.module.css';

Sidebar.propTypes = {
    navToggle: PropTypes.bool,
    onRight: PropTypes.bool,
    setNavToggle: PropTypes.func,
    children: PropTypes.node,
};

function Sidebar(props) {
    const { navToggle, onRight, children, closeAll } = props;
    // const xOffset = -400 + 800 * onRight;
    // console.log(props);
    // const close_sidebar = () => {
    //     setNavToggle(false);
    // };
    const isSM = useIsLG();
    const modifier = onRight ? '' : '-';
    const width = isSM ? '34vw' : '94vw';
    const calcWidth = modifier + width;
    const sidebarVariants = {
        sidebarOpen: {
            width: width,
            x: `0px`,
            transition: {
                type: 'tween',
                ease: 'easeInOut',
            },
            opacity: 1,
        },
        sidebarClosed: {
            width: width,
            x: calcWidth,
            transition: {
                type: 'tween',
                ease: 'easeInOut',
            },
            opacity: 1,
        },
    };

    const childrenVariants = {
        sidebarOpen: {
            // transform: 'translateX(0px)',
            transition: {
                type: 'tween',
                ease: 'easeInOut',
            },
            opacity: 1,
        },
        sidebarClosed: {
            // transform: `translateX(${width})`,
            transition: {
                type: 'tween',
                ease: 'easeInOut',
            },
            opacity: 0,
        },
    };

    // For handling clicks outside the sidebar
    const node = useRef(null);
    const handleClickOutside = (e) => {
        let x = document.getElementsByClassName('MuiModal-root');

        if (node.current.contains(e.target) || (x && x[0] && x[0].contains(e.target))) {
            // console.log('clicking anywhere');
            // inside click
            console.log('reached inside');
            // e.stopPropagation();
            return;
        }
        // outside click
        // console.log('reached outside');

        e.preventDefault();
        // e.stopPropagation();

        closeAll();
        return;
    };

    useEffect(() => {
        // console.log('clickoutsied');
        if (navToggle) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navToggle]);

    return (
        <motion.div
            ref={node}
            className={`${styles.sidebar} ${
                onRight ? styles.sidebarRight : styles.sidebarLeft
            }`}
            initial='sidebarClosed'
            animate={navToggle ? 'sidebarOpen' : 'sidebarClosed'}
            variants={sidebarVariants}
        >
            <motion.div className={styles.children} variants={childrenVariants}>
                {children}
            </motion.div>
        </motion.div>
    );
}

export default Sidebar;
