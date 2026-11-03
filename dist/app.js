import { projects } from './projects.js';

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() { menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Open navigation'); nav.classList.remove('is-open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded',String(open)); menu.setAttribute('aria-label',open?'Close navigation':'Open navigation'); nav.classList.toggle('is-open',open); });
nav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const restoreFocus=menu.getAttribute('aria-expanded')==='true'&&nav.contains(document.activeElement);closeMenu();if(restoreFocus)menu.focus();});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
matchMedia('(min-width:601px)').addEventListener('change',closeMenu);

function updateTime() { document.querySelector('#local-time').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())+' IST'; }
updateTime(); setInterval(updateTime,60000);
document.querySelector('#year').textContent=new Date().getFullYear();

const cards=[...document.querySelectorAll('.project-card')];
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(item=>{const active=item===button;item.classList.toggle('is-active',active);item.setAttribute('aria-pressed',String(active));});
  let count=0;
  cards.forEach(card=>{const show=button.dataset.filter==='all'||card.dataset.category===button.dataset.filter;card.hidden=!show;if(show)count++;});
  document.querySelector('#project-count').textContent=`${count} SELECTED PROJECT${count===1?'':'S'}`;
}));

const dialog=document.querySelector('#project-dialog');
let lastProjectTrigger=null;
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',(event)=>{
  event.preventDefault();
  const project=projects.find(item=>item.id===button.dataset.project);
  if(!project)return;
  lastProjectTrigger=button;
  document.querySelector('#dialog-eyebrow').textContent=project.eyebrow;
  document.querySelector('#dialog-title').textContent=project.title;
  document.querySelector('#dialog-summary').textContent=project.summary;
  document.querySelector('#dialog-description').textContent=project.description;
  document.querySelector('#dialog-capabilities').replaceChildren(...project.capabilities.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  document.querySelector('#dialog-stack').replaceChildren(...project.stack.map(text=>{const span=document.createElement('span');span.textContent=text;return span;}));
  const link=document.querySelector('#dialog-link');link.href=project.url;link.textContent=project.linkLabel+' ↗';
  document.querySelector('#dialog-links').replaceChildren(...(project.links||[]).map(item=>{const a=document.createElement('a');a.href=item.url;a.textContent=item.label+' ↗';a.target='_blank';a.rel='noopener noreferrer';return a;}));
  dialog.showModal();
}));
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
dialog.addEventListener('close',()=>lastProjectTrigger?.focus({preventScroll:true}));

const copyButton=document.querySelector('#copy-email');
const copyStatus=document.querySelector('#copy-status');
let statusTimer;
copyButton.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText('mavinash422@gmail.com');copyStatus.textContent='Email copied. Let’s make something good.';copyButton.setAttribute('aria-label','Email copied');}
  catch{copyStatus.textContent='You can select the email address to copy it, or click it to open your email app.';}
  clearTimeout(statusTimer);statusTimer=setTimeout(()=>{copyStatus.textContent='';copyButton.setAttribute('aria-label','Copy email address');},6500);
});

const sectionObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;nav.querySelectorAll('a').forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}},{rootMargin:'-20% 0px -55% 0px'});
document.querySelectorAll('main>section[id]').forEach(section=>sectionObserver.observe(section));
import('./scene.js').catch(()=>{document.querySelector('#motion-toggle').hidden=true;});
import('./motion.js').catch(()=>{});
import('./contact.js').catch(()=>{const status=document.querySelector('#form-status');status.textContent='The form could not load. Please email me directly.';document.querySelector('#send-message').disabled=true;document.querySelector('#email-fallback').hidden=false;});
