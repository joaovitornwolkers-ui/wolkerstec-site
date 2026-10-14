export const SERVICES = Object.freeze({
  pc: {name:'Manutenção de PC',advice:'Para avaliar seu PC, conte como a falha aparece e o que já tentou fazer.',tips:['Marca, modelo ou configuração','Sintomas e quando começaram','O que você deseja melhorar']},
  notebook: {name:'Manutenção de notebook',advice:'As informações do notebook ajudam a identificar o reparo ou a manutenção necessária.',tips:['Marca e modelo, se souber','Se liga, carrega ou apresenta imagem','Falhas, aquecimento ou lentidão']},
  pecas: {name:'Venda e instalação de peças',advice:'Vamos entender o upgrade que você deseja e o equipamento que vai receber as peças.',tips:['Componente que você procura','Configuração atual do equipamento','Se precisa da peça, instalação ou ambos']},
  cftv: {name:'Câmeras e CFTV',advice:'Conte sobre o local e o sistema para ajudar no planejamento do serviço.',tips:['Tipo de ambiente e quantidade de câmeras','Se já possui os equipamentos','Instalação, configuração ou manutenção']}
});
const clean = value => String(value ?? '').trim();
export function validateRequest(data) {
  const errors = {};
  if (!SERVICES[data.service]) errors.service = 'Escolha um serviço para continuar.';
  if (!clean(data.customerName)) errors.customerName = 'Informe seu nome.';
  const digits = clean(data.phone).replace(/\D/g, '');
  if (clean(data.phone) && (digits.length < 10 || digits.length > 11 || /[^\d\s()+.\-]/.test(data.phone))) errors.phone = 'Informe um telefone com DDD (10 ou 11 dígitos).';
  if (clean(data.description).length < 15) errors.description = 'Descreva sua necessidade com pelo menos 15 caracteres.';
  if (clean(data.description).length > 2000) errors.description = 'Use até 2000 caracteres.';
  if (['pc','notebook'].includes(data.service) && !clean(data.issue)) errors.issue = 'Selecione a necessidade principal.';
  if (data.service === 'pecas') {
    if (!clean(data.component)) errors.component = 'Selecione o componente.';
    if (!clean(data.scope)) errors.scope = 'Selecione o que precisa.';
  }
  if (data.service === 'cftv') {
    if (!clean(data.objective)) errors.objective = 'Selecione o tipo de serviço.';
    if (!clean(data.environment)) errors.environment = 'Selecione o ambiente.';
    if (!clean(data.equipment)) errors.equipment = 'Informe se já possui os equipamentos.';
    if (clean(data.cameraCount) && (!/^\d+$/.test(clean(data.cameraCount)) || Number(data.cameraCount)<1 || Number(data.cameraCount)>128)) errors.cameraCount = 'Informe de 1 a 128 câmeras ou deixe em branco.';
  }
  return errors;
}
export function requestRows(data) {
  const rows = [['Serviço', SERVICES[data.service]?.name || ''], ['Nome',clean(data.customerName)]];
  if(clean(data.phone)) rows.push(['Telefone',clean(data.phone)]);
  if(['pc','notebook'].includes(data.service)) { rows.push(['Necessidade',clean(data.issue)]); if(clean(data.device)) rows.push(['Equipamento',clean(data.device)]); }
  if(data.service==='pecas') { rows.push(['Componente',clean(data.component)],['O que precisa',clean(data.scope)]); if(clean(data.device)) rows.push(['Equipamento',clean(data.device)]); }
  if(data.service==='cftv') {
    rows.push(['Tipo de serviço',clean(data.objective)],['Ambiente',clean(data.environment)],['Equipamentos',clean(data.equipment)]);
    rows.push(['Câmeras',clean(data.cameraCount)||'Quantidade a definir']);
    if(clean(data.device)) rows.push(['Sistema / modelo',clean(data.device)]);
  }
  rows.push(['Detalhes',clean(data.description)]);
  if(clean(data.location)) rows.push(['Cidade e bairro',clean(data.location)]);
  rows.push(['Prazo desejado',clean(data.timeframe)||'Sem prazo definido']);
  return rows;
}
export function requestText(data) {
  return 'PEDIDO DE ORÇAMENTO — WOLKERSTEC\n\n' + requestRows(data).map(([label,value])=>label+': '+value).join('\n') + '\n\nValor e disponibilidade sujeitos à avaliação.\nResumo preparado para envio manual.\n';
}
