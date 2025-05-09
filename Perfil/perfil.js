const config = {
    niveis: [
        { nome: "1: Beija-flor", img: '../assets/logo_20.png', meta: 1, descricao: "Você está começando sua jornada!" },
        { nome: "2: Tartaruga-de-pente", img: '../assets/logo_40.png', meta: 2, descricao: "Voando mais alto!" },
        { nome: "3: Garça", img: '../assets/logo_60.png', meta: 3, descricao: "Poderoso como a onça-pintada!" },
        { nome: "4: Arara-vermelha-grande", img: '../assets/logo_80.png', meta: 4, descricao: "Grande e imponente!" },
        { nome: "5: Mico-leão-dourado", img: '../assets/logo_100.png', meta: 5, descricao: "Você atingiu o nível máximo!" }
    ],
    recompensas: [
        { img: '../assets/prata.png', mensagem: 'Você ganhou um badge de Prata!' },
        { img: '../assets/ouro.png', mensagem: 'Você ganhou um badge de Ouro!' },
        { img: '../assets/balao_icon.png', mensagem: 'Você desbloqueou uma recompensa especial!' }
    ],
    emblemasNivel: [
        { nivel: 1, img: '../assets/Banner_Nivel1.png' },
        { nivel: 2, img: '../assets/Banner_Nivel2.png' },
        { nivel: 3, img: '../assets/Banner_Nivel3.png' },
        { nivel: 4, img: '../assets/Banner_Nivel4.png' },
        { nivel: 5, img: '../assets/Banner_Nivel5.png' },
        { nivel: 6, img: '../assets/Banner_Nivel6.png' },
        { nivel: 7, img: '../assets/Banner_Nivel7.png' },
        { nivel: 8, img: '../assets/Banner_Nivel8.png' }
    ]
};

function obterNivelAtual(semanasCompletas) {
    const nivelMaximo = config.niveis[config.niveis.length - 1];
    if (semanasCompletas >= nivelMaximo.meta) {
        return nivelMaximo;
    }

    for (let i = 0; i < config.niveis.length; i++) {
        if (semanasCompletas < config.niveis[i].meta) {
            return i === 0 ? 
                { nome: "0: Iniciante", img: 'assets/logo_0.png', meta: 0 } : 
                config.niveis[i - 1];
        }
    }
    
    return nivelMaximo;
}

function sincronizarComPrincipal() {
    const dadosPrincipal = JSON.parse(localStorage.getItem('progressoBB')) || {
        semanasCompletas: 0,
        nivelAtual: { nome: "0: Iniciante", img: 'assets/logo_0.png', meta: 0 },
        tarefasConcluidas: [],
        presentesAbertos: [],
        progressoAtual: 0
    };
    
    const nivelAtual = obterNivelAtual(dadosPrincipal.semanasCompletas);

    atualizarNivelPerfil({
        ...dadosPrincipal,
        nivelAtual
    });
    
    atualizarEstatisticas(dadosPrincipal);
    carregarConquistas(dadosPrincipal);
}

function atualizarNivelPerfil(dados) {
    const nivelElement = document.querySelector('.nivel');
    if (nivelElement) {
        nivelElement.textContent = dados.nivelAtual.nome.split(':')[1].trim();
    }
    const avatarImg = document.querySelector('.avatar');
    if (avatarImg && dados.nivelAtual.img) {
        avatarImg.src = dados.nivelAtual.img;
    }
}

function carregarConquistas(dados) {
    const nivelMaximo = config.niveis[config.niveis.length - 1];
    
    const conquistas = [
        { id: 1, titulo: "Primeiros Passos", descricao: "Complete sua primeira tarefa", icone: "fas fa-star", desbloqueada: dados.tarefasConcluidas.length > 0 },
        { id: 2, titulo: "Colecionador", descricao: "Resgate seu primeiro presente", icone: "fas fa-gift", desbloqueada: dados.presentesAbertos.some(p => p) },
        { id: 3, titulo: "Ascensão", descricao: "Alcance o nível 2", icone: "fas fa-level-up-alt", desbloqueada: dados.nivelAtual.meta >= 2 },
        { id: 4, titulo: "Produtividade", descricao: "Complete 5 tarefas em um dia", icone: "fas fa-bolt", desbloqueada: false },
        { id: 5, titulo: "Mestre Supremo", descricao: "Alcance o nível máximo", icone: "fas fa-crown", desbloqueada: dados.semanasCompletas >= nivelMaximo.meta }
    ];

    config.emblemasNivel.forEach(emblema => {
        const nivelAlvo = emblema.nivel;
        conquistas.push({
            id: 100 + nivelAlvo,
            titulo: `Nível ${nivelAlvo}`,
            descricao: `Alcance o nível ${nivelAlvo}`,
            icone: "fas fa-medal",
            desbloqueada: dados.nivelAtual.meta >= nivelAlvo,
            emblema: emblema.img
        });
    });

    const container = document.querySelector('.conquistas-container');
    if (!container) return;
    container.innerHTML = '';
    
    // Ordenar conquistas: emblemas de nível primeiro, depois outras conquistas
    conquistas.sort((a, b) => {
        if (a.id > 100 && b.id > 100) return a.id - b.id; // Ordenar emblemas por nível
        if (a.id > 100) return -1; // Emblemas primeiro
        if (b.id > 100) return 1;
        return a.id - b.id;
    });

    conquistas.forEach(conquista => {
        const conquistaEl = document.createElement('div');
        conquistaEl.className = `conquista ${conquista.desbloqueada ? '' : 'bloqueada'}`;
        
        const iconeHTML = conquista.emblema 
            ? `<img src="${conquista.emblema}" alt="Emblema Nível ${conquista.id - 100}" class="emblema-nivel">`
            : `<i class="${conquista.icone}"></i>`;
        
        conquistaEl.innerHTML = `
            ${iconeHTML}
            <h3>${conquista.titulo}</h3>
            <p>${conquista.descricao}</p>
            ${conquista.desbloqueada ? '<div class="badge-conquista"><i class="fas fa-check"></i> Conquistado</div>' : '<small>Não desbloqueada</small>'}
        `;
        container.appendChild(conquistaEl);
    });
}

function atualizarEstatisticas(dados) {
    document.getElementById('total-tarefas').textContent = dados.tarefasConcluidas.filter(t => t).length;
    const nivelMaximo = config.niveis[config.niveis.length - 1];
    
    // Conquistas padrão desbloqueadas
    const conquistasPadraoDesbloqueadas = [
        dados.tarefasConcluidas.length > 0,
        dados.presentesAbertos.some(p => p),
        dados.nivelAtual.meta >= 2,
        false,
        dados.semanasCompletas >= nivelMaximo.meta
    ].filter(Boolean).length;
    
    // Emblemas de nível desbloqueados
    const emblemasDesbloqueados = config.emblemasNivel
        .filter(emblema => dados.nivelAtual.meta >= emblema.nivel)
        .length;
    
    document.getElementById('total-conquistas').textContent = 
        conquistasPadraoDesbloqueadas + emblemasDesbloqueados;
    
    const proximoNivel = config.niveis.find(n => n.meta > dados.nivelAtual.meta) || nivelMaximo;
    const semanasParaProximoNivel = proximoNivel.meta - dados.semanasCompletas;
    
    const progressoNivel = document.createElement('div');
    progressoNivel.className = 'progresso-nivel';
    
    const nivelContainer = document.querySelector('.nivel-usuario');
    if (nivelContainer) {
        const progressoAnterior = nivelContainer.querySelector('.progresso-nivel');
        if (progressoAnterior) nivelContainer.removeChild(progressoAnterior);
        nivelContainer.appendChild(progressoNivel);
    }
}

function carregarHistoricoNiveis() {
    const historico = JSON.parse(localStorage.getItem('historicoPerfil')) || [];
    const historicoNiveis = historico.filter(item => item.tipo === 'nivel');
    const timeline = document.getElementById('timeline-historico');
    if (!timeline) return;
    timeline.innerHTML = '';
    if (historicoNiveis.length === 0) {
        timeline.innerHTML = '<p class="sem-registros">Nenhum avanço de nível registrado ainda.</p>';
        return;
    }
    historicoNiveis.forEach(item => {
        const nivel = config.niveis.find(n => n.nome === item.descricao.split(':')[0].trim());
        const itemEl = document.createElement('div');
        itemEl.className = 'item-historico nivel';
        itemEl.innerHTML = `
            <div class="data-historico">${new Date(item.data).toLocaleDateString('pt-BR')}</div>
            <i class="fas fa-trophy icone-historico" style="color:#dc3545"></i>
            <div class="titulo-historico"><strong>Novo nível alcançado:</strong> ${item.descricao}</div>
            <div class="detalhes-historico">${nivel?.descricao || ''}</div>
        `;
        timeline.appendChild(itemEl);
    });
}

function setupEventListeners() {
    window.addEventListener('storage', (e) => {
        if (e.key === 'progressoBB') {
            sincronizarComPrincipal();
            carregarHistoricoNiveis();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    sincronizarComPrincipal();
    carregarHistoricoNiveis();
    
    document.querySelectorAll('.aba').forEach(aba => {
        aba.addEventListener('click', () => {
            document.querySelectorAll('.aba').forEach(a => a.classList.remove('ativa'));
            aba.classList.add('ativa');
            const abaAlvo = aba.getAttribute('data-aba');
            document.querySelectorAll('.conteudo-aba').forEach(conteudo => {
                conteudo.classList.remove('ativa');
                if (conteudo.id === abaAlvo) conteudo.classList.add('ativa');
            });
        });
    });
});

window.addEventListener('storage', () => {
    sincronizarComPrincipal();
    carregarHistoricoNiveis();
});