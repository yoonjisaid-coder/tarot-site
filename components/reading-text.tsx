export default function ReadingText({text}:{text:string}) {
 const sentences=text.match(/[^.!?。！？]+[.!?。！？]*/g)?.map(s=>s.trim()).filter(Boolean)??[text];
 const paragraphs:string[]=[];
 for(let i=0;i<sentences.length;i+=2)paragraphs.push(sentences.slice(i,i+2).join(' '));
 return <>{paragraphs.map((paragraph,i)=><p key={i}>{paragraph}</p>)}</>;
}
