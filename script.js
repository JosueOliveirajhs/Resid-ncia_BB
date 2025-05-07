const config = {
  incremento: 20,
  niveis: [
    { nome: "1: Arara-vermelha-grande", img: 'assets/logo_20%.png', meta: 1 },
    { nome: "2: Mico-leão-dourado", img: 'assets/logo_40%.png', meta: 2 },
    { nome: "3: Onça-pintada", img: 'assets/logo_60%.png', meta: 3 },
    { nome: "4: Garoupa", img: 'assets/logo_80%.png', meta: 4 },
    { nome: "5: Lobo-Guará", img: 'assets/logo_100%.png', meta: 5 }
  ],
  presenteMarcos: [20, 50, 75],
  recompensas: [
    { img: 'assets/prata.png', mensagem: 'Você ganhou um badge de Prata!' },
    { img: 'assets/ouro.png', mensagem: 'Você ganhou um badge de Ouro!' },
    { img: 'assets/balao_icon.png', mensagem: 'Você desbloqueou uma recompensa especial!' }
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
  nivelAtual: { nome: "0: Iniciante", img: 'assets/logo_0%.png', meta: 0 },
  nivelAnterior: null,
  ultimoProgressoVerificado: 0
};

const tarefasPorSemana = [
  ["Implementar login", "Criar API de usuários", "Estilizar dashboard", "Configurar banco de dados", "Desenvolver sistema de notificações"],
  ["Refatorar módulo de autenticação", "Otimizar consultas ao banco", "Implementar testes unitários", "Criar documentação da API", "Deploy em ambiente de staging"],
  ["Desenvolver feature X", "Corrigir bugs críticos", "Atualizar dependências", "Implementar CI/CD", "Revisão de código em pares"]
];

// Elementos DOM
const progresso = document.getElementById('barraProgresso');
const presentes = document.querySelectorAll('.presente');
const weeklyProgressIcon = document.getElementById('weekly-progress-icon');

function init() {
  carregarProgresso();
  setupEventListeners();
  atualizarUI();
}

function carregarProgresso() {
  const salvo = localStorage.getItem('progressoBB');
  if (salvo) {
    try {
      const dados = JSON.parse(salvo);
      Object.assign(state, dados);
    
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
      nivelAtual: obterNivelAtual(state.semanasCompletas), // Sempre recalcular
      tarefasConcluidas: state.tarefasConcluidas,
      tarefasConcluidasNaSemana: state.tarefasConcluidasNaSemana,
      ultimoProgressoVerificado: state.ultimoProgressoVerificado
  };
  localStorage.setItem('progressoBB', JSON.stringify(dadosParaSalvar));
  
  // Disparar evento personalizado para notificar o perfil
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
}

function registrarAtividade(tipo, descricao, desbloqueouConquista = null) {
  const historico = JSON.parse(localStorage.getItem('historicoPerfil')) || [];
  
  historico.unshift({
    tipo,
    descricao,
    data: new Date().toISOString(),
    desbloqueouConquista
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
      atualizarPresentes();
      salvarProgresso();
      
      // Registra no histórico
      registrarAtividade('presente', `Desbloqueou presente ao alcançar ${marco}%`);
    }
  });
  state.ultimoProgressoVerificado = state.progressoAtual;
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
  const nivelMaximo = config.niveis[config.niveis.length - 1];
  if (semanasCompletas >= nivelMaximo.meta) {
    return nivelMaximo;
  }

  for (let i = 0; i < config.niveis.length; i++) {
    if (semanasCompletas < config.niveis[i].meta) {
      return i === 0 ? 
        { nome: "0: Iniciante", img: 'assets/logo_0%.png', meta: 0 } : 
        config.niveis[i - 1];
    }
  }
  
  return nivelMaximo;
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
    const recompensa = config.recompensas[index];
    Swal.fire({
      title: 'Recompensa já resgatada',
      text: recompensa.mensagem,
      imageUrl: recompensa.img,
      imageWidth: 150,
      imageAlt: 'Recompensa'
    });
    return;
  }
  
  abrirPresenteComEfeitos(index);
}

function abrirPresenteComEfeitos(index) {
  state.presentesAbertos[index] = true;
  const recompensa = config.recompensas[index];
  
  if (presentes[index]) {
    presentes[index].src = recompensa.img;
    presentes[index].classList.remove('presente-desbloqueado');
  }

  // Efeitos de confete
  const confettiConfig = {
    particleCount: index === 1 ? 200 : 150,
    spread: index === 1 ? 100 : 70,
    origin: { y: 0.6 }
  };
  
  if (index === 1) {
    confettiConfig.colors = ['#FFD700', '#C0C0C0', '#FFFFFF'];
  }
  
  confetti(confettiConfig);
  
  // Notificação de presente aberto
  Swal.fire({
    title: 'Presente aberto! 🎁',
    text: recompensa.mensagem,
    imageUrl: recompensa.img,
    imageWidth: 150,
    confirmButtonText: 'Obrigado!'
  });
  
  registrarAtividade('presente', `Resgatou: ${recompensa.mensagem}`);
  salvarProgresso();
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