import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Layout({ children, meta: pageMeta }) {
    const router = useRouter();
    const meta = {
        title: 'Kingsley Men Spa',
        description: `The Offical Site of Kingsley, the men's spa.`,
        cardImage: '/og.png',
        ...pageMeta,
    };
    return (
        <>
            <Head>
                <title>{meta.title}</title>
                <link rel='manifest' href='/manifest.webmanifest' />
                <meta name='theme-color' content='#261e17' />
                <meta name='apple-mobile-web-app-capable' content='yes' />
                <link
                    href='/splashscreens/iphonex_splash.png'
                    media='(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)'
                    rel='apple-touch-startup-image'
                />
                <link
                    href='/splashscreens/iphonexr_splash.png'
                    media='(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)'
                    rel='apple-touch-startup-image'
                />
                <link
                    href='/splashscreens/iphonexsmax_splash.png'
                    media='(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)'
                    rel='apple-touch-startup-image'
                />
                <link
                    href='/splashscreens/ipad_splash.png'
                    media='(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)'
                    rel='apple-touch-startup-image'
                />
                <link
                    href='/splashscreens/ipadpro1_splash.png'
                    media='(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)'
                    rel='apple-touch-startup-image'
                />
                <link
                    href='/splashscreens/ipadpro3_splash.png'
                    media='(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)'
                    rel='apple-touch-startup-image'
                />
                <link
                    href='/splashscreens/ipadpro2_splash.png'
                    media='(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)'
                    rel='apple-touch-startup-image'
                />
                <link rel='apple-touch-icon' sizes='57x57' href='/apple-icon-57x57.png' />
                <link rel='apple-touch-icon' sizes='60x60' href='/apple-icon-60x60.png' />
                <link rel='apple-touch-icon' sizes='72x72' href='/apple-icon-72x72.png' />
                <link rel='apple-touch-icon' sizes='76x76' href='/apple-icon-76x76.png' />
                <link
                    rel='apple-touch-icon'
                    sizes='114x114'
                    href='/apple-icon-114x114.png'
                />
                <link
                    rel='apple-touch-icon'
                    sizes='120x120'
                    href='/apple-icon-120x120.png'
                />
                <link
                    rel='apple-touch-icon'
                    sizes='144x144'
                    href='/apple-icon-144x144.png'
                />
                <link
                    rel='apple-touch-icon'
                    sizes='152x152'
                    href='/apple-icon-152x152.png'
                />
                <link
                    rel='apple-touch-icon'
                    sizes='180x180'
                    href='/apple-icon-180x180.png'
                />
                <link
                    href='//db.onlinewebfonts.com/c/6a1891db0152c7835cc61d5e95578b29?family=Sharp+Sans+No1+Book'
                    rel='stylesheet'
                    type='text/css'
                />
                <link
                    href='//db.onlinewebfonts.com/c/154ebfcef3ca74b92a56a5826ee85d74?family=Sharp+Sans+No1+Bold'
                    rel='stylesheet'
                    type='text/css'
                />
                <link
                    rel='preload'
                    as='font'
                    href='../../public/fonts/NotoNaskhArabic/NotoNaskhArabic-Regular.eot'
                />
                <link
                    rel='preload'
                    as='font'
                    href='../../public/fonts/NotoNaskhArabic/NotoNaskhArabic-Regular.eot?#iefix'
                />
                <link
                    rel='preload'
                    as='font'
                    href='../../public/fonts/NotoNaskhArabic/NotoNaskhArabic-Regular.woff2'
                />
                <link
                    rel='preload'
                    as='font'
                    href='../../public/fonts/NotoNaskhArabic/NotoNaskhArabic-Regular.woff'
                />
                <link
                    rel='preload'
                    as='font'
                    href='../../public/fonts/NotoNaskhArabic/NotoNaskhArabic-Regular.ttf'
                />
                <link
                    rel='preload'
                    as='font'
                    href='../../public/fonts/NotoNaskhArabic/NotoNaskhArabic-Regular.svg#NotoNaskhArabic-Regular'
                />

                <meta name='robots' content='follow, index' />
                <link href='/favicon.ico' rel='shortcut icon' />
                <meta content={meta.description} name='description' />
                <meta
                    property='og:url'
                    content={`https://kingsley.vercel.app${router.asPath}`}
                />
                <meta property='og:type' content='website' />
                <meta property='og:site_name' content={meta.title} />
                <meta property='og:description' content={meta.description} />
                <meta property='og:title' content={meta.title} />
                <meta property='og:image' content={meta.cardImage} />
                <meta name='twitter:card' content='summary_large_image' />
                <meta name='twitter:site' content='@vercel' />
                <meta name='twitter:title' content={meta.title} />
                <meta name='twitter:description' content={meta.description} />
                <meta name='twitter:image' content={meta.cardImage} />
            </Head>
            {children}
        </>
    );
}
