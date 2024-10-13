import Image from 'next/image';

export default function Card(props) {
    return (
        <>
            {props.prods && (
                <div>
                    {props.prods.map((prods, id) => (
                        <div key={id} className='herodiv'>
                            <div className='herodiv_img'>
                                <Image
                                    src={prods.image}
                                    alt='Home'
                                    width={150}
                                    height={150}
                                />
                            </div>
                            <div className='herodiv_col'>
                                <div className='hero_name'>{prods.name}</div>
                                <div className='hero_desc'>{prods.desc}</div>
                                <Image
                                    src='/images/arrow.png'
                                    alt='arrow'
                                    width={30}
                                    height={15}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
