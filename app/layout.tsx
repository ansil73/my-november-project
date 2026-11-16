import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'MarketScope India — Research workspace',description:'A private Indian market research workspace with transparent data status.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
