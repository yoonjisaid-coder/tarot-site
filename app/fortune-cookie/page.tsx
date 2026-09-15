import Cookie from '@/components/fortune-cookie';
export default async function Page({searchParams}:{searchParams:Promise<{lang?:string}>}){return <Cookie initialKo={(await searchParams).lang==='ko'}/>}
