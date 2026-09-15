import ReadingRoom from '@/components/reading-room';
export default async function Home({searchParams}:{searchParams:Promise<{lang?:string}>}){const {lang}=await searchParams;return <ReadingRoom initialKo={lang==='ko'}/>}
