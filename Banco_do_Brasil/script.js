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
      nivelAtual: { nome: "Inicial", img: 'assets/logo_0%.png', meta: 1 },
      nivelAnterior: null
    };

    const tarefasPorSemana = [
      [
        "Implementar login",
        "Criar API de usuários",
        "Estilizar dashboard",
        "Configurar banco de dados",
        "Desenvolver sistema de notificações"
      ],
      [
        "Refatorar módulo de autenticação",
        "Otimizar consultas ao banco",
        "Implementar testes unitários",
        "Criar documentação da API",
        "Deploy em ambiente de staging"
      ],
      [
        "Desenvolver feature X",
        "Corrigir bugs críticos",
        "Atualizar dependências",
        "Implementar CI/CD",
        "Revisão de código em pares"
      ]
    ];

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
        nivelAnterior: state.nivelAnterior,
        tarefasConcluidas: state.tarefasConcluidas,
        tarefasConcluidasNaSemana: state.tarefasConcluidasNaSemana
      };
      localStorage.setItem('progressoBB', JSON.stringify(dadosParaSalvar));
    }

    function setupEventListeners() {
      presentes.forEach((presente, index) => {
        presente.addEventListener('click', () => abrirPresente(index));
      });
    }

    function atualizarUI() {
      atualizarBarraProgresso();
      atualizarIconeHeader();
      atualizarPresentes();
      atualizarTarefasUI();
    }
    
    function verificarMarcos() {
  config.marcos.forEach(marco => {
    if (state.progressoAtual >= marco && state.progressoAtual - config.incremento < marco) {
      let confettiConfig = {
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      };
      
      if (marco >= 75) {
        confettiConfig.particleCount = 150;
        confettiConfig.colors = ['#FFD700', '#FFFFFF', '#0571d3'];
      }
      
      confetti(confettiConfig);
      
      Swal.fire({
        title: 'Marco alcançado! 🏆',
        html: `<p>Você atingiu <strong>${marco}%</strong> do seu objetivo!</p>
              <p style="font-size: 0.9em; margin-top: 10px;">Continue assim!</p>`,
        icon: 'success',
        confirmButtonColor: '#0571d3',
        confirmButtonText: 'Rumo aos 100%!'
      });
    }
  });
}
    function atualizarBarraProgresso() {
      if (progresso) {
        progresso.value = state.progressoAtual;
      }
    }

    function atualizarIconeHeader() {
      if (!weeklyProgressIcon) return;

      weeklyProgressIcon.src = state.nivelAtual.img;
      weeklyProgressIcon.alt = `Nível: ${state.nivelAtual.nome}`;

      const weeklyProgressElement = document.querySelector('.weekly-progress');
      if (weeklyProgressElement) {
        weeklyProgressElement.setAttribute('data-progress', `Nível ${state.nivelAtual.nome}`);
      }
    }

    function atualizarPresentes() {
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
            state.presentesDesbloqueados[index] = true;
          }
        } else {
          presente.src = "assets/balao_surpresa.png";
          presente.classList.remove('presente-desbloqueado');
          state.presentesDesbloqueados[index] = false;
        }
      });
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
               ${state.tarefasConcluidas[index] ? 'checked disabled' : ''} />
        <span>${tarefa}</span>
      </label>
    `).join('');
    }

    function obterNivelAtual(semanasCompletas) {
      let nivelAtual = config.niveis[0];
      for (const nivel of config.niveis) {
        if (semanasCompletas >= nivel.meta) {
          nivelAtual = nivel;
        } else {
          break;
        }
      }
      return nivelAtual;
    }

    function getMensagemNivel(nivel) {
      const mensagens = {
        "Arara-vermelha-grande": "Você está começando sua jornada, assim como a garoupa no fundo do mar!",
        "Mico-leão-dourado": "Voando mais alto, assim como a arara pelos céus do Brasil!",
        "Onça-pintada": "Poderoso como a onça-pintada, você está no caminho certo!",
        "Garoupa": "Grande e imponente como o mero, suas conquistas são notáveis!",
        "Lobo-Guará": "Majestoso como o lobo-guará, você atingiu o nível máximo!"
      };
      return mensagens[nivel] || "Continue progredindo para alcançar novos níveis!";
    }

    function abrirPresente(index) {
      if (!state.presentesDesbloqueados[index]) {
        mostrarMensagemPresenteNaoDesbloqueado(index);
        return;
      }

      if (state.presentesAbertos[index]) {
        mostrarMensagemPresenteJaAberto(index);
        return;
      }

      abrirPresenteComEfeitos(index);
    }

    function mostrarMensagemPresenteNaoDesbloqueado(index) {
      Swal.fire({
        title: 'Continue progredindo!',
        text: `Complete mais ${config.presenteMarcos[index] - state.progressoAtual}% para desbloquear este presente.`,
        icon: 'info',
        confirmButtonText: 'Vamos lá!'
      });
    }

    function mostrarMensagemPresenteJaAberto(index) {
      const recompensa = config.recompensas[index];
      Swal.fire({
        title: 'Recompensa já resgatada',
        text: recompensa.mensagem,
        imageUrl: recompensa.img,
        imageWidth: 150,
        imageHeight: 150,
        imageAlt: 'Recompensa',
        confirmButtonText: 'Entendi'
      });
    }

    function abrirPresenteComEfeitos(index) {
      state.presentesAbertos[index] = true;
      const recompensa = config.recompensas[index];

      if (presentes[index]) {
        presentes[index].src = recompensa.img;
        presentes[index].classList.remove('presente-desbloqueado');
      }

      const confettiConfig = {
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      };

      if (index === 1) {
        confettiConfig.particleCount = 200;
        confettiConfig.spread = 100;
        confettiConfig.colors = ['#FFD700', '#C0C0C0', '#FFFFFF'];
      }

      confetti(confettiConfig);

      Swal.fire({
        title: 'Presente aberto! 🎁',
        text: recompensa.mensagem,
        imageUrl: recompensa.img,
        imageWidth: 150,
        imageHeight: 150,
        imageAlt: 'Recompensa',
        confirmButtonText: 'Obrigado!'
      });

      salvarProgresso();
    }

    function concluirTarefa(checkbox, index) {
      if (state.tarefasConcluidas[index]) {
        checkbox.checked = true;
        return;
      }

      Swal.fire({
        title: 'Confirmar conclusão',
        text: 'Deseja marcar esta tarefa como concluída?',
        imageUrl: 'assets/Mascote_feliz.png',
        imageWidth: 200,
        imageHeight: 250,
        imageAlt: 'Mascote feliz',
        showCancelButton: true,
        confirmButtonColor: '#0571d3',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, concluir!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          state.tarefasConcluidas[index] = true;
          state.tarefasConcluidasNaSemana++;
          state.progressoAtual += config.incremento;

          checkbox.disabled = true;
          atualizarUI();
          salvarProgresso();

          if (state.tarefasConcluidasNaSemana === tarefasPorSemana[state.semanaAtual].length) {
            const nivelAntes = state.nivelAtual;
            state.semanasCompletas++;
            state.nivelAtual = obterNivelAtual(state.semanasCompletas);

            if (nivelAntes.nome !== state.nivelAtual.nome) {
              mostrarMensagemNovoNivel(state.nivelAtual);
            }

            celebrarConclusaoSemanal();
          }
        } else {
          Swal.fire({
            title: 'Ops! 😢',
            text: 'Você realmente deseja cancelar esta tarefa?',
            imageUrl: 'assets/Mascote-triste.png',
            imageWidth: 200,
            imageHeight: 250,
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
          <img src="${nivel.img}" style="width: 150px; margin: 15px auto;">
          <p style="font-size: 0.9em;">${getMensagemNivel(nivel.nome)}</p>`,
        icon: 'success',
        confirmButtonColor: '#0571d3',
        confirmButtonText: 'Continuar evoluindo!'
      });

      salvarProgresso();
    }

    function celebrarConclusaoSemanal() {
      confetti({
        particleCount: 300,
        spread: 100,
        origin: { y: 0.3 }
      });

      Swal.fire({
        title: 'Semana concluída! 🎉',
        html: `<p>Parabéns! Você completou todas as tarefas desta semana!</p>
          <p>Nível atual <strong>${state.nivelAtual.nome}</strong></p>
          <img src="${state.nivelAtual.img}" style="width: 100px; margin: 20px auto;">
          <p>${getMensagemNivel(state.nivelAtual.nome)}</p>`,
        confirmButtonText: 'Iniciar nova semana!',
        confirmButtonColor: '#0571d3'
      }).then(() => {
        state.semanaAtual = (state.semanaAtual + 1) % tarefasPorSemana.length;
        resetarTarefas();
      });
    }

    function resetarTarefas() {
      state.tarefasConcluidas = Array(5).fill(false);
      state.tarefasConcluidasNaSemana = 0;
      state.progressoAtual = 0;
      state.presentesDesbloqueados = [false, false, false];
      state.presentesAbertos = [false, false, false];

      atualizarUI();
      salvarProgresso();
    }

    function toggleDropdown(dropdownId) {
      const dropdown = document.getElementById(dropdownId);
      if (!dropdown) return;

      const container = dropdown.closest('.dropdown-container');
      if (!container) return;

      document.querySelectorAll('.dropdown-container').forEach(item => {
        if (item !== container) {
          item.classList.remove('dropdown-active');
        }
      });

      container.classList.toggle('dropdown-active');

      document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
          container.classList.remove('dropdown-active');
        }
      }, { once: true });
    }

    document.addEventListener('DOMContentLoaded', init);
