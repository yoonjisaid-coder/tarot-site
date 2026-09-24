'use client';
import {useEffect,useRef} from 'react';
export default function DeckBoard({total,chosen=[],limit=1,onPick,ko=false,tint=''}:{total:number;chosen?:number[];limit?:number;onPick:(i:number)=>void;ko?:boolean;tint?:string}){
 const board=useRef<HTMLDivElement>(null);
 useEffect(()=>{board.current?.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})},[]);
 return <div ref={board} className="whole-deck-board">
 <p className="whole-deck-caption" aria-live="polite">{ko?`${total}장 전체 · ${limit}장 중 ${chosen.length}장 선택`:`All ${total} cards · ${chosen.length} of ${limit} selected`}</p>
 <div className={`whole-deck-grid ${total===78?'classic-grid':'oracle-grid'}`} aria-label={ko?`${total}장 전체 선택판`:`All ${total} cards`}>
 {Array.from({length:total},(_,i)=>{const selected=chosen.includes(i);return <button key={i} type="button" className={`whole-deck-card ${selected?'selected':''}`} aria-label={ko?`${i+1}번째 카드 선택`:`Select face-down card ${i+1}`} aria-pressed={selected} disabled={selected||chosen.length>=limit} onClick={()=>onPick(i)}><img src="/card-back.webp" alt="" draggable={false} style={{filter:tint||undefined}}/>{selected&&<span className="whole-deck-order">{chosen.indexOf(i)+1}</span>}</button>})}
 </div></div>
}
