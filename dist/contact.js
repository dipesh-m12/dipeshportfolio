// Reuses the public API contract from Dipesh's original Contact.jsx.
const endpoint='https://email-service-tk9b.vercel.app/api/email';
const form=document.querySelector('#contact-form');
const status=document.querySelector('#form-status');
const send=document.querySelector('#send-message');
const fallback=document.querySelector('#email-fallback');
const fields=['name','email','message'].map(name=>form.elements.namedItem(name));
let sending=false;

function validate(field){
  let error='';
  if(!field.value.trim())error=field.name==='message'?'Please add a message.':field.name==='email'?'Please enter your email address.':'Please enter your name.';
  else if(field.name==='email'&&!field.validity.valid)error='Enter a valid email address, such as you@company.com.';
  field.setAttribute('aria-invalid',String(Boolean(error)));
  document.querySelector('#'+field.name+'-error').textContent=error;
  return !error;
}
fields.forEach(field=>{
  field.addEventListener('blur',()=>validate(field));
  field.addEventListener('input',()=>{if(field.getAttribute('aria-invalid')==='true'){field.removeAttribute('aria-invalid');document.querySelector('#'+field.name+'-error').textContent='';}});
});
form.elements.message.addEventListener('input',()=>{document.querySelector('#message-count').textContent=`${form.elements.message.value.length.toLocaleString('en-IN')} / 5,000`;});
form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(sending)return;
  const valid=fields.map(validate);
  if(valid.some(value=>!value)){fields[valid.indexOf(false)].focus();return;}
  if(form.elements.website.value){status.textContent='Please leave the website field empty.';return;}
  const [name,email,message]=fields.map(field=>field.value.trim());
  fallback.href=`mailto:mavinash422@gmail.com?subject=${encodeURIComponent('Website Contact')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
  fallback.hidden=true;
  sending=true;send.disabled=true;form.setAttribute('aria-busy','true');
  fields.forEach(field=>field.readOnly=true);
  send.textContent='Sending…';status.textContent='Sending your message…';status.dataset.state='sending';
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
  try{
    const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({email:'mavinash422@gmail.com',body:`Name: ${name}\nEmail: ${email}\nMessage: ${message}`,subject:'Website Contact',priority:'normal',category:'contact'})});
    if(!response.ok)throw new Error('Service rejected the request');
    // Some deployments return JSON, others plain text. An explicit failure must not appear successful.
    const responseBody=await response.text();let result;try{result=JSON.parse(responseBody);}catch{}
    if(result?.success===false||result?.error)throw new Error('Service reported a failure');
    status.textContent='Thank you — the service accepted your message. I’ll get back to you by email.';status.dataset.state='success';
    form.reset();fields.forEach(field=>field.removeAttribute('aria-invalid'));document.querySelector('#message-count').textContent='0 / 5,000';
  }catch(error){
    status.textContent=error.name==='AbortError'?'The service took too long to confirm. Your message is still here; you can send it through your email app.':'Your message could not be confirmed. Your text is still here — try again, or send it through your email app.';
    status.dataset.state='error';fallback.hidden=false;
  }finally{clearTimeout(timeout);sending=false;send.disabled=false;fields.forEach(field=>field.readOnly=false);form.removeAttribute('aria-busy');send.textContent='Send message ↗';}
});
