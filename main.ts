import {readdirSync,readFileSync,mkdirSync,writeFileSync} from "node:fs";
const IN=process.env.MAKEFUN_INPUT_DIR||"/input",OUT=process.env.MAKEFUN_OUTPUT_DIR||"/output";
// Pops/pushes table: T[op]=(pops<<2|pushes)+1, 0 = not an opcode.
const T=new Uint8Array(84);
const S=(a,b,p,q)=>{for(let i=a;i<=b;i++)T[i]=(p<<2|q)+1};
S(0,0,0,0);S(1,2,0,1);S(3,3,1,0);S(4,4,1,2);S(5,5,2,2);S(6,6,2,3);S(7,7,3,3);
S(16,22,2,1);S(23,23,1,1);S(24,26,2,1);S(27,27,1,1);S(28,30,2,1);S(32,34,2,1);
S(48,48,0,0);S(49,50,1,0);S(51,52,0,0);S(64,64,1,1);S(65,65,2,0);
S(80,81,1,0);S(82,82,0,1);S(83,83,1,0);
const TE=new TextEncoder();
function run(p,inp){
 const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),O=new Uint8Array(65536);
 let sp=0,cp=0,pc=0,st=0,ol=0,ip=0;const n=p.length;
 const end=e=>[O.slice(0,ol),e];
 for(;;){
  if(st===1e6)return end(10);
  if(pc<0||pc>=n)return end(9);
  const op=p[pc],t=T[op];
  if(!t)return end(5);
  const im=op===1?1:op===2?4:op>=48&&op<=51?2:0;
  if(pc+im>=n)return end(9);
  st++;
  const pp=(t-1)>>2,ps=(t-1)&3;
  if(sp<pp)return end(2);
  if(sp-pp+ps>256)return end(3);
  const nx=pc+1+im;pc=nx;
  if(op<8){
   if(op===0)return end(0);
   if(op===1){D[sp++]=(p[nx-1]<<24)>>24;continue;}
   if(op===2){D[sp++]=p[nx-4]|p[nx-3]<<8|p[nx-2]<<16|p[nx-1]<<24;continue;}
   if(op===3){sp--;continue;}
   if(op===4){D[sp]=D[sp-1];sp++;continue;}
   if(op===5){const x=D[sp-1];D[sp-1]=D[sp-2];D[sp-2]=x;continue;}
   if(op===6){D[sp]=D[sp-2];sp++;continue;}
   const a=D[sp-3];D[sp-3]=D[sp-2];D[sp-2]=D[sp-1];D[sp-1]=a;continue;
  }
  if(op>=16&&op<=34){
   if(op===23){D[sp-1]=-D[sp-1]|0;continue;}
   if(op===27){D[sp-1]=~D[sp-1];continue;}
   const b=D[sp-1],a=D[sp-2];let r;
   if(op===16)r=a+b|0;
   else if(op===17)r=a-b|0;
   else if(op===18)r=Math.imul(a,b);
   else if(op===19){if(!b)return end(4);r=a===-2147483648&&b===-1?a:(a/b)|0;}
   else if(op===20){if(!b)return end(4);r=b===-1?0:a%b|0;}
   else if(op===21){if(!b)return end(4);r=Math.floor((a>>>0)/(b>>>0))|0;}
   else if(op===22){if(!b)return end(4);r=(a>>>0)%(b>>>0)|0;}
   else if(op===24)r=a&b;
   else if(op===25)r=a|b;
   else if(op===26)r=a^b;
   else if(op===28)r=a<<(b&31);
   else if(op===29)r=a>>(b&31);
   else if(op===30)r=a>>>(b&31)|0;
   else if(op===32)r=a===b?1:0;
   else if(op===33)r=a<b?1:0;
   else r=a>>>0<b>>>0?1:0;
   sp-=2;D[sp++]=r;continue;
  }
  if(op>=48&&op<=52){
   if(op===48){pc=nx+(((p[nx-2]|p[nx-1]<<8)<<16)>>16);continue;}
   if(op===49||op===50){const v=D[--sp];if((op===49)===(v===0))pc=nx+(((p[nx-2]|p[nx-1]<<8)<<16)>>16);continue;}
   if(op===51){if(cp===64)return end(7);C[cp++]=nx;pc=p[nx-2]|p[nx-1]<<8;continue;}
   if(!cp)return end(8);pc=C[--cp];continue;
  }
  if(op===64){const a=D[sp-1];if(a<0||a>255)return end(6);D[sp-1]=M[a];continue;}
  if(op===65){const a=D[sp-1],v=D[sp-2];if(a<0||a>255)return end(6);sp-=2;M[a]=v;continue;}
  if(op===80){const y=TE.encode(String(D[sp-1]));if(ol+y.length>65536)return end(11);sp--;O.set(y,ol);ol+=y.length;continue;}
  if(op===81){if(ol+1>65536)return end(11);O[ol++]=D[--sp]&255;continue;}
  if(op===82){D[sp++]=ip<inp.length?inp[ip++]:-1;continue;}
  return end(D[--sp]&255);
 }
}
for(const id of readdirSync(IN).sort().filter(id=>/^i\d{3}$/.test(id))){
 const o=run(readFileSync(`${IN}/${id}/program.bin`),readFileSync(`${IN}/${id}/input.bin`));
 mkdirSync(`${OUT}/${id}`,{recursive:true});
 writeFileSync(`${OUT}/${id}/stdout.bin`,o[0]);
 writeFileSync(`${OUT}/${id}/exit.txt`,String(o[1]));
}
