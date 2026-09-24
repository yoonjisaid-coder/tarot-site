import {notFound} from 'next/navigation';
import {scenarioList,getScenario} from '@/lib/reading-scenarios';
import {questions} from '@/lib/tarot';
import ReadingRoom from '@/components/reading-room';
export async function generateMetadata({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{lang?:string}>}){const {slug}=await params;const {lang}=await searchParams;const q=getScenario(slug,lang==='ko');return{title:`${q.title} | Untold`,description:q.focus}}
export default async function Reading({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{lang?:string}>}){const {slug}=await params;if(!questions.some(q=>q.id===slug)&&!scenarioList(false).some(q=>q.id===slug))notFound();const {lang}=await searchParams;return <ReadingRoom initialQuestion={slug} initialKo={lang==='ko'}/>}
