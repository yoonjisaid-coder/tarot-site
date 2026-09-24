 'use client';
import {useState} from 'react';
import {Share2} from 'lucide-react';
import {Button} from '@/components/ui/button';
export default function ShareResult({ko,title,getUrl}:{ko:boolean;title:string;getUrl:()=>string}) {
 const [status,setStatus]=useState('');const [manual,setManual]=useState('');
 async function share(){
  const url=getUrl();setStatus('');setManual('');
  if(navigator.share){try{await navigator.share({title:`UNTOLD · ${title}`,url});return}catch(error){if(error instanceof Error&&error.name==='AbortError')return}}
  try{await navigator.clipboard.writeText(url);setStatus(ko?'결과 링크를 복사했어요.':'Result link copied.')}catch{setManual(url);setStatus(ko?'아래 링크를 선택해 복사해 주세요.':'Select and copy the link below.')}
 }
 return <div className="share-result"><Button className="secondary-btn" onClick={share}><Share2 size={18}/>{ko?'결과 공유하기':'Share your result'}</Button><p role="status">{status}</p>{manual&&<input aria-label={ko?'결과 공유 링크':'Result link'} readOnly value={manual} onFocus={e=>e.currentTarget.select()}/>}</div>;
}
