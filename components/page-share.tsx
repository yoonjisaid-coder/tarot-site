'use client';
import {useState} from 'react';
import {Share2} from 'lucide-react';
// Shares the current page (question page, card page, etc.) without any reading-result hash.
export default function PageShare({ko=false}:{ko?:boolean}){
 const [status,setStatus]=useState('');
 async function share(){
  const url=new URL(window.location.href);url.hash='';const href=url.toString();setStatus('');
  if(navigator.share){try{await navigator.share({title:document.title,url:href});return}catch(error){if(error instanceof Error&&error.name==='AbortError')return}}
  try{await navigator.clipboard.writeText(href);setStatus(ko?'페이지 링크를 복사했어요.':'Page link copied.')}catch{window.prompt(ko?'이 링크를 복사해 주세요.':'Copy this link:',href)}
 }
 return <span className="page-share"><button type="button" className="page-share-btn" onClick={share} aria-label={ko?'이 페이지 공유하기':'Share this page'}><Share2 size={16} aria-hidden="true"/>{ko?'공유':'Share'}</button><span className="page-share-status" role="status">{status}</span></span>
}
