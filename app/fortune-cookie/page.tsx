import Cookie from '@/components/fortune-cookie';
import {pageMetadata,isKo} from '@/lib/seo';
export async function generateMetadata({searchParams}:{searchParams:Promise<{lang?:string}>}){const ko=isKo((await searchParams).lang);return pageMetadata({path:'/fortune-cookie',ko,title:ko?'나의 포춘쿠키 — Untold':'Your Fortune Cookie — Untold',description:ko?'오늘 하루를 위한 짧은 메시지 하나를 열어 보세요.':'Open one short message for your day.'})}
export default async function Page({searchParams}:{searchParams:Promise<{lang?:string}>}){return <Cookie initialKo={(await searchParams).lang==='ko'}/>}
