import React from 'react';
import { useRef } from 'react';

export default function GetOrdersCsvDown() {
    const tocken = 'K!ngSl$y1';
    const tockeninp = useRef(null);

    //just validates the tocken
    const validate = () => {
        let input_tocken = tockeninp.current.value;
        if (input_tocken === tocken) {
            window.open('https://api.lionping.com/get-order-csv');
        } else {
            alert('WRONG PASSWORD');
        }
    };

    return (
        <>
            <div>
                <input ref={tockeninp} type='text' placeholder='TOCKEN' />
                <button onClick={validate}>DOWNLOAD</button>
            </div>
        </>
    );
}
