import type {MetadataRoute} from 'next';
import {SITE_URL,localePath} from '@/lib/seo';
import {cards,questions} from '@/lib/tarot';
import {scenarioList,aliases} from '@/lib/reading-scenarios';

// Every public page in English (no query) and Korean (?lang=ko), each listing the other as its hreflang alternate.
// Legacy question ids that alias a current question are left out; their pages point canonical at the current one.
export default function sitemap():MetadataRoute.Sitemap{
 const readings=[...new Set([...scenarioList(false).map(q=>q.id),...questions.map(q=>q.id)])].filter(id=>!(id in aliases));
 const paths=['/','/card-meanings',...cards.map(c=>`/card-meanings/${c.slug}`),...readings.map(id=>`/reading/${id}`),'/fortune-cookie','/about','/privacy'];
 return paths.flatMap(path=>{
  const languages={en:SITE_URL+path,ko:SITE_URL+localePath(path,true),'x-default':SITE_URL+path};
  return [false,true].map(ko=>({url:SITE_URL+localePath(path,ko),alternates:{languages}}));
 });
}
