const config = {
  incremento: 20,
  niveis: [
    { nome: "1: Beija-flor", img: 'assets/logo_20.png', meta: 1 },
    { nome: "2: Tartaruga-de-pente", img: 'assets/logo_40.png', meta: 2 },
    { nome: "3: Garça", img: 'assets/logo_60.png', meta: 3 },
    { nome: "4: Arara-vermelha-grande", img: 'assets/logo_80.png', meta: 4 },
    { nome: "5: Mico-leão-dourado", img: 'assets/logo_100.png', meta: 5 }
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
      img: 'assets/Medalha_Fundador.png',
      mensagem: 'Você ganhou a medalha de Fundador!',
      id: 'medalha-fundador',
      progressoMaximo: 5,
      posicaoBarra: 20
    },
    {
      img: 'assets/Medalha_Construtor.png',
      mensagem: 'Você ganhou a medalha de Construtor!',
      id: 'medalha-construtor',
      progressoMaximo: 5,
      posicaoBarra: 50
    },
    {
      img: 'assets/Medalha_Estabilidade.png',
      mensagem: 'Você ganhou a medalha de Estabilidade!',
      id: 'medalha-estabilidade',
      progressoMaximo: 5,
      posicaoBarra: 75
    }
  ]
};

const state = {
  progressoAtual: 0,
  tarefasConcluidas: Array(5).fill(false),
  presentesDesbloqueados: [false, false, false],
  presentesAbertos: [false, false, false],
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
  }
};

const tarefasPorSemana = [
  ["Implementar login", "Criar API de usuários", "Estilizar dashboard", "Configurar banco de dados", "Desenvolver sistema de notificações"],
  ["Refatorar módulo de autenticação", "Otimizar consultas ao banco", "Implementar testes unitários", "Criar documentação da API", "Deploy em ambiente de staging"],
  ["Desenvolver feature X", "Corrigir bugs críticos", "Atualizar dependências", "Implementar CI/CD", "Revisão de código em pares"]
];

const progresso = document.getElementById('barraProgresso');
const progressoContainer = document.querySelector('.progress-container');
const presentes = document.querySelectorAll('.presente');
const weeklyProgressIcon = document.getElementById('weekly-progress-icon');

function init() {
  carregarProgresso();
  
  // Verifica se precisa mostrar algum emblema
  if (state.nivelAtual && state.nivelAtual.meta > 0) {
    const emblema = config.emblemasNivel.find(e => e.nivel === state.nivelAtual.meta);
    if (emblema) {
      emblema.desbloqueado = true;
      emblema.mostrado = true;
    }
  }
  
  setupEventListeners();
  atualizarUI();
  verificarEmblemasCarregados();
  criarMarcadoresBarraProgresso();
  renderizarEmblemasFixos();
}

function renderizarEmblemasFixos() {
  const container = document.getElementById('emblemasFixosContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Encontra o emblema mais alto desbloqueado
  const emblemaParaMostrar = [...config.emblemasNivel]
    .reverse()
    .find(e => e.desbloqueado);
  
  if (emblemaParaMostrar) {
    const emblemaElement = document.createElement('div');
    emblemaElement.className = 'emblema-fixo desbloqueado';
    
    // Obtém o nome do nível correspondente
    const nivelInfo = config.niveis.find(n => n.meta === emblemaParaMostrar.nivel);
    const nomeNivel = nivelInfo ? nivelInfo.nome.split(': ')[1] : `Nível ${emblemaParaMostrar.nivel}`;
    
    emblemaElement.innerHTML = `
      <img src="${emblemaParaMostrar.img}" alt="Emblema ${nomeNivel}">
      <span class="emblema-nivel">Nível ${emblemaParaMostrar.nivel}</span>
    `;
    
    container.appendChild(emblemaElement);
    
    // Garante que este emblema está marcado como mostrado
    emblemaParaMostrar.mostrado = true;
  }
}

function renderizarMedalhas() {
  const container = document.getElementById('medalhasContainer');
  container.innerHTML = '';
  
  config.recompensas.forEach((medalha, index) => {
    const progresso = state.medalhasProgresso[medalha.id] || { atual: 0, completo: false };
    const porcentagem = progresso.completo ? 100 : (progresso.atual / medalha.progressoMaximo) * 100;
    
    const medalhaCard = document.createElement('div');
    medalhaCard.className = 'medalha-card';
    
    medalhaCard.innerHTML = `
      <img src="${medalha.img}" class="medalha-img" style="opacity: ${porcentagem >= 50 ? '1' : '0.6'}">
      <div class="medalha-nome">${medalha.mensagem.replace('Você ganhou a medalha de ', '').replace('!', '')}</div>
      <div class="medalha-desc">Complete ${medalha.progressoMaximo} tarefas para conquistar</div>
      <div class="medalha-status ${progresso.completo ? 'desbloqueada' : 'bloqueada'}">
        ${progresso.completo ? 'Desbloqueada' : 'Bloqueada'}
      </div>
      <div class="progresso-container">
        <div class="progresso-bar">
          <div class="progresso-fill" style="width: ${porcentagem}%"></div>
        </div>
        <div class="progresso-texto">${Math.round(porcentagem)}% completo</div>
      </div>
    `;
    
    container.appendChild(medalhaCard);
  });
}

function renderizarNiveis() {
  const container = document.getElementById('niveisContainer');
  container.innerHTML = '';
  
  config.niveis.forEach(nivel => {
    const nivelCard = document.createElement('div');
    nivelCard.className = `nivel-card ${state.nivelAtual.meta === nivel.meta ? 'ativo' : ''}`;
    
    nivelCard.innerHTML = `
      <img src="${nivel.img}" class="nivel-img" alt="${nivel.nome}">
      <div class="nivel-nome">${nivel.nome}</div>
      <div class="nivel-meta">Meta: ${nivel.meta} semana${nivel.meta !== 1 ? 's' : ''}</div>
    `;
    
    container.appendChild(nivelCard);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  carregarProgresso();
  
  setTimeout(() => {
    state.progressoAtual = 45;
    state.nivelAtual = config.niveis[1];
    state.medalhasProgresso['medalha-fundador'].atual = 3;
    state.medalhasProgresso['medalha-fundador'].completo = false;
    atualizarUI();
  }, 1000);
});

function mostrarAlertaNivel(nivel) {
  const nivelInfo = config.niveis.find(n => n.meta === nivel);
  if (!nivelInfo) return;

  Swal.fire({
    title: '',
    html: `
      <div style="flex: 1;">
        <h1 style="color: #2B3674; font-size: 2rem; margin: 0 0 15px 0; text-align: center; font-weight: bold; line-height: 1.3;">
          Seu nível Atual:
        </h1>
        <div style="text-align: center; font-size: 1.5rem; font-weight: bold; margin-bottom: 20px; color: #2B3674;">
          NIVEL ${nivel}<br>
          ${nivelInfo.nome.split(': ')[1]}
        </div>
        <div style="text-align: center; font-size: 1rem; line-height: 1.6; color: #2B3674; margin: 20px 0 20px 0;">
          Cada vez que você preenche toda a logo com tarefas concluídas, sobe um nível.<br>
          Continue evoluindo e mostre sua dedicação.
        </div>
      </div>
    `,
    confirmButtonText: 'OK',
    showCloseButton: false,
    width: '600px',
    padding: '20px',
    background: '#fff',
    customClass: {
      popup: 'swal-custom-popup',
      title: 'swal-custom-title',
      htmlContainer: 'swal-custom-html'
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
        <img src="assets/balao_surpresa.png" style="width: 100px; opacity: 0.8;">
        <svg xmlns="http://www.w3.org/2000/svg" width="160" height="100" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
</svg>
        <img src="assets/presente_colorido.png" style="width: 100px; opacity: 0.8;">
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

window.Informacoes = Informacoes;

function Logo() {
  const progresso = Math.round((state.tarefasConcluidasNaSemana / tarefasPorSemana[state.semanaAtual].length) * 100);
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

window.Logo = Logo;

function criarMarcadoresBarraProgresso() {
  if (!progressoContainer) return;
  progressoContainer.querySelectorAll('.marcador-recompensa').forEach(m => m.remove());

  const medalha = config.recompensas[state.medalhaAtual];
  const progresso = state.medalhasProgresso[medalha.id] || { atual: 0, completo: false };

  const porcentagem = progresso.completo ? 100 : (progresso.atual / medalha.progressoMaximo) * 100;

  const marcador = document.createElement('div');
  marcador.className = 'marcador-recompensa';
  marcador.style.left = `${medalha.posicaoBarra}%`;

  const img = document.createElement('img');
  img.src = medalha.img;
  img.alt = medalha.mensagem;
  img.title = `${medalha.mensagem} (${Math.round(porcentagem)}%)`;
  img.style.opacity = progresso.completo ? 1 : 0.5 + (porcentagem / 100 * 0.5);

  marcador.appendChild(img);
  progressoContainer.appendChild(marcador);
}
function verificarEmblemasNivel() {
  const nivelAtual = state.nivelAtual.meta;


  config.emblemasNivel.forEach(emblema => {
    if (nivelAtual >= emblema.nivel) {
      emblema.desbloqueado = true;
    }
  });

  const emblemaAtual = config.emblemasNivel.find(e => e.nivel === nivelAtual);
  if (emblemaAtual) {
    mostrarEmblemaHeader(emblemaAtual);
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


function verificarEmblemasNivel() {
  const nivelAtual = state.nivelAtual.meta;

  config.emblemasNivel.forEach(emblema => {
    if (nivelAtual >= emblema.nivel && !emblema.desbloqueado) {
      emblema.desbloqueado = true;
      mostrarEmblemaHeader(emblema);
    }
  });
}
function carregarProgresso() {
  const salvo = localStorage.getItem('progressoBB');
  if (salvo) {
    try {
      const dados = JSON.parse(salvo);
      
      // Atualiza primeiro o state
      Object.assign(state, dados);
      
      // Depois atualiza os emblemas no config com os dados salvos
      if (dados.emblemasNivel) {
        dados.emblemasNivel.forEach(emblemaSalvo => {
          const emblema = config.emblemasNivel.find(e => e.nivel === emblemaSalvo.nivel);
          if (emblema) {
            emblema.desbloqueado = emblemaSalvo.desbloqueado;
            emblema.mostrado = emblemaSalvo.mostrado;
          }
        });
      }

      // Garante que medalhasProgresso existe
      if (!state.medalhasProgresso) {
        state.medalhasProgresso = {
          'medalha-fundador': { atual: 0, completo: false },
          'medalha-construtor': { atual: 0, completo: false },
          'medalha-estabilidade': { atual: 0, completo: false }
        };
      }

      if (state.medalhaAtual === undefined) {
        state.medalhaAtual = 0;
      }

      state.nivelAtual = obterNivelAtual(state.semanasCompletas);
      state.nivelAnterior = state.nivelAtual;
      state.ultimoProgressoVerificado = state.progressoAtual;
      verificarMarcos();
    } catch (e) {
      console.error("Erro ao carregar progresso:", e);
      localStorage.removeItem('progressoBB');
    }
  }
}
function salvarProgresso() {
  // Atualiza os emblemas no state antes de salvar
  state.emblemasNivel = config.emblemasNivel.map(e => ({ 
    nivel: e.nivel, 
    img: e.img, 
    desbloqueado: e.desbloqueado, 
    mostrado: e.mostrado 
  }));
  
  const dadosParaSalvar = {
    semanasCompletas: state.semanasCompletas,
    semanaAtual: state.semanaAtual,
    progressoAtual: state.progressoAtual,
    presentesDesbloqueados: state.presentesDesbloqueados,
    presentesAbertos: state.presentesAbertos,
    nivelAtual: state.nivelAtual,
    tarefasConcluidas: state.tarefasConcluidas,
    tarefasConcluidasNaSemana: state.tarefasConcluidasNaSemana,
    ultimoProgressoVerificado: state.ultimoProgressoVerificado,
    emblemasNivel: state.emblemasNivel,
    emblemasSemanaisDesbloqueados: [...state.emblemasSemanaisDesbloqueados],
    diasConsecutivos: state.diasConsecutivos,
    ultimoDiaAtividade: state.ultimoDiaAtividade,
    medalhaAtual: state.medalhaAtual,
    medalhasProgresso: { ...state.medalhasProgresso }
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
  atualizarPresentes();
  atualizarTarefasUI();
  criarMarcadoresBarraProgresso();
  renderizarEmblemasFixos();
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
  config.presenteMarcos.forEach((marco, index) => {
    if (state.progressoAtual >= marco && state.ultimoProgressoVerificado < marco) {
      if (marco >= 50) {
        confetti({
          particleCount: 100 + (index * 20),
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#0571d3', '#FFFFFF']
        });
      }
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
      state.presentesDesbloqueados[index] = true;
      atualizarUI();
      salvarProgresso();
      registrarAtividade('presente', `Desbloqueou presente ao alcançar ${marco}%`);
    }
  });
  state.ultimoProgressoVerificado = state.progressoAtual;
}

function atualizarProgressoMedalhaAtual() {
  const medalhaId = config.recompensas[state.medalhaAtual].id;
  const medalha = config.recompensas[state.medalhaAtual];

  if (!state.medalhasProgresso[medalhaId]) {
    state.medalhasProgresso[medalhaId] = { atual: 0, completo: false };
  }

  const progresso = state.medalhasProgresso[medalhaId];

  if (!progresso.completo) {
    progresso.atual += 1;

    const porcentagem = Math.round((progresso.atual / medalha.progressoMaximo) * 100);
    const opacidade = 0.5 + (porcentagem / 100 * 0.5);

    if (progresso.atual >= medalha.progressoMaximo) {
      progresso.completo = true;

      Swal.fire({
        title: 'Medalha Completa!',
        html: `<p>${medalha.mensagem}</p>
              <img src="${medalha.img}" style="width: 200px; margin: 15px auto; opacity: 1">
              <p>Você completou 100% desta medalha!</p>`,
      });

      registrarAtividade('medalha', `Desbloqueou medalha: ${medalha.mensagem}`, medalha);

      if (state.medalhaAtual < config.recompensas.length - 1) {
        state.medalhaAtual++;
      } else {
        state.medalhaAtual = 0;
      }
    }

    criarMarcadoresBarraProgresso();
    salvarProgresso();
  }
}

function mostrarNotificacaoMetaSemanal() {
  if (state.tarefasConcluidasNaSemana === tarefasPorSemana[state.semanaAtual].length) {
    Swal.fire({
      title: '🎉 Metas Semanais Concluídas!',
      text: `Parabéns! Você completou todas as ${state.tarefasConcluidasNaSemana} tarefas desta semana!`,
      icon: 'success',
      confirmButtonText: 'Continuar!'
    });
  }
}

function atualizarBarraProgresso() {
  if (progresso) {
    progresso.value = state.progressoAtual;
  }
}

function atualizarIconeHeader() {
  if (weeklyProgressIcon && state.nivelAtual.img) {
    weeklyProgressIcon.src = state.nivelAtual.img;
    weeklyProgressIcon.alt = `Nível: ${state.nivelAtual.nome}`;
    const weeklyProgressElement = document.querySelector('.weekly-progress');
    if (weeklyProgressElement) {
      weeklyProgressElement.setAttribute('data-progress', `Nível ${state.nivelAtual.nome}`);
    }
  }
}

function atualizarPresentes() {
  if (presentes) {
    presentes.forEach((presente, index) => {
      if (!presente) return;
      const marcoAlcancado = state.progressoAtual >= config.presenteMarcos[index];

      if (marcoAlcancado) {
        if (state.presentesAbertos[index]) {
          presente.src = config.recompensas[index].img;
          presente.classList.remove('presente-desbloqueado');

          const medalhaId = config.recompensas[index].id;
          const progresso = state.medalhasProgresso[medalhaId] || { atual: 0, completo: false };
          const porcentagem = progresso.completo ? 100 : (progresso.atual / config.recompensas[index].progressoMaximo) * 100;
          const opacidade = progresso.completo ? 1 : 0.3 + (porcentagem / 100 * 0.7);

          presente.style.opacity = opacidade;
          presente.title = `${config.recompensas[index].mensagem} (${Math.round(porcentagem)}%)`;
        } else {
          presente.src = "assets/presente_colorido.png";
          presente.classList.add('presente-desbloqueado');
          presente.style.opacity = '1';
          presente.title = 'Presente disponível para abertura';
        }
        state.presentesDesbloqueados[index] = true;
      } else {
        presente.src = "assets/balao_surpresa.png";
        presente.classList.remove('presente-desbloqueado');
        presente.style.opacity = '1';
        state.presentesDesbloqueados[index] = false;
        presente.title = 'Presente indisponível';
      }
    });
  }
}

function atualizarTarefasUI() {
  const dropdownContent = document.getElementById('tasksDropdown');
  if (!dropdownContent) return;
  const questsContainer = dropdownContent.querySelector('.questsInAndament');
  if (!questsContainer) return;
  questsContainer.innerHTML = tarefasPorSemana[state.semanaAtual]
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
  for (let i = config.niveis.length - 1; i >= 0; i--) {
    if (semanasCompletas >= config.niveis[i].meta) {
      return config.niveis[i];
    }
  }
  return { nome: "0: Iniciante", img: 'assets/logo_0.png', meta: 0 };
}

function abrirPresente(index) {
  if (!state.presentesDesbloqueados[index]) {
    Swal.fire({
      title: 'Continue progredindo!',
      text: `Complete mais ${config.presenteMarcos[index] - state.progressoAtual}% para desbloquear este presente.`,
      icon: 'info'
    });
    return;
  }
  if (state.presentesAbertos[index]) {
    const medalha = config.recompensas[index];
    const progresso = state.medalhasProgresso[medalha.id];
    const porcentagem = progresso.completo ? 100 : Math.round((progresso.atual / medalha.progressoMaximo) * 100);

    Swal.fire({
      title: 'Progresso da Medalha',
      html: `<p>${medalha.mensagem}</p>
            <img src="${medalha.img}" style="width: 200px; margin: 15px auto; opacity: ${progresso.completo ? '1' : '0.5'}">
            <p>Progresso: ${porcentagem}%</p>`,
      confirmButtonText: 'OK'
    });
    return;
  }
  abrirPresenteComEfeitos(index);
}

function abrirPresenteComEfeitos(index) {
  state.presentesAbertos[index] = true;
  state.medalhaAtual = index;

  if (presentes[index]) {
    presentes[index].src = config.recompensas[index].img;
    presentes[index].classList.remove('presente-desbloqueado');
    const progresso = state.medalhasProgresso[config.recompensas[index].id];
    presentes[index].style.opacity = progresso.completo ? '1' : '0.5';
  }

  const medalha = config.recompensas[index];
  const progressoMedalha = state.medalhasProgresso[medalha.id] || { atual: 0, completo: false };
  const porcentagem = progressoMedalha.completo ? 100 : Math.round((progressoMedalha.atual / medalha.progressoMaximo) * 100);

  Swal.fire({
    title: 'Presente Aberto!',
    html: `<p>${medalha.mensagem}</p>
          <img src="${medalha.img}" style="width: 200px; margin: 15px auto; opacity: ${progressoMedalha.completo ? '1' : '0.7'}">
          <p>Progresso: ${porcentagem}%</p>`,
    confirmButtonText: 'OK'
  });

  atualizarProgressoMedalhaAtual();
  criarMarcadoresBarraProgresso();

  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function concluirTarefa(checkbox, index) {
  const nivelMaximo = config.niveis[config.niveis.length - 1];
  if (state.semanasCompletas >= nivelMaximo.meta) {
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
      registrarAtividade('tarefa', `Concluída: ${tarefasPorSemana[state.semanaAtual][index]}`);
      atualizarUI();
      verificarMarcos();
      salvarProgresso();
      if (state.tarefasConcluidasNaSemana === tarefasPorSemana[state.semanaAtual].length) {
        const nivelAntes = state.nivelAtual;
        state.semanasCompletas++;
        state.nivelAtual = obterNivelAtual(state.semanasCompletas);
        atualizarIconeHeader();
        if (nivelAntes.nome !== state.nivelAtual.nome) {
          mostrarMensagemNovoNivel(state.nivelAtual);
          registrarAtividade('nivel', `Alcançado: ${state.nivelAtual.nome}`);
        }
        celebrarConclusaoSemanal();
      }
    } else {
      Swal.fire({
        title: 'Ops! 😢',
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
    mostrarEmblemaHeader(emblema);
  }
  Swal.fire({
    title: `Novo nível alcançado! 🎉`,
    html: `<p>Você atingiu o nível <strong>${nivel.nome}</strong>!</p>
          <img src="${nivel.img}" style="width: 150px; margin: 15px auto;">`,
    icon: 'success',
    confirmButtonText: 'Continuar evoluindo!'
  });
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
      if (!atingiuNivelMaximo) {
        state.semanaAtual = (state.semanaAtual + 1) % tarefasPorSemana.length;
        resetarTarefas();
      }
    });
  }
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
    state.ultimoProgressoVerificado = 0;
    atualizarUI();
    salvarProgresso();
  }
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

document.addEventListener('DOMContentLoaded', init);

window.concluirTarefa = concluirTarefa;
window.toggleDropdown = toggleDropdown;
window.mostrarAlertaNivel = mostrarAlertaNivel;