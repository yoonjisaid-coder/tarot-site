import type {Metadata} from 'next';

// Public origin used for canonical, hreflang, sitemap and social-preview URLs.
// Use the custom domain even when a page is requested through the Sites hostname.
export const SITE_URL='https://tarot.realizemylife.com';
export const SITE_NAME='Untold';

// English is served without a query (the app's default); Korean uses ?lang=ko, as the language switch does.
export const localePath=(path:string,ko:boolean)=>ko?`${path}?lang=ko`:path;
export const isKo=(lang?:string)=>lang==='ko';

// Canonical + hreflang alternates + Open Graph/Twitter for one page in one language.
export function pageMetadata({path,ko,title,description,image='/card-back.webp'}:{path:string;ko:boolean;title:string;description:string;image?:string}):Metadata{
 const url=localePath(path,ko);
 return {
  title,description,
  alternates:{canonical:url,languages:{en:path,ko:localePath(path,true),'x-default':path}},
  openGraph:{type:'website',siteName:SITE_NAME,title,description,url,locale:ko?'ko_KR':'en_US',alternateLocale:[ko?'en_US':'ko_KR'],images:[{url:image,alt:title}]},
  twitter:{card:'summary_large_image',title,description,images:[image]},
 };
}
