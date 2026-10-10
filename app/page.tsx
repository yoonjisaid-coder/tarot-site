import ReadingRoom from '@/components/reading-room';
import {pageMetadata,isKo} from '@/lib/seo';
export async function generateMetadata({searchParams}:{searchParams:Promise<{lang?:string}>}){const ko=isKo((await searchParams).lang);return pageMetadata({path:'/',ko,title:ko?'Untold — 무료 연애 타로 리딩':'Untold — Free Love Tarot Reading',description:ko?'짝사랑, 썸, 이별과 재회 고민을 78장 타로 카드로 직접 뽑아 읽어 보세요. 회원가입 없이 무료예요.':'Pick your own cards for love, feelings, contact and reconciliation. A full tarot deck, a clarity card and a message for you. Free, with no sign-up.'})}
export default async function Home({searchParams}:{searchParams:Promise<{lang?:string}>}){const {lang}=await searchParams;return <ReadingRoom initialKo={lang==='ko'}/>}
