import {Moon} from 'lucide-react';
export function Header(){return <header><a className="brand" href="/" aria-label="Untold Love Tarot home"><Moon size={25}/>untold<span className="brand-period">.</span></a><nav aria-label="Main navigation"><a href="/">Love readings</a><a href="/card-meanings">The cards</a><a href="/about">About</a></nav></header>}
export function Footer(){return <footer><span>untold. &nbsp; A little perspective for your heart.</span><div><a href="/about">About & credits</a><a href="/privacy">Privacy</a><span>© {new Date().getFullYear()} Untold</span></div></footer>}
