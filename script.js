const config = {
  incremento: 20,
  niveis: [
    { nome: "1: Beija-flor", img: 'assets/logo_20.png', meta: 1 },
    { nome: "2: Tartaruga-de-pente", img: 'assets/logo_40.png', meta: 2 },
    { nome: "3: Garça", img: 'assets/logo_60.png', meta: 3 },
    { nome: "4: Arara-vermelha-grande", img: 'assets/logo_80.png', meta: 4 },
    { nome: "5: Mico-leão-dourado", img: 'assets/logo_100.png', meta: 5 }
  ],
  bannersNivel: [
    { nivel: 1, img: 'assets/Banner_Nivel1.png', desbloqueado: false, mostrado: false },
    { nivel: 2, img: 'assets/Banner_Nivel2.png', desbloqueado: false, mostrado: false },
    { nivel: 3, img: 'assets/Banner_Nivel3.png', desbloqueado: false, mostrado: false },
    { nivel: 4, img: 'assets/Banner_Nivel4.png', desbloqueado: false, mostrado: false },
    { nivel: 5, img: 'assets/Banner_Nivel5.png', desbloqueado: false, mostrado: false }
  ],
  emblemasNivel: [
    { nivel: 1, img: 'assets/Emblema_Nivel1.png', desbloqueado: false, mostrado: false },
    { nivel: 2, img: 'assets/Emblema_Nivel2.png', desbloqueado: false, mostrado: false },
    { nivel: 3, img: 'assets/Emblema_Nivel3.png', desbloqueado: false, mostrado: false },
    { nivel: 4, img: 'assets/Emblema_Nivel4.png', desbloqueado: false, mostrado: false },
    { nivel: 5, img: 'assets/Emblema_Nivel5.png', desbloqueado: false, mostrado: false }
  ],
  presenteMarcos: [20, 50, 75],
  recompensas: [
    {
      img: 'Medalhas/construtor_1.png',
      mensagem: 'Você ganhou uma peça do quebra-cabeça!',
      pecaIndex: null,
      temaIndex: null
    },
    {
      img: 'Medalhas/construtor_2.png',
      mensagem: 'Você ganhou uma peça do quebra-cabeça!',
      pecaIndex: null,
      temaIndex: null
    },
    {
      img: 'Medalhas/construtor_3.png',
      mensagem: 'Você ganhou uma peça do quebra-cabeça!',
      pecaIndex: null,
      temaIndex: null
    }
  ],
  temasQuebraCabecas: [
    {
      nome: "Construtor",
      pecas: [
        { img: 'Medalhas/Construtor_1.png' },
        { img: 'Medalhas/Construtor_2.png' },
        { img: 'Medalhas/Construtor_3.png' },
        { img: 'Medalhas/Construtor_4.png' }
      ],
      imagemCompleta: 'Medalhas/Construtor_5.jpeg'
    },
    {
      nome: "Desenvolvimento",
      pecas: [
        { img: 'Medalhas/Desenvolvimento_1.png' },
        { img: 'Medalhas/Desenvolvimento_2.png' },
        { img: 'Medalhas/Desenvolvimento_3.png' },
        { img: 'Medalhas/Desenvolvimento_4.png' }
      ],
      imagemCompleta: 'Medalhas/Desenvolvimento_5.jpeg'
    },
    {
      nome: "Estabilidade",
      pecas: [
        { img: 'Medalhas/Estabilidade_1.png' },
        { img: 'Medalhas/Estabilidade_2.png' },
        { img: 'Medalhas/Estabilidade_3.png' },
        { img: 'Medalhas/Estabilidade_4.png' }
      ],
      imagemCompleta: 'Medalhas/Estabilidade_5.jpeg'
    },
    {
      nome: "Fundador",
      pecas: [
        { img: 'Medalhas/Fundador_1.png' },
        { img: 'Medalhas/Fundador_2.png' },
        { img: 'Medalhas/Fundador_3.png' },
        { img: 'Medalhas/Fundador_4.png' }
      ],
      imagemCompleta: 'Medalhas/Fundador_5.jpeg'
    },
    {
      nome: "Ousadia",
      pecas: [
        { img: 'Medalhas/Ousadia_1.png' },
        { img: 'Medalhas/Ousadia_2.png' },
        { img: 'Medalhas/Ousadia_3.png' },
        { img: 'Medalhas/Ousadia_4.png' }
      ],
      imagemCompleta: 'Medalhas/Ousadia_5.jpeg'
    }
  ],
  tarefasPorSemana: [
    ["Implementar login", "Criar API de usuários", "Estilizar dashboard", "Configurar banco de dados", "Desenvolver sistema de notificações"],
    ["Refatorar módulo de autenticação", "Otimizar consultas ao banco", "Implementar testes unitários", "Criar documentação da API", "Deploy em ambiente de staging"],
    ["Desenvolver feature X", "Corrigir bugs críticos", "Atualizar dependências", "Implementar CI/CD", "Revisão de código em pares"]
  ]
};

const state = {
  progressoAtual: 0,
  tarefasConcluidas: Array(5).fill(false),
  presentesDesbloqueados: [false, false, false],
  presentesAbertos: [false, false, false],
  pecasPorSemana: [],
  temasCompletos: {
    Construtor: [false, false, false, false],
    Desenvolvimento: [false, false, false, false],
    Estabilidade: [false, false, false, false],
    Fundador: [false, false, false, false],
    Ousadia: [false, false, false, false]
  },
  temaAtual: "Construtor",
  pecasResgatadasEstaSemana: [false, false, false, false],
  pecasDistribuidas: [],
  semanaAtual: 0,
  semanasCompletas: 0,
  tarefasConcluidasNaSemana: 0,
  nivelAtual: { nome: "0: Iniciante", img: 'assets/logo_0.png', meta: 0 },
  nivelAnterior: null,
  ultimoProgressoVerificado: 0,
  diasConsecutivos: 0,
  ultimoDiaAtividade: null,
  emblemasSemanaisDesbloqueados: [],
  medalhaAtual: 0,
  medalhasProgresso: {
    'medalha-fundador': { atual: 0, completo: false },
    'medalha-construtor': { atual: 0, completo: false },
    'medalha-estabilidade': { atual: 0, completo: false }
  },
  quebraCabecaAtualCompleto: false,
  pecasDistribuidasGlobal: [],
  proximaPeca: { temaIndex: 0, pecaIndex: 0 }
};


const progresso = document.getElementById('barraProgresso');
const progressoContainer = document.querySelector('.progress-container');
const presentes = document.querySelectorAll('.progress-wrapper .presente'); // Alterado para selecionar corretamente
const weeklyProgressIcon = document.getElementById('weekly-progress-icon');
const quebraCabecaContainer = document.getElementById('quebraCabecaContainer');

function init() {
  if (!weeklyProgressIcon) {
    console.error('Elemento weekly-progress-icon não encontrado no DOM');
  }

  carregarProgresso();
  
  // Verificação extra para garantir que o nível está correto
  state.nivelAtual = obterNivelAtual(state.semanasCompletas);
  if (state.nivelAtual.meta === 5) {
    // Garante que os emblemas do nível 5 estão desbloqueados
    const emblemaNivel5 = config.emblemasNivel.find(e => e.nivel === 5);
    if (emblemaNivel5) {
      emblemaNivel5.desbloqueado = true;
    }
  }
  
  setupEventListeners();
  atualizarUI();
  
  if (state.nivelAtual.meta === 0) {
    mostrarAlertaNivelIniciante();
  }
}

function mostrarAlertaNivelIniciante() {
  Swal.fire({
    title: 'Bem-vindo ao Nível Iniciante!',
    html: `<p>Você está começando sua jornada! Complete tarefas para evoluir de nível.</p>
          <p>Assim que você subir para o próximo nível, poderá começar a coletar presentes!</p>`,
    icon: 'info',
    confirmButtonText: 'Entendi'
  });
}

function getTemaAtual() {
  return config.temasQuebraCabecas.find(tema => tema.nome === state.temaAtual);
}


function resetarPresentesParaNovaSemana() {
  state.presentesDesbloqueados = [false, false, false];
  state.presentesAbertos = [false, false, false];
  state.progressoAtual = 0;
  state.ultimoProgressoVerificado = 0;
  state.pecasResgatadasEstaSemana = [false, false, false, false];
  
  // Se for nível iniciante, distribui peças básicas do primeiro tema
  if (state.nivelAtual.meta === 0) {
    const temaIndex = 0;
    const pecasDisponiveis = [0, 1, 2].filter(i => 
      !state.temasCompletos[config.temasQuebraCabecas[temaIndex].nome][i]
    );
    
    config.recompensas.forEach((recompensa, i) => {
      if (i < pecasDisponiveis.length) {
        recompensa.temaIndex = temaIndex;
        recompensa.pecaIndex = pecasDisponiveis[i];
      } else {
        recompensa.temaIndex = null;
        recompensa.pecaIndex = null;
      }
    });
    
    state.presentesDesbloqueados[0] = true;
    return;
  }

  // Para outros níveis, distribui peças de forma inteligente
  const pecasParaDistribuir = [];
  let tentativas = 0;
  const maxTentativas = 100; // Prevenção contra loop infinito

  while (pecasParaDistribuir.length < 3 && tentativas < maxTentativas) {
    tentativas++;
    
    // Encontra todas as peças não coletadas
    const pecasNaoColetadas = [];
    config.temasQuebraCabecas.forEach((tema, temaIndex) => {
      tema.pecas.forEach((_, pecaIndex) => {
        if (!state.temasCompletos[tema.nome][pecaIndex]) {
          pecasNaoColetadas.push({ temaIndex, pecaIndex });
        }
      });
    });

    // Se não há mais peças para coletar
    if (pecasNaoColetadas.length === 0) {
      break;
    }

    // Seleciona aleatoriamente peças não coletadas
    const pecaAleatoria = pecasNaoColetadas[Math.floor(Math.random() * pecasNaoColetadas.length)];
    
    // Verifica se já não foi selecionada para esta semana
    if (!pecasParaDistribuir.some(p => 
      p.temaIndex === pecaAleatoria.temaIndex && p.pecaIndex === pecaAleatoria.pecaIndex
    )) {
      pecasParaDistribuir.push(pecaAleatoria);
    }
  }

  // Distribui as peças encontradas
  config.recompensas.forEach((recompensa, i) => {
    if (i < pecasParaDistribuir.length) {
      recompensa.temaIndex = pecasParaDistribuir[i].temaIndex;
      recompensa.pecaIndex = pecasParaDistribuir[i].pecaIndex;
    } else {
      recompensa.temaIndex = null;
      recompensa.pecaIndex = null;
    }
  });
}

function resetarTodosQuebraCabecas() {
  for (const tema in state.temasCompletos) {
    state.temasCompletos[tema] = [false, false, false, false];
  }
  state.pecasDistribuidas = [];
  state.pecasDistribuidasGlobal = [];
}

function renderizarQuebraCabeca() {
  if (!quebraCabecaContainer) return;
  const tema = getTemaAtual();
  if (!tema) return;
  
  const pecasDesbloqueadas = state.temasCompletos[state.temaAtual];
  const todasPecasColetadas = pecasDesbloqueadas.every(Boolean);
  
  quebraCabecaContainer.innerHTML = `
    <h3>Quebra-cabeça: ${tema.nome}</h3>
    <div class="pecas-container">
      ${tema.pecas.map((peca, index) => `
        <div class="peca ${pecasDesbloqueadas[index] ? 'desbloqueada' : ''}">
          ${pecasDesbloqueadas[index] ? 
            `<img src="${peca.img}" alt="Peça ${index + 1}">` : 
            '<div class="peca-placeholder">?</div>'}
        </div>
      `).join('')}
    </div>
    <div class="imagem-completa-container" style="margin-top: 20px; text-align: center;">
      ${todasPecasColetadas ? 
        `<h4>Quebra-cabeça completo!</h4>
         <img src="${tema.imagemCompleta}" alt="${tema.nome} completo" style="max-width: 100%; border: 2px solid #0571d3; border-radius: 8px;">` : 
        `<p class="texto-informativo">Complete todas as 4 peças para revelar a imagem completa</p>`}
    </div>
  `;
  
  if (todasPecasColetadas) {
    confetti({
      particleCount: 300,
      spread: 100,
      origin: { y: 0.3 }
    });
  }
}
function atualizarPresentes() {
  if (!presentes || presentes.length === 0) {
    console.error('Elementos de presente não encontrados no DOM');
    return;
  }

  presentes.forEach((presente, index) => {
    if (!presente) return;

    // Verifica se está no nível iniciante (meta 0)
    if (state.nivelAtual.meta === 0) {
      if (index === 0 && config.recompensas[0].pecaIndex !== null) {
        presente.src = "assets/presente_iniciante.png";
        presente.classList.add('presente-desbloqueado');
        state.presentesDesbloqueados[0] = true;
      } else {
        presente.src = "assets/balao_surpresa.png";
        presente.classList.remove('presente-desbloqueado');
      }
      return;
    }

    const marcoAlcancado = state.progressoAtual >= config.presenteMarcos[index];
    const pecaDisponivel = config.recompensas[index].pecaIndex !== null;

    if (marcoAlcancado && pecaDisponivel) {
      if (state.presentesAbertos[index]) {
        const temaIndex = config.recompensas[index].temaIndex;
        const pecaIndex = config.recompensas[index].pecaIndex;
        const tema = config.temasQuebraCabecas[temaIndex];
        
        if (tema && tema.pecas[pecaIndex]) {
          presente.src = tema.pecas[pecaIndex].img;
        }
        presente.classList.remove('presente-desbloqueado');
      } else {
        presente.src = "assets/presente_colorido.png";
        presente.classList.add('presente-desbloqueado');
      }
      state.presentesDesbloqueados[index] = true;
    } else {
      presente.src = "assets/balao_surpresa.png";
      presente.classList.remove('presente-desbloqueado');
      state.presentesDesbloqueados[index] = false;
    }
  });
}


function renderizarTodosQuebraCabecas() {
  if (!quebraCabecaContainer) return;
  
  quebraCabecaContainer.innerHTML = `
    <h3>Seus Quebra-Cabeças</h3>
    <div class="todos-quebra-cabecas">
      ${config.temasQuebraCabecas.map((tema, temaIndex) => {
        const pecasDesbloqueadas = state.temasCompletos[tema.nome];
        const todasPecasColetadas = pecasDesbloqueadas.every(Boolean);
        
        return `
          <div class="quebra-cabeca-item ${todasPecasColetadas ? 'completo' : ''}">
            <h4>${tema.nome}</h4>
            <div class="pecas-container">
              ${tema.pecas.map((peca, pecaIndex) => `
                <div class="peca ${pecasDesbloqueadas[pecaIndex] ? 'desbloqueada' : ''}">
                  ${pecasDesbloqueadas[pecaIndex] ? 
                    `<img src="${peca.img}" alt="Peça ${pecaIndex + 1}">` : 
                    '<div class="peca-placeholder">?</div>'}
                </div>
              `).join('')}
            </div>
            ${todasPecasColetadas ? 
              `<div class="imagem-completa">
                <img src="${tema.imagemCompleta}" alt="${tema.nome} completo">
              </div>` : 
              `<p class="texto-informativo">${pecasDesbloqueadas.filter(Boolean).length}/4 peças coletadas</p>`}
          </div>
        `;
      }).join('')}
    </div>
  `;
}



function verificarConsistenciaPresentes() {
  config.presenteMarcos.forEach((marco, index) => {
    if (state.presentesAbertos[index] && 
        (config.recompensas[index].pecaIndex === null || 
         config.recompensas[index].temaIndex === null)) {
      state.presentesAbertos[index] = false;
    }
    
    if (state.presentesDesbloqueados[index] && state.progressoAtual < marco) {
      state.presentesDesbloqueados[index] = false;
    }
  });
}

function abrirPresente(index) {
  const recompensa = config.recompensas[index];
  
  if (state.nivelAtual.meta === 0) {
    Swal.fire({
      title: 'Nível Iniciante',
      text: 'Você precisa subir para o próximo nível para poder coletar presentes!',
      icon: 'info',
      confirmButtonText: 'Entendi'
    });
    return;
  }

  if (!state.presentesDesbloqueados[index]) {
    Swal.fire({
      title: 'Continue progredindo!',
      text: `Complete mais ${config.presenteMarcos[index] - state.progressoAtual}% para desbloquear este presente.`,
      icon: 'info'
    });
    return;
  }

  if (recompensa.pecaIndex === null || recompensa.temaIndex === null) {
    Swal.fire({
      title: 'Quebra-cabeça completo!',
      text: 'Você já coletou todas as peças disponíveis!',
      icon: 'info'
    });
    return;
  }

  if (state.presentesAbertos[index]) {
    const tema = config.temasQuebraCabecas[recompensa.temaIndex];
    const pecaIndex = recompensa.pecaIndex;
    
    Swal.fire({
      title: 'Presente já aberto',
      html: `<p>Você já abriu este presente e coletou a peça ${pecaIndex + 1} do quebra-cabeça ${tema.nome}.</p>
            <img src="${tema.pecas[pecaIndex].img}" style="width:200px;margin:15px auto;">`,
      confirmButtonText: 'OK'
    });
    return;
  }

  abrirPresenteComEfeitos(index);
}

function resetarTarefas() {
  const nivelMaximo = config.niveis[config.niveis.length - 1];
  const atingiuNivelMaximo = state.semanasCompletas >= nivelMaximo.meta;
  
  if (!atingiuNivelMaximo) {
    state.tarefasConcluidas = Array(5).fill(false);
    state.tarefasConcluidasNaSemana = 0;
    state.progressoAtual = 0;
    state.presentesDesbloqueados = [false, false, false];
    state.presentesAbertos = [false, false, false];
    state.pecasResgatadasEstaSemana = [false, false, false, false];
    
    atualizarUI();
    salvarProgresso();
  }
}

function carregarProgresso() {
  const salvo = localStorage.getItem('progressoBB');
  if (salvo) {
    try {
      const dados = JSON.parse(salvo);
      
      // Carrega semanasCompletas primeiro
      state.semanasCompletas = dados.semanasCompletas || 0;
      
      // Atualiza o nível atual baseado nas semanas completas
      state.nivelAtual = obterNivelAtual(state.semanasCompletas);
      
      // Carrega o resto do estado
      Object.assign(state, dados);
      
      // Garante que o nivelAtual está correto
      if (dados.nivelAtual && dados.nivelAtual.meta !== undefined) {
        state.nivelAtual = dados.nivelAtual;
      } else {
        state.nivelAtual = obterNivelAtual(state.semanasCompletas);
      }
      
      // Atualiza temas completos se necessário
      config.temasQuebraCabecas.forEach(tema => {
        if (!state.temasCompletos[tema.nome]) {
          state.temasCompletos[tema.nome] = [false, false, false, false];
        }
      });
      
      // Atualiza recompensas
      if (dados.recompensas) {
        dados.recompensas.forEach((r, i) => {
          if (config.recompensas[i]) {
            config.recompensas[i].pecaIndex = r.pecaIndex;
            config.recompensas[i].temaIndex = r.temaIndex;
          }
        });
      }
      
      // Atualiza emblemas
      if (dados.emblemasNivel) {
        dados.emblemasNivel.forEach(emblemaSalvo => {
          const emblema = config.emblemasNivel.find(e => e.nivel === emblemaSalvo.nivel);
          if (emblema) {
            emblema.desbloqueado = emblemaSalvo.desbloqueado;
            emblema.mostrado = emblemaSalvo.mostrado;
            emblema.resgatado = emblemaSalvo.resgatado || false;
          }
        });
      }

      state.nivelAnterior = state.nivelAtual || { nome: "0: Iniciante", img: 'assets/logo_0.png', meta: 0 };
      state.ultimoProgressoVerificado = state.progressoAtual || 0;
      
      verificarMarcos();
    } catch (e) {
      console.error("Erro ao carregar progresso:", e);
      resetarParaEstadoInicial();
    }
  } else {
    resetarParaEstadoInicial();
  }
}

function resetarParaEstadoInicial() {
  state.progressoAtual = 0;
  state.tarefasConcluidas = Array(5).fill(false);
  state.presentesDesbloqueados = [false, false, false];
  state.presentesAbertos = [false, false, false];
  state.temasCompletos = {
    Construtor: [false, false, false, false],
    Desenvolvimento: [false, false, false, false],
    Estabilidade: [false, false, false, false],
    Fundador: [false, false, false, false],
    Ousadia: [false, false, false, false]
  };
  state.pecasResgatadasEstaSemana = [false, false, false, false];
  state.pecasDistribuidas = [];
  state.semanaAtual = 0;
  state.semanasCompletas = 0;
  state.tarefasConcluidasNaSemana = 0;
  state.nivelAtual = { nome: "0: Iniciante", img: 'assets/logo_0.png', meta: 0 };
  state.nivelAnterior = null; // Inicializa como null
  state.ultimoProgressoVerificado = 0;
  state.diasConsecutivos = 0;
  state.ultimoDiaAtividade = null;
  state.emblemasSemanaisDesbloqueados = [];
  state.medalhaAtual = 0;
  state.medalhasProgresso = {
    'medalha-fundador': { atual: 0, completo: false },
    'medalha-construtor': { atual: 0, completo: false },
    'medalha-estabilidade': { atual: 0, completo: false }
  };
  state.proximaPeca = { temaIndex: 0, pecaIndex: 0 };
  
  config.emblemasNivel.forEach(emblema => {
    emblema.desbloqueado = false;
    emblema.mostrado = false;
  });
  
  config.temasQuebraCabecas.forEach(tema => {
    if (!state.temasCompletos[tema.nome]) {
      state.temasCompletos[tema.nome] = [false, false, false, false];
    }
  });
  
  config.recompensas.forEach(recompensa => {
    recompensa.pecaIndex = null;
    recompensa.temaIndex = null;
  });
  
  salvarProgresso();
}
function salvarProgresso() {
  // Atualiza emblemas no state antes de salvar
  state.emblemasNivel = config.emblemasNivel.map(e => ({ 
    nivel: e.nivel, 
    img: e.img, 
    desbloqueado: e.desbloqueado, 
    mostrado: e.mostrado,
    resgatado: e.resgatado || false
  }));
  
  // Garante que o nivelAtual está atualizado
  state.nivelAtual = obterNivelAtual(state.semanasCompletas);
  
  const dadosParaSalvar = {
    semanasCompletas: state.semanasCompletas,
    semanaAtual: state.semanaAtual,
    progressoAtual: state.progressoAtual,
    presentesDesbloqueados: state.presentesDesbloqueados,
    presentesAbertos: state.presentesAbertos,
    temasCompletos: state.temasCompletos,
    pecasResgatadasEstaSemana: state.pecasResgatadasEstaSemana,
    pecasDistribuidas: [...state.pecasDistribuidas],
    nivelAtual: state.nivelAtual, // Garante que o nível atual está sendo salvo
    nivelAnterior: state.nivelAnterior,
    tarefasConcluidas: state.tarefasConcluidas,
    tarefasConcluidasNaSemana: state.tarefasConcluidasNaSemana,
    ultimoProgressoVerificado: state.ultimoProgressoVerificado,
    emblemasNivel: state.emblemasNivel,
    emblemasSemanaisDesbloqueados: [...state.emblemasSemanaisDesbloqueados],
    diasConsecutivos: state.diasConsecutivos,
    ultimoDiaAtividade: state.ultimoDiaAtividade,
    medalhaAtual: state.medalhaAtual,
    medalhasProgresso: { ...state.medalhasProgresso },
    proximaPeca: { ...state.proximaPeca },
    recompensas: config.recompensas.map(r => ({
      img: r.img,
      mensagem: r.mensagem,
      pecaIndex: r.pecaIndex,
      temaIndex: r.temaIndex
    }))
  };
  
  localStorage.setItem('progressoBB', JSON.stringify(dadosParaSalvar));
  window.dispatchEvent(new CustomEvent('progressoAtualizado'));
}

function setupEventListeners() {
  if (presentes) {
    presentes.forEach((presente, index) => {
      presente.addEventListener('click', () => abrirPresente(index));
    });
  }
}

function atualizarUI() {
  atualizarBarraProgresso();
  atualizarIconeHeader();
  atualizarPresentes(); // Adicione esta linha
  criarMarcadoresBarraProgresso();
  atualizarTarefasUI();
  renderizarEmblemasFixos();
  renderizarQuebraCabeca();
}

function registrarAtividade(tipo, descricao, emblema = null) {
  const historico = JSON.parse(localStorage.getItem('historicoPerfil')) || [];
  historico.unshift({
    tipo,
    descricao,
    data: new Date().toISOString(),
    emblema: emblema ? {
      img: emblema.img,
      titulo: emblema.mensagem.replace('Você ganhou a medalha de ', '').replace('!', ''),
      descricao: emblema.mensagem
    } : null
  });
  localStorage.setItem('historicoPerfil', JSON.stringify(historico));
}


function verificarMarcos() {
  // Verifica se o usuário atingiu algum marco de presente
  config.presenteMarcos.forEach((marco, index) => {
    // Verifica se o progresso atual atingiu o marco E se o presente ainda não foi desbloqueado
    // E se o usuário está em um nível que permite coletar o presente
    if (state.progressoAtual >= marco && 
        !state.presentesDesbloqueados[index] &&
        state.nivelAtual.meta > 0) { // Adicionada verificação de nível > 0
      
      state.presentesDesbloqueados[index] = true;
      
      // Dispara confetti apenas se não for o nível iniciante
      if (state.nivelAtual.meta > 0) {
        confetti({
          particleCount: 100 + (index * 20),
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      // Mostra alerta apenas se não for o nível iniciante
      if (state.nivelAtual.meta > 0) {
        Swal.fire({
          title: `🎉 Marco de ${marco}% alcançado!`,
          text: 'Você desbloqueou um novo presente!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#f8f9fa'
        });
      }
      
      salvarProgresso();
      atualizarUI();
    }
  });

  // Verifica promoção de nível
  const novoNivel = obterNivelAtual(state.semanasCompletas);
  if (novoNivel.meta !== state.nivelAtual.meta) {
    state.nivelAtual = novoNivel;
    mostrarMensagemNovoNivel(novoNivel);
    salvarProgresso();
    atualizarUI();
  }
}


function atualizarBarraProgresso() {
  const progressoElement = document.getElementById('barraProgresso');
  if (!progressoElement) {
    console.error('Elemento barraProgresso não encontrado');
    return;
  }
  
  progressoElement.value = state.progressoAtual;
  
  // Atualiza também o texto de progresso se existir
  const progressoTexto = document.getElementById('progressoTexto');
  if (progressoTexto) {
    progressoTexto.textContent = `${state.progressoAtual}% completado`;
  }
}

function atualizarIconeHeader() {
  if (!weeklyProgressIcon) {
    console.error('Elemento weekly-progress-icon não encontrado');
    return;
  }

  if (state.nivelAtual && state.nivelAtual.img) {
    weeklyProgressIcon.src = state.nivelAtual.img;
    weeklyProgressIcon.alt = `Nível: ${state.nivelAtual.nome}`;
    weeklyProgressIcon.style.display = 'block';
    
    const weeklyProgressElement = document.querySelector('.weekly-progress');
    if (weeklyProgressElement) {
      weeklyProgressElement.setAttribute('data-progress', `Nível ${state.nivelAtual.nome}`);
    }
  } else {
    weeklyProgressIcon.src = 'assets/logo_0.png';
    weeklyProgressIcon.alt = 'Nível: Iniciante';
  }
}

function atualizarTarefasUI() {
  const dropdownContent = document.getElementById('tasksDropdown');
  if (!dropdownContent) return;
  const questsContainer = dropdownContent.querySelector('.questsInAndament');
  if (!questsContainer) return;
  
  questsContainer.innerHTML = config.tarefasPorSemana[state.semanaAtual]
    .map((tarefa, index) => `
      <label class="checkbox-task">
        <input type="checkbox" 
               onchange="concluirTarefa(this, ${index})" 
               ${state.tarefasConcluidas[index] ? 'checked disabled' : ''}>
        <span>${tarefa}</span>
      </label>
    `).join('');
}

function obterNivelAtual(semanasCompletas) {
  // Ordena os níveis por meta (do menor para o maior)
  const niveisOrdenados = [...config.niveis].sort((a, b) => a.meta - b.meta);
  
  // Começa com o nível iniciante
  let nivelAtual = { nome: "0: Iniciante", img: 'assets/logo_0.png', meta: 0 };
  
  // Percorre os níveis para encontrar o mais alto alcançado
  for (const nivel of niveisOrdenados) {
    if (semanasCompletas >= nivel.meta) {
      nivelAtual = nivel;
    } else {
      // Sai do loop quando encontra um nível não alcançado
      break;
    }
  }
  
  return nivelAtual;
}

function concluirTarefa(checkbox, index) {
  const nivelMaximo = config.niveis[config.niveis.length - 1];
  const nivelAtual = obterNivelAtual(state.semanasCompletas);
  
  // Verifica se já atingiu o nível máximo
  if (nivelAtual.meta >= nivelMaximo.meta) {
    Swal.fire({
      title: 'Parabéns!',
      text: 'Você já atingiu o nível máximo!',
      icon: 'info'
    });
    return;
  }
  
  Swal.fire({
    title: 'Confirmar conclusão',
    text: 'Deseja marcar esta tarefa como concluída?',
    imageUrl: 'assets/Mascote_feliz.png',
    imageWidth: 200,
    showCancelButton: true,
    confirmButtonColor: '#0571d3',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, concluir!'
  }).then((result) => {
    if (result.isConfirmed) {
      state.tarefasConcluidas[index] = true;
      state.tarefasConcluidasNaSemana++;
      state.progressoAtual += config.incremento;
      checkbox.disabled = true;
      
      registrarAtividade('tarefa', `Concluída: ${config.tarefasPorSemana[state.semanaAtual][index]}`);
      atualizarUI();
      verificarMarcos();
      salvarProgresso();
      
      // Verifica se completou todas as tarefas da semana
      if (state.tarefasConcluidasNaSemana === config.tarefasPorSemana[state.semanaAtual].length) {
        // Incrementa semanas completas ANTES de verificar o novo nível
        state.semanasCompletas++;
        
        // Obtém o novo nível com base nas semanas completas
        const novoNivel = obterNivelAtual(state.semanasCompletas);
        state.nivelAtual = novoNivel;
        
        // Atualiza o ícone do nível no header
        atualizarIconeHeader();
        
        // Verifica se houve mudança de nível
        if (state.nivelAnterior === null || novoNivel.meta !== state.nivelAnterior.meta) {
          mostrarMensagemNovoNivel(novoNivel);
          registrarAtividade('nivel', `Alcançado: ${novoNivel.nome}`);
          state.nivelAnterior = novoNivel;
        }
        
        celebrarConclusaoSemanal();
      }
    } else {
      Swal.fire({
        title: 'Ops!',
        text: 'Você realmente deseja cancelar esta tarefa?',
        imageUrl: 'assets/Mascote-triste.png',
        imageWidth: 200,
        imageAlt: 'Mascote triste',
        showCancelButton: true,
        confirmButtonColor: '#0571d3',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Não, quero concluir!',
        cancelButtonText: 'Sim, cancelar'
      }).then((secondResult) => {
        if (secondResult.isConfirmed) {
          checkbox.checked = true;
          concluirTarefa(checkbox, index);
        } else {
          checkbox.checked = false;
        }
      });
    }
  });
}

function mostrarMensagemNovoNivel(nivel) {
  const confettiConfig = {
    particleCount: 100 + (nivel.meta * 50),
    spread: 70,
    origin: { y: 0.6 }
  };
  
  if (nivel.meta >= 4) {
    confettiConfig.colors = ['#FFD700', '#FFFFFF', '#0571d3'];
  }
  
  confetti(confettiConfig);
  
  const emblema = config.emblemasNivel.find(e => e.nivel === nivel.meta);
  if (emblema) {
    emblema.desbloqueado = true;
    
    if (nivel.meta === 5) {
      mostrarEmblemaCompleto(emblema);
    } else {
      mostrarEmblemaHeader(emblema);
    }
  }
  
  Swal.fire({
    title: `Novo nível alcançado! 🎉`,
    html: `<p>Você atingiu o nível <strong>${nivel.nome}</strong>!</p>
          <img src="${nivel.img}" style="width: 150px; margin: 15px auto;">`,
    icon: 'success',
    confirmButtonText: 'Continuar evoluindo!'
  });
}

function mostrarEmblemaCompleto(emblema) {
  Swal.fire({
    title: '🏆 Emblema Máximo Desbloqueado!',
    html: `
      <p>Parabéns! Você alcançou o nível máximo e desbloqueou o emblema completo!</p>
      <img src="${emblema.img}" style="width: 200px; margin: 20px auto;">
      <p>Você completou todas as semanas e conquistou a recompensa máxima!</p>
      <button id="btnResgatarEmblema" style="margin-top:15px;padding:10px 20px;background:#0571d3;color:#fff;border:none;border-radius:6px;font-weight:bold;cursor:pointer;">Resgatar Emblema</button>
    `,
    showConfirmButton: false,
    background: '#f8f9fa',
    customClass: {
      popup: 'swal-custom-popup'
    },
    didOpen: () => {
      const btn = document.getElementById('btnResgatarEmblema');
      if (btn) {
        btn.addEventListener('click', () => {
          emblema.resgatado = true;
          salvarProgresso();
          Swal.fire({
            title: 'Emblema resgatado!',
            text: 'Você resgatou o emblema máximo! Parabéns!',
            icon: 'success'
          });
        });
      }
    }
  });

  registrarAtividade('emblema', 'Desbloqueou o emblema máximo do nível 5');
}

function verificarEmblemasNivel() {
  const nivelAtual = state.nivelAtual.meta;

  config.emblemasNivel.forEach(emblema => {
    if (nivelAtual >= emblema.nivel && !emblema.desbloqueado) {
      emblema.desbloqueado = true;
      
      if (nivelAtual === emblema.nivel) {
        mostrarEmblemaHeader(emblema);
      }
    }
  });
  
  renderizarEmblemasFixos();
}

function celebrarConclusaoSemanal() {
  const nivelMaximo = config.niveis[config.niveis.length - 1];
  const atingiuNivelMaximo = state.semanasCompletas >= nivelMaximo.meta;

  confetti({
    particleCount: 300,
    spread: 100,
    origin: { y: 0.3 }
  });

  verificarEmblemasNivel();
  
  if (atingiuNivelMaximo) {
    const emblemaCompleto = config.emblemasNivel.find(e => e.nivel === 5);
    if (emblemaCompleto && !emblemaCompleto.mostrado) {
      mostrarEmblemaCompleto(emblemaCompleto);
    }
    
    Swal.fire({
      title: '🎉 PARABÉNS! 🎉',
      html: `<p>Você atingiu o nível máximo <strong>${nivelMaximo.nome}</strong>!</p>
            <img src="${nivelMaximo.img}" style="width: 150px; margin: 20px auto;">
            <p>Todas as conquistas foram desbloqueadas!</p>`,
      confirmButtonText: 'Continuar',
    });
  } else {
    mostrarNotificacaoMetaSemanal();
    Swal.fire({
      title: 'Semana concluída! 🎉',
      html: `<p>Parabéns! Você completou todas as tarefas desta semana!</p>
            <p>Nível atual: <strong>${state.nivelAtual.nome}</strong></p>
            <img src="${state.nivelAtual.img}" style="width: 100px; margin: 20px auto;">`,
      confirmButtonText: 'Iniciar nova semana!'
    }).then(() => {
      state.semanaAtual = (state.semanaAtual + 1) % config.tarefasPorSemana.length;
      resetarTarefas();
      resetarPresentesParaNovaSemana();
      atualizarUI();
    });
  }
}

function mostrarNotificacaoMetaSemanal() {
  if (state.tarefasConcluidasNaSemana === config.tarefasPorSemana[state.semanaAtual].length) {
    Swal.fire({
      title: '🎉 Metas Semanais Concluídas!',
      text: `Parabéns! Você completou todas as ${state.tarefasConcluidasNaSemana} tarefas desta semana!`,
      icon: 'success',
      confirmButtonText: 'Continuar!'
    });
  }
}

function mostrarEmblemaHeader(emblema) {
  config.emblemasNivel.forEach(e => e.mostrado = false);
  
  emblema.mostrado = true;
  salvarProgresso();
  renderizarEmblemasFixos();
  
  Swal.fire({
    title: `Emblema Desbloqueado! 🎉`,
    html: `<p>Você desbloqueou o emblema do Nível ${emblema.nivel}!</p>
          <img src="${emblema.img}" style="width: 150px; margin: 15px auto;">`,
    icon: 'success',
    confirmButtonText: 'Continuar evoluindo!'
  });
}

function renderizarEmblemasFixos() {
  const container = document.getElementById('emblemasFixosContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  const emblemaParaMostrar = [...config.emblemasNivel]
    .sort((a, b) => a.nivel - b.nivel)
    .filter(e => e.desbloqueado && e.nivel <= state.nivelAtual.meta)
    .pop();
  
  if (emblemaParaMostrar) {
    const emblemaElement = document.createElement('div');
    emblemaElement.className = 'emblema-fixo desbloqueado';
    emblemaElement.style.cursor = 'pointer';
    
    const nivelInfo = config.niveis.find(n => n.meta === emblemaParaMostrar.nivel);
    const nomeNivel = nivelInfo ? nivelInfo.nome.split(': ')[1] : `Nível ${emblemaParaMostrar.nivel}`;
    
    emblemaElement.innerHTML = `
      <img src="${emblemaParaMostrar.img}" alt="Emblema ${nomeNivel}" 
           title="Emblema ${nomeNivel} - Nível ${emblemaParaMostrar.nivel}">
    `;
    
    emblemaElement.addEventListener('click', () => {
      mostrarAlertaNivel(emblemaParaMostrar.nivel);
    });
    
    container.appendChild(emblemaElement);
    emblemaParaMostrar.mostrado = true;
  }
}

function criarMarcadoresBarraProgresso() {
  if (!progressoContainer) return;
  
  config.presenteMarcos.forEach((marco, index) => {
    const presente = presentes[index];
    if (!presente) return;

    // Se o presente foi aberto
    if (state.presentesAbertos[index]) {
      const recompensa = config.recompensas[index];
      
      // Verifica se há uma peça de quebra-cabeça associada
      if (recompensa.temaIndex !== null && recompensa.pecaIndex !== null) {
        const tema = config.temasQuebraCabecas[recompensa.temaIndex];
        if (tema) {
          presente.src = tema.pecas[recompensa.pecaIndex].img;
          presente.alt = `Peça ${recompensa.pecaIndex + 1} do quebra-cabeça ${tema.nome}`;
        }
      } else {
        // Mostra o emblema correspondente ao tema
        const tema = config.temasQuebraCabecas[recompensa.temaIndex];
        if (tema) {
          presente.src = `Medalhas/${tema.nome}_1.png`;
          presente.alt = `Emblema ${tema.nome}`;
        } else {
          // Fallback para o emblema de construtor se não encontrar o tema
          presente.src = "Medalhas/Construtor_1.png";
          presente.alt = "Emblema de Construtor";
        }
      }
    } 
    // Presente desbloqueado mas não aberto
    else if (state.presentesDesbloqueados[index]) {
      presente.src = "assets/presente_colorido.png";
      presente.alt = `Presente ${index + 1}`;
    } 
    // Presente bloqueado
    else {
      presente.src = "assets/balao_surpresa.png";
      presente.alt = `Presente bloqueado ${index + 1}`;
    }
  });
}

function abrirPresenteComEfeitos(index) {
  const recompensa = config.recompensas[index];
  
  // Verifica se há peça para resgatar
  if (recompensa.pecaIndex === null || recompensa.temaIndex === null) {
    Swal.fire({
      title: 'Quebra-cabeça completo!',
      text: 'Você já coletou todas as peças disponíveis!',
      icon: 'info'
    });
    return;
  }

  const tema = config.temasQuebraCabecas[recompensa.temaIndex];
  if (!tema) {
    console.error('Tema não encontrado para índice:', recompensa.temaIndex);
    return;
  }

  // Verifica se o tema existe no state.temasCompletos
  if (!state.temasCompletos[tema.nome]) {
    state.temasCompletos[tema.nome] = [false, false, false, false];
  }

  const pecasDesbloqueadas = state.temasCompletos[tema.nome];
  const pecaIndex = recompensa.pecaIndex;

  // Verifica se o índice da peça é válido
  if (pecaIndex < 0 || pecaIndex >= tema.pecas.length) {
    console.error('Índice de peça inválido:', pecaIndex);
    return;
  }

  // Verifica se a peça já foi coletada
  if (pecasDesbloqueadas[pecaIndex]) {
    // Isso nunca deveria acontecer com a nova lógica de distribuição
    console.warn('Tentativa de coletar peça já coletada:', tema.nome, pecaIndex);
    Swal.fire({
      title: 'Erro inesperado',
      text: 'Esta peça já foi coletada anteriormente.',
      icon: 'error'
    });
    return;
  }

  // Marca a peça como coletada
  pecasDesbloqueadas[pecaIndex] = true;
  state.presentesAbertos[index] = true;
  state.pecasResgatadasEstaSemana[index] = true;
  
  // Atualiza a imagem do presente
  if (presentes[index]) {
    presentes[index].src = tema.pecas[pecaIndex].img;
    presentes[index].classList.remove('presente-desbloqueado');
    presentes[index].alt = `Peça ${pecaIndex + 1} do quebra-cabeça ${tema.nome}`;
  }

  // Mostra mensagem de sucesso
  Swal.fire({
    title: 'Peça Coletada!',
    html: `<p>Você ganhou a peça ${pecaIndex + 1} do quebra-cabeça ${tema.nome}!</p>
          <img src="${tema.pecas[pecaIndex].img}" style="width: 200px; margin: 15px auto;">
          <p>${pecasDesbloqueadas.filter(Boolean).length} de ${tema.pecas.length} peças coletadas deste tema</p>`,
    confirmButtonText: 'OK'
  });

  // Verifica se completou o quebra-cabeça
  const todasPecasColetadas = pecasDesbloqueadas.every(Boolean);
  if (todasPecasColetadas) {
    setTimeout(() => {
      Swal.fire({
        title: 'Quebra-cabeça Completo!',
        html: `<p>Parabéns! Você completou o quebra-cabeça ${tema.nome}!</p>
              <img src="${tema.imagemCompleta}" style="max-width: 100%; border: 2px solid #0571d3; border-radius: 8px;">`,
        confirmButtonText: 'OK'
      });
      
      // Dispara confetti adicional para celebração
      confetti({
        particleCount: 300,
        spread: 100,
        origin: { y: 0.3 }
      });
    }, 1000);
  }

  // Atualiza a UI e salva o progresso
  atualizarUI();
  salvarProgresso();
  
  // Efeitos visuais
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function mostrarAlertaNivel(nivel) {
  let nivelInfo;
  
  if (nivel === 0) {
    nivelInfo = { 
      nome: "0: Iniciante", 
      img: '../assets/logo_0.png',
      meta: 0,
      banner: null
    };
  } else {
    nivelInfo = config.niveis.find(n => n.meta === nivel);
    if (!nivelInfo) return;
    nivelInfo.banner = config.bannersNivel.find(e => e.nivel === nivel)?.img || null;
  }

  Swal.fire({
    title: '',
    html: `
      <div style="flex: 1;">
        <h1 style="color: #2B3674; font-size: 2rem; margin: 0 0 15px 0; text-align: center; font-weight: bold; line-height: 1.3;">
          Seu nível Atual:
        </h1>
        <div style="text-align: center; font-size: 1.5rem; font-weight: bold; margin-bottom: ${nivelInfo.banner ? '10px' : '20px'}; color: #2B3674;">
          ${nivel === 0 ? 'NÍVEL INICIANTE' : `NÍVEL ${nivel}`}
        </div>
        
        ${nivelInfo.banner ? `
          <div style="text-align: center; margin: 0 auto 20px auto; max-width: 100%;">
            <img src="${nivelInfo.banner}" style="max-width: 100%; max-height: 200px; object-fit: contain; border-radius: 8px; border: none;">
          </div>
        ` : ''}
        
        <div style="text-align: center; font-size: 1rem; line-height: 1.6; color: #2B3674; margin: 20px 0 20px 0;">
          ${nivel === 0 ? 
            'Complete tarefas para começar sua jornada e evoluir de nível!' : 
            'Cada vez que você preenche toda a logo com tarefas concluídas, sobe um nível! Continue evoluindo e mostre sua dedicação.'}
        </div>
      </div>
    `,
    showConfirmButton: true,
    confirmButtonText: 'OK',
    showCancelButton: nivel > 0,
    cancelButtonText: 'Ver todos os Níveis',
    showCloseButton: false,
    width: '600px',
    padding: '20px',
    background: '#fff',
    customClass: {
      popup: 'swal-custom-popup',
      title: 'swal-custom-title',
      htmlContainer: 'swal-custom-html',
      confirmButton: 'swal-confirm-button',
      cancelButton: 'swal-cancel-button'
    },
    didOpen: () => {
      const cancelButton = document.querySelector('.swal-cancel-button');
      if (cancelButton) {
        cancelButton.addEventListener('click', () => {
          Swal.close();
          mostrarTodosOsNiveis();
        });
      }
    }
  });
}

function Informacoes() {
  Swal.fire({
    title: '',
    html: `
    <div style="flex: 1;">
            <h1 style="color: #2B3674; font-size: 2rem; margin: 0 0 15px 0; text-align: center; font-weight: bold; line-height: 1.3;">
             Mostre seu progresso!
            </h1>
    <div style="right: 20px; bottom: 20px;">
        <img src="assets/balao_surpresa.png" style="width: 100px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="160" height="100" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
</svg>
        <img src="assets/presente_colorido.png" style="width: 100px;">
      </div>
      <div style="text-align: center; font-size: 1rem; line-height: 1.6; color: #2B3674; margin: 20px 0 20px 0;">
        Conclua suas tarefas da semana e veja sua<br>
        barra de progresso encher! No final da jornada,<br>
        um presente surpresa vai ser desbloqueado!
      </div>
      
    `,
    confirmButtonText: 'OK',
    width: '600px',
    padding: '20px',
    background: '#fff',
    showConfirmButton: true,
    showCloseButton: false,
    customClass: {
      popup: 'swal-custom-popup',
      title: 'swal-custom-title',
      htmlContainer: 'swal-custom-html'
    }
  });
}

function Logo() {
  const progresso = Math.round((state.tarefasConcluidasNaSemana / config.tarefasPorSemana[state.semanaAtual].length) * 100);
  const logoAtual = state.nivelAtual.img || 'assets/logo_0.png';

  Swal.fire({
    title: '',
    html: `
      <div style="font-family: Arial, sans-serif; width: 550px; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="display: flex; gap: 20px;">
          <div style="flex: 0 0 200px;">
            <img src="${logoAtual}" style="width: 200px; height: 200px; object-fit: contain; border: 3px solid rgba(8, 44, 99, 0.73);">
          </div>
        
          <div style="flex: 1;">
            <h1 style="color: #2B3674; font-size: 1.3rem; margin: 0 0 15px 0; text-align: center; font-weight: bold; line-height: 1.3;">
              Sua produtividade dá vida à logo!
            </h1>
            
            <p style="color: #2B3674; font-size: 0.9rem; line-height: 1.5; margin-bottom: 20px; text-align: center;">
              A cada semana concluída, uma parte da logo ganha cor. Complete todas as tarefas para manter a logo totalmente colorida!
              <br><br>
              E sempre que completar a barra de progresso, você sobe de nível 🥳
            </p>
            
            <div style="font-weight: bold; text-align: center; margin-bottom: 15px; font-size: 0.95rem; color: #2B3674;">
              Seu nível atual é ${state.nivelAtual.nome}
            </div>
            
            <div style="text-align: center;">
              <button id="okButton" style="background: #0571d3; color: white; border: none; padding: 10px 25px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.9rem;">
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    showConfirmButton: false,
    width: 'auto',
    padding: '0',
    background: 'transparent',
    customClass: {
      popup: 'swal-logo-popup',
      htmlContainer: 'swal-logo-html'
    },
    didOpen: () => {
      const okButton = document.getElementById('okButton');
      if (okButton) {
        okButton.addEventListener('click', () => {
          Swal.close();
        });
      }
    }
  });
}

function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown) return;
  
  const container = dropdown.closest('.dropdown-container');
  if (!container) return;
  
  document.querySelectorAll('.dropdown-container').forEach(item => {
    if (item !== container) item.classList.remove('dropdown-active');
  });
  
  container.classList.toggle('dropdown-active');
  
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      container.classList.remove('dropdown-active');
    }
  }, { once: true });
}

document.addEventListener('DOMContentLoaded', function() {
  // Verifica se os elementos existem antes de inicializar
  const progresso = document.getElementById('barraProgresso');
  const presentes = document.querySelectorAll('.presente');
  
  if (!progresso) {
    console.error('Barra de progresso não encontrada no DOM');
  }
  
  if (!presentes || presentes.length === 0) {
    console.error('Ícones de presente não encontrados no DOM');
  }
  
  init();
});

document.addEventListener('DOMContentLoaded', init);

window.concluirTarefa = concluirTarefa;
window.toggleDropdown = toggleDropdown;
window.mostrarAlertaNivel = mostrarAlertaNivel;
window.Informacoes = Informacoes;
window.Logo = Logo;