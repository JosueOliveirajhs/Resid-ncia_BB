const config = {
    niveis: [
        { nome: "1: Beija-flor", img: '../assets/logo_20.png', meta: 1, descricao: "Você está começando sua jornada!" },
        { nome: "2: Tartaruga-de-pente", img: '../assets/logo_40.png', meta: 2, descricao: "Voando mais alto!" },
        { nome: "3: Garça", img: '../assets/logo_60.png', meta: 3, descricao: "Poderoso como a onça-pintada!" },
        { nome: "4: Arara-vermelha-grande", img: '../assets/logo_80.png', meta: 4, descricao: "Grande e imponente!" },
        { nome: "5: Mico-leão-dourado", img: '../assets/logo_100.png', meta: 5, descricao: "Você atingiu o nível máximo!" }
    ],
    emblemasNivel: [
        { nivel: 1, img: '../assets/Banner_Nivel1.png' },
        { nivel: 2, img: '../assets/Banner_Nivel2.png' },
        { nivel: 3, img: '../assets/Banner_Nivel3.png' },
        { nivel: 4, img: '../assets/Banner_Nivel4.png' },
        { nivel: 5, img: '../assets/Banner_Nivel5.png' }
    ],
    emblemasSemanais: [
        [
            { id: 'semana1-1', img: '../Medalhas/Fundador_5.jpeg', semana: 1, titulo: "Fundador", descricao: "Concluiu todas as tarefas da semana 1" },
            { id: 'semana1-2', img: '../Medalhas/Construtor_5.jpeg', semana: 1, titulo: "Construtor", descricao: "Concluiu 3 tarefas na semana 1" },
            { id: 'semana1-3', img: '../Medalhas/Estabilidade_5.jpeg', semana: 1, titulo: "Estabilidade", descricao: "Concluiu tarefas por 3 dias consecutivos" }
        ],
        [
            { id: 'semana2-1', img: '../Medalhas/Desenvolvimento_5.jpeg', semana: 2, titulo: "Desenvolvimento", descricao: "Concluiu todas as tarefas da semana 2" },
            { id: 'semana2-2', img: '../Medalhas/Ousadia_5.jpeg', semana: 2, titulo: "Ousadia", descricao: "Concluiu tarefas difíceis na semana 2" },
            { id: 'semana2-3', img: '../Medalhas/Estabilidade_5.jpeg', semana: 2, titulo: "Estabilidade", descricao: "Concluiu tarefas por 5 dias consecutivos" }
        ],
        [
            { id: 'semana3-1', img: '../Medalhas/Fundador_5.jpeg', semana: 3, titulo: "Fundador", descricao: "Concluiu todas as tarefas da semana 3" },
            { id: 'semana3-2', img: '../Medalhas/Construtor_5.jpeg', semana: 3, titulo: "Construtor", descricao: "Concluiu 4 tarefas na semana 3" },
            { id: 'semana3-3', img: '../Medalhas/Ousadia_5.jpeg', semana: 3, titulo: "Ousadia", descricao: "Concluiu todas as tarefas antes do prazo" }
        ]
    ],
    medalhas: [
        { id: 'medalha-fundador', img: '../Medalhas/Fundador_5.jpeg', titulo: "Fundador", descricao: "Complete as primeiras conquistas", progressoMaximo: 5 },
        { id: 'medalha-construtor', img: '../Medalhas/Construtor_5.jpeg', titulo: "Construtor", descricao: "Construa bases sólidas", progressoMaximo: 5 },
        { id: 'medalha-estabilidade', img: '../Medalhas/Estabilidade_5.jpeg', titulo: "Estabilidade", descricao: "Mantenha consistência", progressoMaximo: 5 }
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
        progressoAtual: 0,
        emblemasSemanaisDesbloqueados: [],
        medalhasProgresso: {
            'medalha-fundador': { atual: 0, completo: false },
            'medalha-construtor': { atual: 0, completo: false },
            'medalha-estabilidade': { atual: 0, completo: false }
        }
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

    // Adicionar emblemas de nível
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

    // Adicionar emblemas semanais
    config.emblemasSemanais.flat().forEach(emblema => {
        if (dados.emblemasSemanaisDesbloqueados?.includes(emblema.id)) {
            conquistas.push({
                id: 200 + emblema.semana * 10 + config.emblemasSemanais[emblema.semana - 1].indexOf(emblema),
                titulo: emblema.titulo,
                descricao: emblema.descricao,
                icone: "fas fa-calendar-week",
                desbloqueada: true,
                emblema: emblema.img
            });
        }
    });


     config.medalhas.forEach(medalha => {
        const progresso = dados.medalhasProgresso[medalha.id] || { atual: 0, completo: false };
        conquistas.push({
            id: 300 + config.medalhas.indexOf(medalha),
            titulo: medalha.titulo,
            descricao: medalha.descricao,
            icone: "fas fa-award",
            desbloqueada: progresso.completo,
            emblema: medalha.img,
            progresso: progresso.completo ? 100 : (progresso.atual / medalha.progressoMaximo) * 100
        });
    });
    
    const container = document.querySelector('.conquistas-container');
    if (!container) return;
    container.innerHTML = '';
    

    // Ordenar conquistas: emblemas de nível primeiro, depois emblemas semanais, depois outras conquistas
    conquistas.sort((a, b) => {
        if (a.id > 100 && b.id > 100) {
            if (a.id > 200 && b.id > 200) return a.id - b.id; // Ordenar emblemas semanais
            if (a.id > 200) return 1; // Emblemas semanais depois dos de nível
            if (b.id > 200) return -1;
            return a.id - b.id; // Ordenar emblemas de nível
        }
        return a.id - b.id;
    });

    conquistas.forEach((conquista, index) => {
    setTimeout(() => {
        const conquistaEl = document.createElement('div');
        conquistaEl.className = `conquista ${conquista.desbloqueada ? '' : 'bloqueada'}`;
        
        const iconeHTML = conquista.emblema 
            ? `<img src="${conquista.emblema}" alt="${conquista.titulo}" class="emblema-nivel">`
            : `<i class="${conquista.icone}"></i>`;
        
        conquistaEl.innerHTML = `
            ${iconeHTML}
            <h3>${conquista.titulo}</h3>
            <p>${conquista.descricao}</p>
            ${conquista.desbloqueada ? '<div class="badge-conquista"><i class="fas fa-check"></i> Conquistado</div>' : '<small>Não desbloqueada</small>'}
        `;

        container.appendChild(conquistaEl);

        // Animação simples (opcional)
        conquistaEl.style.opacity = 0;
        conquistaEl.style.transition = "opacity 0.5s ease-in";
        requestAnimationFrame(() => {
            conquistaEl.style.opacity = 1;
        });
    }, index * 150); // 150ms entre cada exibição
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
    
    // Emblemas semanais desbloqueados
    const emblemasSemanaisDesbloqueados = dados.emblemasSemanaisDesbloqueados?.length || 0;
    
    document.getElementById('total-conquistas').textContent = 
        conquistasPadraoDesbloqueadas + emblemasDesbloqueados + emblemasSemanaisDesbloqueados;
    
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
    const historicoNiveis = historico.filter(item => item.tipo === 'nivel' || item.tipo === 'emblema');
    const timeline = document.getElementById('timeline-historico');
    if (!timeline) return;
    timeline.innerHTML = '';
    if (historicoNiveis.length === 0) {
        timeline.innerHTML = '<p class="sem-registros">Nenhum avanço de nível registrado ainda.</p>';
        return;
    }
    historicoNiveis.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = `item-historico ${item.tipo}`;
        
        if (item.tipo === 'nivel') {
            const nivel = config.niveis.find(n => n.nome === item.descricao.split(':')[0].trim());
            itemEl.innerHTML = `
                <div class="data-historico">${new Date(item.data).toLocaleDateString('pt-BR')}</div>
                <i class="fas fa-trophy icone-historico" style="color:#dc3545"></i>
                <div class="titulo-historico"><strong>Novo nível alcançado:</strong> ${item.descricao}</div>
                <div class="detalhes-historico">${nivel?.descricao || ''}</div>
            `;
        } else if (item.tipo === 'emblema' && item.emblema) {
            itemEl.innerHTML = `
                <div class="data-historico">${new Date(item.data).toLocaleDateString('pt-BR')}</div>
                <img src="${item.emblema.img}" class="icone-historico" style="width:24px;height:24px">
                <div class="titulo-historico"><strong>Novo emblema:</strong> ${item.emblema.titulo}</div>
                <div class="detalhes-historico">${item.emblema.descricao}</div>
            `;
        }
        
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