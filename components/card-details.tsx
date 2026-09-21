'use client';
import type {ReactNode} from 'react';
import {Dialog,DialogTrigger,DialogContent,DialogTitle,DialogDescription,DialogClose} from './ui/dialog';
import {cardScene} from '@/lib/card-scenes';
import {X} from 'lucide-react';
import type {Card} from '@/lib/tarot';
export default function CardDetails({card,ko=false,children,className='learn-link'}:{card:Card;ko?:boolean;children:ReactNode;className?:string}){return <Dialog><DialogTrigger asChild><button type="button" className={className}>{children}</button></DialogTrigger><DialogContent className="card-detail-dialog" showCloseButton={false}><DialogClose className="detail-close" aria-label={ko?'닫기':'Close'}><X size={22}/></DialogClose><DialogTitle>{card.name}</DialogTitle><DialogDescription>{card.keyword} · {ko?'카드의 의미와 상징':'Meaning & symbolism'}</DialogDescription><img className="modal-card-art" src={card.image} alt={card.name}/>{ko&&<><h3>관계에서 만나는 상징</h3><p>{cardScene(card.id)}</p></>}<h3>{ko?'정방향':'Upright'}</h3><p>{card.upright}</p><h3>{ko?'역방향':'Reversed'}</h3><p>{card.reversed}</p><p>{ko?'카드의 기본 상징이에요. 나의 리딩에서는 선택한 상황과 질문, 카드가 놓인 자리에 따라 이 의미를 다르게 연결해 읽어요.':'These are the card’s core themes. Your reading connects them to your situation, question and the card’s position.'}</p></DialogContent></Dialog>}
