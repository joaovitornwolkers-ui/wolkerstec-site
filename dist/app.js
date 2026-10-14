import { SERVICES, validateRequest, requestRows, requestText } from './quote-core.mjs';
const form = document.querySelector('#quote-form');
const serviceError = document.querySelector('#service-error');
const specificFields = document.querySelector('#specific-fields');
let selectedService = '', currentStep = 1, summaryData = null;
const savedFields = {};
const inputField = (id,label,placeholder) => `<div class="field"><label for="${id}">${label} <small>(opcional)</small></label><input id="${id}" name="device" maxlength="150" placeholder="${placeholder}"></div>`;
const selectField = (id,name,label,options) => `<div class="field"><label for="${id}">${label} <span>*</span></label><select id="${id}" name="${name}" required aria-describedby="${id}-error"><option value="">Selecione uma opção</option>${options.map(v=>`<option value="${v}">${v}</option>`).join('')}</select><span id="${id}-error" class="field-error" hidden></span></div>`;
function setStep(step, focus = true) {
  currentStep = step;
  document.querySelectorAll('.form-step').forEach((el,i)=>el.hidden=i+1!==step);
  document.querySelectorAll('.stepper li').forEach((el,i)=>{
    el.classList.toggle('active',i+1===step);el.classList.toggle('complete',i+1<step);
    if(i+1===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');
  });
  if(focus) document.querySelector(`#step-${step} h3`).focus({preventScroll:true});
}
function updateService(service) {
  if(!SERVICES[service]) return;
  if(selectedService && selectedService !== service) savedFields[selectedService] = Object.fromEntries([...specificFields.querySelectorAll('input,select')].map(el=>[el.name,el.value]));
  if(selectedService!==service){
    if(service==='pc'||service==='notebook') specificFields.innerHTML = selectField('issue','issue','Necessidade principal',['Lentidão ou travamentos','Não liga ou não inicia','Aquecimento ou ruído','Limpeza preventiva','Instalação ou configuração de sistema','Problema na tela ou imagem','Outro problema']) + inputField('device','Marca, modelo ou configuração',service==='pc'?'Ex.: Ryzen 5, 8 GB de RAM, SSD 500 GB':'Ex.: Dell Inspiron 15');
    if(service==='pecas') specificFields.innerHTML = `<div class="field-row">${selectField('component','component','Componente',['SSD ou armazenamento','Memória RAM','Placa de vídeo','Processador','Placa-mãe','Fonte','Outro componente','Preciso de orientação'])}${selectField('scope','scope','O que precisa',['Comprar a peça','Instalar peça que já tenho','Comprar e instalar','Avaliar um upgrade'])}</div>` + inputField('device','Equipamento e configuração atual','Informe marca, modelo ou componentes atuais');
    if(service==='cftv') specificFields.innerHTML = `<div class="field-row">${selectField('objective','objective','Tipo de serviço',['Instalação de câmeras','Manutenção de sistema','Configuração ou acesso remoto','Ampliação de sistema','Preciso de orientação'])}${selectField('environment','environment','Ambiente',['Residencial','Comercial','Condomínio','Outro ambiente'])}</div>${selectField('equipment','equipment','Você já tem os equipamentos?',['Sim, já tenho os equipamentos','Quero orçamento dos equipamentos também','Tenho parte dos equipamentos','Ainda não sei'])}<div class="field-row"><div class="field"><label for="cameraCount">Quantidade de câmeras <small>(opcional)</small></label><input id="cameraCount" name="cameraCount" type="number" inputmode="numeric" min="1" max="128" step="1" placeholder="Ex.: 4" aria-describedby="cameraCount-error"><span class="field-error" id="cameraCount-error" hidden></span></div>${inputField('device','Marca ou modelo do sistema','Ex.: câmeras Intelbras Wi-Fi')}</div>`;
    const cached = savedFields[service];
    if(cached) specificFields.querySelectorAll('input,select').forEach(el=>el.value=cached[el.name]||'');
  }
  selectedService = service;
  document.querySelector(`input[name="service"][value="${service}"]`).checked=true;
  document.querySelector('#service-advice').textContent=SERVICES[service].advice;
  const list=document.querySelector('#advice-list');list.replaceChildren();
  SERVICES[service].tips.forEach(t=>{const li=document.createElement('li');li.textContent=t;list.append(li)});
  document.querySelector('#description').placeholder=service==='cftv'?'Ex.: Quero instalar 4 câmeras em uma loja e configurar o acesso pelo celular.':service==='pecas'?'Ex.: Quero adicionar um SSD ao notebook e preciso de ajuda com a compatibilidade.':'Ex.: O equipamento está lento e aquecendo. O problema começou há duas semanas.';
  serviceError.hidden=true;
  form.querySelectorAll('input[name="service"]').forEach(el=>el.removeAttribute('aria-invalid'));
}
form.addEventListener('change',event=>{if(event.target.name==='service')updateService(event.target.value)});
document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{
  updateService(button.dataset.service);setStep(1,false);document.querySelector('#orcamento').scrollIntoView({behavior:'smooth',block:'start'});document.querySelector(`input[name="service"][value="${selectedService}"]`).focus({preventScroll:true});
}));
document.querySelector('#to-details').addEventListener('click',()=>{
  if(!selectedService){serviceError.hidden=false;form.querySelector('input[name="service"]').focus({preventScroll:true});form.querySelectorAll('input[name="service"]').forEach(el=>el.setAttribute('aria-invalid','true'));return}
  setStep(2);scrollToForm();
});
document.querySelector('#back-to-service').addEventListener('click',()=>{setStep(1);scrollToForm()});
function scrollToForm(){document.querySelector('.form-panel').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}
const errorIDs={customerName:'customer-name-error',phone:'phone-error',description:'description-error'};
function clearErrors(){form.querySelectorAll('.field-error').forEach(el=>el.hidden=true);form.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'))}
form.addEventListener('input',event=>{
  const el=event.target;el.removeAttribute('aria-invalid');
  const error=document.getElementById(errorIDs[el.name]||el.name+'-error');if(error)error.hidden=true;
  if(el.name==='description')document.querySelector('#char-count').textContent=el.value.length+'/2000';
});
form.addEventListener('submit',event=>{
  event.preventDefault();if(currentStep!==2)return;
  clearErrors();const data=Object.fromEntries(new FormData(form));const errors=validateRequest(data);
  if(Object.keys(errors).length){
    let first;
    for(const [name,message] of Object.entries(errors)){
      const el=form.elements.namedItem(name);const error=document.getElementById(errorIDs[name]||name+'-error');
      if(el?.setAttribute){el.setAttribute('aria-invalid','true');if(!first)first=el}
      if(error){error.textContent=message;error.hidden=false}
    }
    first?.focus();return;
  }
  summaryData=data;const list=document.querySelector('#summary-details');list.replaceChildren();
  for(const [label,value] of requestRows(data)){const row=document.createElement('div');row.className='summary-row';const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;row.append(dt,dd);list.append(row)}
  document.querySelector('#action-status').textContent='';document.querySelector('#copy-fallback').hidden=true;setStep(3);scrollToForm();
});
document.querySelector('#edit-details').addEventListener('click',()=>{setStep(2);scrollToForm()});
document.querySelector('#copy-summary').addEventListener('click',async()=>{
  if(!summaryData)return;const text=requestText(summaryData);const status=document.querySelector('#action-status');
  try{await navigator.clipboard.writeText(text);status.textContent='Pedido copiado. Agora você pode colar no seu canal de atendimento.'}
  catch{const box=document.querySelector('#copy-fallback');box.hidden=false;const input=document.querySelector('#copy-text');input.value=text;input.focus();input.select();status.textContent='Use Copiar no seu dispositivo para copiar o texto selecionado.'}
});
document.querySelector('#download-summary').addEventListener('click',()=>{
  if(!summaryData)return;const url=URL.createObjectURL(new Blob([requestText(summaryData)],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Pedido_Orcamento_Wolkerstec.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#action-status').textContent='Arquivo preparado para download. O envio continua sendo manual.';
});
document.querySelector('#new-request').addEventListener('click',()=>{
  form.reset();Object.keys(savedFields).forEach(key=>delete savedFields[key]);selectedService='';summaryData=null;specificFields.replaceChildren();clearErrors();serviceError.hidden=true;document.querySelector('#char-count').textContent='0/2000';document.querySelector('#description').placeholder='Descreva o problema ou o serviço desejado.';document.querySelector('#service-advice').textContent='Selecione um serviço e veja quais informações ajudam a entender sua necessidade.';const list=document.querySelector('#advice-list');list.replaceChildren();['Tipo de equipamento ou sistema','O problema ou resultado desejado','Marca e modelo, se souber'].forEach(t=>{const li=document.createElement('li');li.textContent=t;list.append(li)});document.querySelector('#summary-details').replaceChildren();document.querySelector('#action-status').textContent='';document.querySelector('#copy-text').value='';document.querySelector('#copy-fallback').hidden=true;setStep(1);scrollToForm();
});
const menuToggle=document.querySelector('.menu-toggle');const nav=document.querySelector('#main-nav');
function closeMenu(){menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Abrir menu');nav.classList.remove('open')}
menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){closeMenu();menuToggle.focus()}});
document.querySelector('#year').textContent=new Date().getFullYear();
