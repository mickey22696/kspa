import LoadingOverlay from 'react-loading-overlay';
import ClientOnlyPortal from './ClientOnlyPortal';
import React from 'react';

function CustomLoadingWrapper() {
    return (
        <ClientOnlyPortal selector='#__next'>
            <LoadingOverlay
                styles={{
                    wrapper: {
                        top: '0px',
                        zIndex: 11,
                        width: '100vw',
                        height: '100vh',
                        position: 'fixed',
                    },
                }}
                active={true}
                spinner
            />
        </ClientOnlyPortal>
    );
}

export default CustomLoadingWrapper;
