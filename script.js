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
    { nivel: 5, img: 'assets/Emblema_Nivel5.png', desbloqueado: false, mostrado: false },
    { nivel: 6, img: 'assets/Emblema_Nivel6.png', desbloqueado: false, mostrado: false },
    { nivel: 7, img: 'assets/Emblema_Nivel7.png', desbloqueado: false, mostrado: false },
    { nivel: 8, img: 'assets/Emblema_Nivel8.png', desbloqueado: false, mostrado: false }
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
  setupEventListeners();
  atualizarUI();
  verificarEmblemasCarregados();
  criarMarcadoresBarraProgresso();
}

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

function verificarEmblemasCarregados() {
  config.emblemasNivel.forEach(emblema => {
    if (emblema.desbloqueado && !emblema.mostrado) {
      mostrarEmblemaHeader(emblema);
    }
  });
}

function mostrarEmblemaHeader(emblema) {
  const emblemaEl = document.createElement('img');
  emblemaEl.src = emblema.img;
  emblemaEl.className = 'emblema-notificacao';
  emblemaEl.title = 'Novo emblema desbloqueado! Clique para ver.';

  emblemaEl.addEventListener('click', () => {
    window.location.href = 'Perfil/perfil.html#conquistas';
    emblemaEl.remove();
    emblema.mostrado = true;
    salvarProgresso();
  });

  document.body.appendChild(emblemaEl);
  new Audio('assets/notification.mp3').play().catch(e => console.log("Audio error:", e));
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
      Object.assign(state, dados);

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
    emblemasNivel: config.emblemasNivel.map(e => ({ ...e })),
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
  state.medalhaAtual = index; // Garante que a medalha atual seja a do presente aberto

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