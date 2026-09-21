import {notFound} from 'next/navigation';
import {scenarioList,getScenario} from '@/lib/reading-scenarios';
import {questions} from '@/lib/tarot';
import ReadingRoom from '@/components/reading-room';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const q=getScenario(slug,false);return{title:q?`${q.title} — Free Tarot | Untold`:'Reading not found'}}
export default async function Reading({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{lang?:string}>}){const {slug}=await params;if(!questions.some(q=>q.id===slug)&&!scenarioList(false).some(q=>q.id===slug))notFound();const {lang}=await searchParams;return <ReadingRoom initialQuestion={slug} initialKo={lang==='ko'}/>}
