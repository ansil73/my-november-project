export const stocks=[
{symbol:'HDFCBANK',name:'HDFC Bank',sector:'Banking',price:1728.40,change:1.24,score:82,trend:'Bullish',setup:'Pullback',horizon:'Weekly',support:1685,target:1815},
{symbol:'TCS',name:'Tata Consultancy Services',sector:'Technology',price:4126.75,change:0.86,score:78,trend:'Bullish',setup:'Trend continuation',horizon:'Monthly',support:3980,target:4420},
{symbol:'RELIANCE',name:'Reliance Industries',sector:'Energy',price:1462.30,change:-0.42,score:64,trend:'Neutral',setup:'Consolidation',horizon:'Monthly',support:1410,target:1560},
{symbol:'BHARTIARTL',name:'Bharti Airtel',sector:'Telecom',price:1638.20,change:1.76,score:85,trend:'Bullish',setup:'Breakout watch',horizon:'Weekly',support:1580,target:1750},
{symbol:'INFY',name:'Infosys',sector:'Technology',price:1834.60,change:-0.68,score:54,trend:'Bearish',setup:'Support test',horizon:'Today',support:1780,target:1920},
{symbol:'LT',name:'Larsen & Toubro',sector:'Industrials',price:3675.50,change:1.12,score:80,trend:'Bullish',setup:'Pullback',horizon:'Monthly',support:3540,target:3950},
{symbol:'ICICIBANK',name:'ICICI Bank',sector:'Banking',price:1284.90,change:0.95,score:79,trend:'Bullish',setup:'Trend continuation',horizon:'Today',support:1240,target:1370},
{symbol:'ITC',name:'ITC',sector:'Consumer',price:462.15,change:-0.31,score:61,trend:'Neutral',setup:'Range watch',horizon:'Weekly',support:445,target:495}];
export type Stock=typeof stocks[number];
export const indices=[{name:'NIFTY 50',value:'24,768.30',change:0.84,points:'+206.40'},{name:'SENSEX',value:'81,224.75',change:0.78,points:'+628.10'},{name:'NIFTY BANK',value:'52,380.60',change:1.16,points:'+600.65'},{name:'INDIA VIX',value:'13.42',change:-2.18,points:'−0.30'}];
export const sectors=[['Banking',1.42],['Industrials',1.18],['Telecom',0.96],['Technology',0.62],['Consumer',-0.28],['Energy',-0.46]] as const;
export const money=(v:number)=>new Intl.NumberFormat('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2}).format(v);
export function longCall(strike:number,premium:number,units:number,expiry:number){if(![strike,premium,units,expiry].every(Number.isFinite)||strike<0||premium<0||units<1||!Number.isInteger(units)||expiry<0)throw new Error('Enter non-negative prices and whole units of at least 1.');return {profit:(Math.max(expiry-strike,0)-premium)*units,maxLoss:premium*units,breakeven:strike+premium}}
