export const EDITAL_URL = 'https://anexos-r2.selecao.net.br/uploads/861/concursos/3056/anexos/b852c323-8771-4021-bbbd-8032e88e58e0.pdf';
export const QUADRIX_URL = 'https://quadrix.org.br/informacoes/3056/';

export const roles = {
  tecnico: {
    id: 'tecnico', code: '202', short: 'TDAS', name: 'Técnico Administrativo', fullName: 'TDAS — Técnico Administrativo', level: 'Nível médio', topics: 84,
    subjects: ['Língua Portuguesa', 'Distrito Federal e RIDE', 'Política para Mulheres', 'Legislação do DF', 'Noções de Primeiros Socorros', 'Políticas de Assistência Social', 'Direito Constitucional', 'Direito Administrativo', 'Atendimento ao Público', 'Redação Oficial', 'Arquivologia', 'Administração de Materiais', 'Gestão Patrimonial', 'Lei nº 14.133/2021']
  },
  educador: {
    id: 'educador', code: '405', short: 'EDAS', name: 'Educador Social', fullName: 'EDAS — Educador Social', level: 'Nível superior', topics: 112,
    subjects: ['Língua Portuguesa', 'Distrito Federal e RIDE', 'Política para Mulheres', 'Legislação do DF', 'Noções de Primeiros Socorros', 'Políticas de Assistência Social', 'Seguridade Social', 'Dinâmica Familiar', 'Prática Socioeducativa', 'Trabalho Social com Famílias', 'Acolhimento e Escuta', 'Direitos Humanos', 'Criança e Adolescente', 'Pessoa Idosa e PcD', 'População em Situação de Rua', 'Redução de Danos']
  }
};

export const commonSubjects = [
  { name: 'Língua Portuguesa', icon: 'book', progress: 72, accuracy: 81, questions: 88, color: '#1477d4', topics: 12 },
  { name: 'Distrito Federal e RIDE', icon: 'map', progress: 48, accuracy: 67, questions: 42, color: '#7655d8', topics: 7 },
  { name: 'Política para Mulheres', icon: 'shield', progress: 63, accuracy: 74, questions: 36, color: '#d6578b', topics: 6 },
  { name: 'Legislação do DF', icon: 'scale', progress: 55, accuracy: 62, questions: 51, color: '#eea71b', topics: 10 },
  { name: 'Noções de Primeiros Socorros', icon: 'heart', progress: 41, accuracy: 70, questions: 29, color: '#e34f5f', topics: 5 },
  { name: 'Políticas de Assistência Social', icon: 'users', progress: 69, accuracy: 78, questions: 78, color: '#15a369', topics: 13 }
];

export const specificSubjects = {
  tecnico: [
    { name: 'Direito Constitucional', icon: 'landmark', progress: 58, accuracy: 73, questions: 45, color: '#1477d4', topics: 7 },
    { name: 'Direito Administrativo', icon: 'scale', progress: 46, accuracy: 59, questions: 62, color: '#e34f5f', topics: 9 },
    { name: 'Atendimento ao Público', icon: 'message', progress: 81, accuracy: 86, questions: 31, color: '#15a369', topics: 4 },
    { name: 'Redação Oficial', icon: 'edit', progress: 75, accuracy: 79, questions: 39, color: '#7655d8', topics: 5 },
    { name: 'Arquivologia', icon: 'archive', progress: 62, accuracy: 64, questions: 47, color: '#eea71b', topics: 7 },
    { name: 'Materiais e Patrimônio', icon: 'box', progress: 39, accuracy: 56, questions: 28, color: '#ec702b', topics: 8 },
    { name: 'Lei nº 14.133/2021', icon: 'file', progress: 44, accuracy: 61, questions: 54, color: '#e34f5f', topics: 9 }
  ],
  educador: [
    { name: 'Seguridade Social', icon: 'shield', progress: 57, accuracy: 69, questions: 41, color: '#1477d4', topics: 6 },
    { name: 'Dinâmica Familiar', icon: 'users', progress: 63, accuracy: 76, questions: 35, color: '#7655d8', topics: 5 },
    { name: 'Prática Socioeducativa', icon: 'heart', progress: 71, accuracy: 82, questions: 61, color: '#15a369', topics: 11 },
    { name: 'Trabalho Social com Famílias', icon: 'home', progress: 59, accuracy: 73, questions: 48, color: '#eea71b', topics: 8 },
    { name: 'Direitos Humanos', icon: 'globe', progress: 49, accuracy: 65, questions: 52, color: '#d6578b', topics: 12 },
    { name: 'Criança e Adolescente', icon: 'star', progress: 54, accuracy: 68, questions: 57, color: '#ec702b', topics: 10 },
    { name: 'Redução de Danos', icon: 'activity', progress: 36, accuracy: 55, questions: 27, color: '#e34f5f', topics: 5 }
  ]
};

const commonQuestions = [
  {
    subject: 'Língua Portuguesa', topic: 'Coesão e coerência', difficulty: 'Médio',
    text: 'Em um texto oficial, a substituição de uma expressão por um pronome que retoma inequivocamente um termo anterior contribui, sobretudo, para qual mecanismo textual?',
    options: ['Coesão referencial', 'Variação linguística', 'Ambiguidade estrutural', 'Intertextualidade', 'Pressuposição lexical'], answer: 0,
    explanation: 'A retomada de um termo já mencionado por pronome estabelece coesão referencial e evita repetição desnecessária, sem romper a continuidade temática.',
    reference: 'Edital nº 1/2026, item 20.2.1 — Língua Portuguesa; gramática normativa e linguística textual.'
  },
  {
    subject: 'Língua Portuguesa', topic: 'Concordância verbal', difficulty: 'Médio',
    text: 'Assinale a alternativa em que a concordância verbal está de acordo com a norma-padrão.',
    options: ['Fazem dois anos que o programa começou.', 'Houveram mudanças no atendimento.', 'Existe políticas públicas integradas.', 'Devem existir soluções intersetoriais.', 'Tratam-se de medidas urgentes.'], answer: 3,
    explanation: 'Em “devem existir soluções”, o verbo existir é pessoal e concorda com “soluções”. Fazer indicando tempo e haver com sentido de existir são impessoais; “trata-se” permanece no singular.',
    reference: 'Edital nº 1/2026, item 20.2.1 — morfossintaxe e concordância.'
  },
  {
    subject: 'Distrito Federal e RIDE', topic: 'Realidade do Distrito Federal', difficulty: 'Fácil',
    text: 'A Região Integrada de Desenvolvimento do Distrito Federal e Entorno (RIDE/DF) expressa uma estratégia de planejamento que busca, principalmente,',
    options: ['eliminar a autonomia dos municípios integrantes.', 'articular ações administrativas entre entes federativos da região.', 'transformar todos os municípios em regiões administrativas do DF.', 'transferir competências estaduais exclusivamente à União.', 'restringir a mobilidade entre o Distrito Federal e Goiás.'], answer: 1,
    explanation: 'A lógica da RIDE é a articulação de ações administrativas e políticas públicas de interesse comum em uma região que ultrapassa os limites do Distrito Federal.',
    reference: 'Edital nº 1/2026, item 20.2.1 — Realidade do Distrito Federal e RIDE.'
  },
  {
    subject: 'Política para Mulheres', topic: 'Lei Maria da Penha', difficulty: 'Médio',
    text: 'Nos termos da Lei Maria da Penha, a retenção, subtração ou destruição de objetos, documentos pessoais, bens e recursos econômicos da mulher caracteriza violência',
    options: ['física.', 'psicológica.', 'sexual.', 'patrimonial.', 'institucional.'], answer: 3,
    explanation: 'A conduta descrita integra o conceito de violência patrimonial previsto na Lei Maria da Penha.',
    reference: 'Lei nº 11.340/2006, art. 7º, IV. Verificação de vigência exigida antes de publicação definitiva.'
  },
  {
    subject: 'Legislação do DF', topic: 'Lei Complementar nº 840/2011', difficulty: 'Difícil',
    text: 'No estudo do regime jurídico dos servidores públicos civis do Distrito Federal, provimento e vacância devem ser compreendidos como institutos relacionados, respectivamente,',
    options: ['à criação e à extinção de órgãos.', 'ao preenchimento e à desocupação de cargo público.', 'à nomeação política e à exoneração judicial.', 'à contratação temporária e à terceirização.', 'à estabilidade e à disponibilidade financeira.'], answer: 1,
    explanation: 'Provimento designa o preenchimento do cargo público; vacância indica a sua desocupação nas hipóteses legalmente previstas.',
    reference: 'LC Distrital nº 840/2011 e alterações; Edital nº 1/2026, item 20.2.1.'
  },
  {
    subject: 'Noções de Primeiros Socorros', topic: 'Segurança da cena', difficulty: 'Fácil',
    text: 'Ao se deparar com uma pessoa aparentemente inconsciente, a primeira providência do socorrista leigo deve ser',
    options: ['oferecer água imediatamente.', 'movimentar a vítima para que ela desperte.', 'verificar a segurança da cena antes de se aproximar.', 'administrar medicamento disponível.', 'iniciar transporte em veículo particular.'], answer: 2,
    explanation: 'A avaliação da segurança da cena precede o contato com a vítima, evitando que o socorrista se torne uma nova vítima. Em seguida, avaliam-se responsividade e necessidade de acionar o serviço especializado.',
    reference: 'Edital nº 1/2026, item 20.2.1 — noções de primeiros socorros.'
  },
  {
    subject: 'Políticas de Assistência Social', topic: 'SUAS', difficulty: 'Médio',
    text: 'No Sistema Único de Assistência Social, a organização das ações considera a proteção social básica e a proteção social especial. A proteção social básica tem como foco',
    options: ['exclusivamente a aplicação de sanções.', 'a prevenção de situações de risco por meio do fortalecimento de potencialidades e vínculos.', 'somente o acolhimento institucional de alta complexidade.', 'a investigação criminal de violações de direitos.', 'a concessão de benefícios previdenciários contributivos.'], answer: 1,
    explanation: 'A proteção social básica atua preventivamente, fortalecendo potencialidades, aquisições e vínculos familiares e comunitários.',
    reference: 'PNAS/2004 e NOB/SUAS; Edital nº 1/2026, item 20.2.3.1.'
  },
  {
    subject: 'Políticas de Assistência Social', topic: 'LOAS', difficulty: 'Médio',
    text: 'A assistência social, conforme seu marco normativo, integra a seguridade social e possui natureza',
    options: ['contributiva e restrita aos segurados.', 'não contributiva, voltada à garantia de mínimos sociais.', 'privada, condicionada à filantropia.', 'trabalhista, vinculada ao contrato de emprego.', 'tributária, vinculada ao recolhimento individual.'], answer: 1,
    explanation: 'A assistência social é política de seguridade social não contributiva. O acesso não depende de contribuição prévia do usuário.',
    reference: 'Lei nº 8.742/1993 (LOAS), art. 1º; versão vigente deve ser consultada em fonte oficial.'
  }
];

const tecnicoQuestions = [
  {
    subject: 'Direito Constitucional', topic: 'Princípios fundamentais', difficulty: 'Médio',
    text: 'A dignidade da pessoa humana, no texto da Constituição Federal de 1988, é classificada como',
    options: ['objetivo de governo temporário.', 'fundamento da República Federativa do Brasil.', 'direito restrito aos brasileiros natos.', 'princípio exclusivo das relações internacionais.', 'competência privativa dos municípios.'], answer: 1,
    explanation: 'A dignidade da pessoa humana figura entre os fundamentos da República Federativa do Brasil.',
    reference: 'Constituição Federal de 1988, art. 1º, III.'
  },
  {
    subject: 'Direito Administrativo', topic: 'Atos administrativos', difficulty: 'Difícil',
    text: 'Quando a Administração extingue um ato válido porque ele deixou de ser conveniente e oportuno, ocorre',
    options: ['convalidação.', 'cassação.', 'anulação.', 'revogação.', 'prescrição.'], answer: 3,
    explanation: 'A revogação recai sobre ato válido por razões de conveniência e oportunidade. A anulação, por sua vez, decorre de ilegalidade.',
    reference: 'Edital nº 1/2026, item 20.2.3.2.3 — ato administrativo: extinção, anulação e revogação.'
  },
  {
    subject: 'Direito Administrativo', topic: 'Poderes administrativos', difficulty: 'Médio',
    text: 'A apuração de infrações e a aplicação de penalidades a servidores e demais pessoas submetidas à disciplina interna da Administração decorrem do poder',
    options: ['regulamentar.', 'disciplinar.', 'de polícia judiciária.', 'constituinte.', 'financeiro.'], answer: 1,
    explanation: 'O poder disciplinar permite apurar infrações e aplicar penalidades no âmbito das relações de sujeição especial à Administração.',
    reference: 'Edital nº 1/2026, item 20.2.3.2.3 — poderes da Administração Pública.'
  },
  {
    subject: 'Atendimento ao Público', topic: 'Qualidade no atendimento', difficulty: 'Fácil',
    text: 'Em um atendimento público orientado à cidadania, a conduta mais adequada é',
    options: ['usar linguagem técnica sem adaptação ao usuário.', 'interromper o usuário para reduzir o tempo da fila.', 'ouvir ativamente, comunicar com clareza e registrar corretamente a demanda.', 'priorizar demandas por afinidade pessoal.', 'recusar orientação sobre outros canais de atendimento.'], answer: 2,
    explanation: 'Escuta ativa, clareza, impessoalidade e registro adequado favorecem atendimento público eficiente e respeitoso.',
    reference: 'Edital nº 1/2026, item 20.2.3.2.3 — qualidade no atendimento ao público e trabalho em equipe.'
  },
  {
    subject: 'Redação Oficial', topic: 'Atributos da redação oficial', difficulty: 'Médio',
    text: 'Clareza, precisão, objetividade e concisão, no contexto das comunicações oficiais, contribuem diretamente para',
    options: ['a pessoalidade do texto.', 'a compreensão inequívoca da mensagem administrativa.', 'o uso obrigatório de linguagem rebuscada.', 'a livre criação literária do agente público.', 'a ocultação do responsável pelo ato.'], answer: 1,
    explanation: 'Os atributos da redação oficial buscam assegurar comunicação impessoal e compreensão precisa, sem rebuscamento desnecessário.',
    reference: 'Edital nº 1/2026, item 20.2.3.2.3 — redação oficial e comunicações administrativas.'
  },
  {
    subject: 'Arquivologia', topic: 'Teoria das três idades', difficulty: 'Médio',
    text: 'Documentos frequentemente consultados pela unidade que os produziu, necessários às atividades em curso, pertencem ao arquivo',
    options: ['permanente.', 'histórico externo.', 'corrente.', 'intermediário de eliminação imediata.', 'especial exclusivamente.'], answer: 2,
    explanation: 'O arquivo corrente reúne documentos em tramitação ou frequentemente consultados em razão de seu uso administrativo imediato.',
    reference: 'Edital nº 1/2026, item 20.2.3.2.3 — noções de arquivologia.'
  },
  {
    subject: 'Materiais e Patrimônio', topic: 'Controle de estoques', difficulty: 'Médio',
    text: 'No controle de estoques, a definição de um nível que aciona a reposição antes do esgotamento do material corresponde ao conceito de',
    options: ['inventário eventual.', 'ponto de pedido.', 'tombamento.', 'depreciação acumulada.', 'alienação antecipada.'], answer: 1,
    explanation: 'O ponto de pedido é o nível de estoque que indica o momento de iniciar a reposição, considerando consumo e tempo de ressuprimento.',
    reference: 'Edital nº 1/2026, item 20.2.3.2.3 — administração de materiais e controle de estoque.'
  },
  {
    subject: 'Lei nº 14.133/2021', topic: 'Princípios das licitações', difficulty: 'Difícil',
    text: 'A segregação de funções, no processo de contratação pública, busca principalmente',
    options: ['concentrar todas as decisões em um único agente.', 'reduzir controles para acelerar a contratação.', 'distribuir funções sensíveis e mitigar riscos de erro ou fraude.', 'substituir o planejamento pela fiscalização posterior.', 'dispensar a motivação dos atos administrativos.'], answer: 2,
    explanation: 'A segregação de funções evita a concentração de atribuições sensíveis em um mesmo agente e fortalece a gestão de riscos e os controles.',
    reference: 'Lei nº 14.133/2021, princípios e governança das contratações; conferir redação vigente em fonte oficial.'
  }
];

const educadorQuestions = [
  {
    subject: 'Seguridade Social', topic: 'Organização da seguridade', difficulty: 'Médio',
    text: 'No Brasil, o conjunto integrado de ações de iniciativa dos Poderes Públicos e da sociedade destinado a assegurar direitos relativos à saúde, à previdência e à assistência social corresponde à',
    options: ['proteção trabalhista.', 'seguridade social.', 'previdência complementar.', 'política habitacional.', 'defesa civil.'], answer: 1,
    explanation: 'A Constituição define seguridade social como o conjunto integrado de ações relativo a saúde, previdência e assistência social.',
    reference: 'Constituição Federal de 1988, art. 194; Edital nº 1/2026, item 20.2.4.2.6.'
  },
  {
    subject: 'Dinâmica Familiar', topic: 'Matricialidade sociofamiliar', difficulty: 'Médio',
    text: 'A matricialidade sociofamiliar no SUAS implica reconhecer a família como',
    options: ['objeto passivo e homogêneo de controle.', 'núcleo central para a concepção e implementação das ações socioassistenciais.', 'substituta obrigatória do Estado na proteção social.', 'grupo definido exclusivamente por vínculos biológicos.', 'unidade sem relação com o território.'], answer: 1,
    explanation: 'A matricialidade sociofamiliar coloca a família, em suas diversas configurações, no centro da proteção socioassistencial, articulada ao território e à rede.',
    reference: 'PNAS/2004; Edital nº 1/2026, item 20.2.4.2.6.'
  },
  {
    subject: 'Prática Socioeducativa', topic: 'PAIF', difficulty: 'Médio',
    text: 'O Serviço de Proteção e Atendimento Integral à Família (PAIF) é ofertado de forma continuada no âmbito da',
    options: ['proteção social básica.', 'proteção especial de alta complexidade.', 'previdência social contributiva.', 'justiça criminal.', 'atenção hospitalar.'], answer: 0,
    explanation: 'O PAIF integra a proteção social básica e é referenciado ao CRAS, com trabalho social continuado com famílias.',
    reference: 'Tipificação Nacional dos Serviços Socioassistenciais; Edital nº 1/2026, item 20.2.4.2.6.'
  },
  {
    subject: 'Prática Socioeducativa', topic: 'PAEFI', difficulty: 'Médio',
    text: 'O PAEFI destina-se ao apoio, orientação e acompanhamento de famílias e indivíduos em situação de',
    options: ['pleno acesso a direitos sem vulnerabilidade.', 'ameaça ou violação de direitos.', 'apenas desemprego temporário.', 'exclusivamente internação hospitalar.', 'somente regularização previdenciária.'], answer: 1,
    explanation: 'O PAEFI atende famílias e indivíduos em situação de ameaça ou violação de direitos no campo da proteção social especial.',
    reference: 'Tipificação Nacional dos Serviços Socioassistenciais; Edital nº 1/2026, item 20.2.4.2.6.'
  },
  {
    subject: 'Trabalho Social com Famílias', topic: 'Escuta qualificada', difficulty: 'Fácil',
    text: 'Na escuta qualificada de uma pessoa em situação de vulnerabilidade, o profissional deve',
    options: ['emitir julgamentos para acelerar a decisão.', 'garantir acolhimento, respeito, privacidade e atenção ao relato.', 'prometer resultado que não depende de sua atuação.', 'divulgar o relato à equipe inteira sem necessidade.', 'conduzir a fala para confirmar uma hipótese prévia.'], answer: 1,
    explanation: 'A escuta qualificada requer postura não julgadora, privacidade, respeito à autonomia e atenção às necessidades apresentadas.',
    reference: 'Edital nº 1/2026, item 20.2.4.2.6 — acolhimento, escuta qualificada e construção de vínculos.'
  },
  {
    subject: 'Criança e Adolescente', topic: 'Proteção integral', difficulty: 'Médio',
    text: 'O princípio da proteção integral reconhece crianças e adolescentes como',
    options: ['objetos de tutela sem participação.', 'sujeitos de direitos em condição peculiar de desenvolvimento.', 'adultos plenamente responsáveis por todos os atos civis.', 'beneficiários apenas quando houver decisão judicial.', 'responsáveis exclusivos pela própria proteção.'], answer: 1,
    explanation: 'A proteção integral reconhece crianças e adolescentes como sujeitos de direitos e pessoas em condição peculiar de desenvolvimento.',
    reference: 'Lei nº 8.069/1990 (ECA), arts. 1º e 6º; conferir versão vigente.'
  },
  {
    subject: 'Direitos Humanos', topic: 'Atendimento sem discriminação', difficulty: 'Médio',
    text: 'Uma prática socioeducativa alinhada aos direitos humanos deve',
    options: ['padronizar as famílias e ignorar diferenças culturais.', 'condicionar o respeito à adesão integral do usuário.', 'reconhecer a dignidade, a diversidade e a autonomia dos usuários.', 'evitar a participação do usuário nas decisões.', 'priorizar medidas coercitivas em qualquer situação.'], answer: 2,
    explanation: 'Dignidade, não discriminação, diversidade, participação e autonomia são referências essenciais para uma atuação baseada em direitos humanos.',
    reference: 'Declaração Universal dos Direitos Humanos; Edital nº 1/2026, item 20.2.4.2.6.'
  },
  {
    subject: 'Redução de Danos', topic: 'Abordagem humanizada', difficulty: 'Difícil',
    text: 'Na abordagem de redução de danos, a atuação profissional caracteriza-se por',
    options: ['exigir abstinência como condição para qualquer cuidado.', 'reconhecer diferentes possibilidades de cuidado e reduzir riscos sem estigmatizar o usuário.', 'interromper o vínculo diante de recaídas.', 'substituir a rede de saúde por ação exclusivamente socioassistencial.', 'usar medidas punitivas como primeira resposta.'], answer: 1,
    explanation: 'A redução de danos trabalha com cuidado possível, vínculo e redução de riscos e prejuízos, sem estigmatização e em articulação com a rede.',
    reference: 'Edital nº 1/2026, item 20.2.4.2.6 — Política Nacional sobre Drogas e estratégias de Redução de Danos.'
  }
];

function varyQuestion(base, index) {
  const stems = [
    'Com base no conteúdo previsto no edital, analise a situação e responda: ',
    'Considerando a abordagem adotada pela banca, assinale a opção correta. ',
    'À luz dos fundamentos aplicáveis ao tema, responda ao item. '
  ];
  if (index % 3 === 0) return base;
  return { ...base, text: `${stems[index % stems.length]}${base.text}` };
}

export function makeQuestionSet(role = 'tecnico', count = 60) {
  const pool = [...commonQuestions, ...(role === 'educador' ? educadorQuestions : tecnicoQuestions)];
  const specific = role === 'educador' ? educadorQuestions : tecnicoQuestions;
  return Array.from({ length: count }, (_, i) => {
    const targetPool = i < Math.ceil(count / 3) ? commonQuestions : specific;
    const source = targetPool[i % targetPool.length];
    const q = varyQuestion(source, i);
    return {
      ...q,
      id: `AS-${role.toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
      area: i < Math.ceil(count / 3) ? 'Conhecimentos gerais' : 'Conhecimentos específicos',
      weight: i < Math.ceil(count / 3) ? 1 : 2,
      confidence: i % 11 === 0 ? 'Revisão recomendada' : 'Validada automaticamente',
      validation: i % 11 === 0 ? 78 : 96
    };
  });
}

export const initialTasks = [
  { id: 1, time: '07:30', duration: '35 min', type: 'Teoria', subject: 'Lei Complementar nº 840/2011', topic: 'Provimento e vacância', icon: 'book', done: false },
  { id: 2, time: '12:30', duration: '25 min', type: 'Questões', subject: 'Língua Portuguesa', topic: 'Coesão e coerência', icon: 'checkCircle', done: true },
  { id: 3, time: '18:30', duration: '30 min', type: 'Revisão 7d', subject: 'NOB/SUAS', topic: 'Gestão e organização do SUAS', icon: 'refresh', done: false },
  { id: 4, time: '19:10', duration: '40 min', type: 'Lei seca', subject: 'Lei nº 14.133/2021', topic: 'Princípios e agentes públicos', icon: 'file', done: false },
  { id: 5, time: '20:00', duration: '20 min', type: 'Flashcards', subject: 'Arquivologia', topic: 'Teoria das três idades', icon: 'layers', done: false }
];

export const reviews = [
  { id: 1, subject: 'NOB/SUAS', topic: 'Gestão e organização do SUAS', reason: 'Revisão de 7 dias', time: '18 min', priority: 'Alta', count: 12, type: 'Questões + resumo' },
  { id: 2, subject: 'Lei Complementar nº 840/2011', topic: 'Provimento e vacância', reason: '3 erros recentes', time: '22 min', priority: 'Alta', count: 15, type: 'Caderno de erros' },
  { id: 3, subject: 'Arquivologia', topic: 'Gestão de documentos', reason: 'Revisão de 30 dias', time: '15 min', priority: 'Média', count: 9, type: 'Flashcards' },
  { id: 4, subject: 'Língua Portuguesa', topic: 'Concordância verbal', reason: 'Baixo desempenho', time: '20 min', priority: 'Média', count: 10, type: 'Questões' },
  { id: 5, subject: 'Política para Mulheres', topic: 'Rede de enfrentamento', reason: 'Revisão de 90 dias', time: '12 min', priority: 'Baixa', count: 8, type: 'Resumo rápido' }
];

export const flashcards = [
  { subject: 'SUAS', front: 'Qual é a função central da Proteção Social Básica no SUAS?', back: 'Prevenir situações de risco social por meio do desenvolvimento de potencialidades, aquisições e do fortalecimento de vínculos familiares e comunitários.' },
  { subject: 'Arquivologia', front: 'O que caracteriza o arquivo corrente?', back: 'Documentos em curso ou frequentemente consultados, vinculados às atividades atuais da unidade que os produziu ou recebeu.' },
  { subject: 'Direito Administrativo', front: 'Qual é a diferença essencial entre anulação e revogação?', back: 'A anulação decorre de ilegalidade; a revogação atinge ato válido por razões de conveniência e oportunidade.' },
  { subject: 'Lei Maria da Penha', front: 'Quais são as cinco formas de violência doméstica e familiar expressamente indicadas pela lei?', back: 'Violência física, psicológica, sexual, patrimonial e moral.' },
  { subject: 'Redação Oficial', front: 'O que a impessoalidade exige na redação oficial?', back: 'Comunicação orientada ao interesse público e ao caráter institucional do ato, sem marcas de preferência ou promoção pessoal.' }
];

export const achievements = [
  { name: 'Primeiras 100 questões', icon: 'target', earned: true },
  { name: 'Sete dias consecutivos', icon: 'flame', earned: true },
  { name: 'Primeiro simulado', icon: 'award', earned: true },
  { name: 'Semana perfeita', icon: 'star', earned: false },
  { name: 'Mil questões', icon: 'trophy', earned: false }
];
