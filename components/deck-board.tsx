'use client';
export default function DeckBoard({total,chosen=[],limit=1,onPick,ko=false,tint=''}:{total:number;chosen?:number[];limit?:number;onPick:(i:number)=>void;ko?:boolean;tint?:string}){
 const compact=total<78;
 return <div className="whole-deck-board">
  <p className="whole-deck-caption">{ko?(`${total}장 전체가 펼쳐져 있어요. 마음이 가는 카드를 직접 골라 주세요.`):(`All ${total} cards are visible. Choose the card that draws you first.`)}</p>
  <div className={`whole-deck-grid ${compact?'oracle-grid':''}`} role="group" aria-label={ko?`${total}장 전체 덱`:`Full ${total}-card deck`}>
   {Array.from({length:total},(_,i)=>{const selected=chosen.includes(i);return <button key={i} type="button" className={`whole-deck-card ${selected?'selected':''}`} aria-label={ko?`${i+1}번째 카드 선택`:`Select face-down card ${i+1}`} aria-pressed={selected} disabled={selected||chosen.length>=limit} onClick={()=>onPick(i)} style={{filter:tint||undefined}}>
    <img src="/card-back.webp" alt="" draggable={false}/>
    {selected&&<span className="whole-deck-order" aria-hidden="true">{chosen.indexOf(i)+1}</span>}
   </button>})}
  </div>
 </div>
}
