// Objetivo: Implementar as funcionalidades necessárias no projeto  - projeto Scratch na Educação Básica
// Desenvolvido por: Gisele Nunes, Rodrigo Barbosa
// Data: Segundo semestre de 2025 

// - Toggle de Tema Escuro/Claro: Permite alternar entre temas e salva a preferência
// - Rolagem Suave: Suaviza a navegação por links âncora
// - Navegação Ativa: Destaca a página atual no menu de navegação
// - Lazy Loading de Imagens: Carrega imagens apenas quando ficam visíveis
// - Funcionalidade de Impressão: Permite imprimir os cartões Scratch

// =============================================
// DARK MODE TOGGLE FUNCTIONALITY
// =============================================

// Obtém o elemento do botão de alternância do tema pelo ID
const themeToggle = document.getElementById('themeToggle');

// Verifica as preferências de tema do sistema operacional/usuario
// A Media Query '(prefers-color-scheme: dark)' retorna true se o usuário prefere tema escuro
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Recupera o tema salvo no localStorage (se existir)
// O localStorage persiste mesmo após fechar o navegador
const currentTheme = localStorage.getItem('theme');

// VERIFICAÇÃO ROBUSTA DO TEMA ATUAL
// Se o tema salvo por 'dark' OU (não houver tema salvo E o sistema preferir tema escuro)
if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    // Adiciona a classe 'dark-mode' ao body para aplicar o tema escuro
    document.body.classList.add('dark-mode');
    // Altera o ícone do botão para sol (indicando que clicar ativará o modo claro)
    themeToggle.textContent = '☀️';
} else {
    // Define o ícone como lua (indicando que clicar ativará o modo escuro)
    themeToggle.textContent = '🌙';
}

// ADICIONA EVENT LISTENER PARA O CLIQUE NO BOTÃO DE TEMA
themeToggle.addEventListener('click', function () {
    // Alterna a classe 'dark-mode' no elemento body
    // Se existir, remove; se não existir, adiciona
    document.body.classList.toggle('dark-mode');

    // Define o tema padrão como 'light'
    let theme = 'light';

    // Verifica se o body agora possui a classe 'dark-mode' após o toggle
    if (document.body.classList.contains('dark-mode')) {
        // Se estiver em modo escuro, atualiza a variável theme
        theme = 'dark';
        // Altera o ícone para sol
        themeToggle.textContent = '☀️';
    } else {
        // Altera o ícone para lua
        themeToggle.textContent = '🌙';
    }

    // Salva a preferência do tema no localStorage para persistência
    localStorage.setItem('theme', theme);
});

// =============================================
// SMOOTH SCROLLING PARA LINKS ÂNCORA
// =============================================

// Seleciona TODOS os links que começam com "#" (links âncora)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Adiciona um event listener de clique para cada link âncora
    anchor.addEventListener('click', function (e) {
        // Previne o comportamento padrão do link (navegação brusca)
        e.preventDefault();

        // Obtém o elemento alvo baseado no atributo href do link clicado
        const target = document.querySelector(this.getAttribute('href'));

        // Verifica se o elemento alvo existe
        if (target) {
            // Realiza a rolagem suave até o elemento alvo
            target.scrollIntoView({
                behavior: 'smooth',  // Animação suave
                block: 'start'       // Alinha o topo do elemento com o topo da viewport
            });
        }
    });
});

// =============================================
// MARCAÇÃO DE PÁGINA ATIVA NA NAVEGAÇÃO
// =============================================

// Aguarda o DOM ser completamente carregado antes de executar
document.addEventListener('DOMContentLoaded', function () {
    // Obtém o nome do arquivo atual da URL
    // split('/').pop() pega a última parte do caminho (nome do arquivo)
    const currentPage = window.location.pathname.split('/').pop();

    // Seleciona TODOS os links dentro de elementos <nav>
    const navLinks = document.querySelectorAll('nav a');

    // Itera sobre cada link de navegação
    navLinks.forEach(link => {
        // Verifica se o href do link corresponde à página atual
        if (link.getAttribute('href') === currentPage) {
            // Se for a página atual, adiciona a classe 'active'
            link.classList.add('active');
        } else {
            // Remove a classe 'active' dos outros links
            link.classList.remove('active');
        }
    });

    // CASO ESPECIAL: Página inicial (root)
    // Se estiver na raiz do site (URL sem caminho) ou no index.html
    if (currentPage === '' || currentPage === 'index.html') {
        // Seleciona especificamente o link para index.html e marca como ativo
        document.querySelector('nav a[href="index.html"]').classList.add('active');
    }
});

// =============================================
// LAZY LOADING PARA IMAGENS
// =============================================

// Aguarda o DOM ser completamente carregado
document.addEventListener('DOMContentLoaded', function () {
    // Seleciona TODAS as imagens que possuem o atributo 'data-src'
    // (imagens que devem ser carregadas apenas quando visíveis)
    const images = document.querySelectorAll('img[data-src]');

    // Cria um Intersection Observer para detectar quando as imagens entram na viewport
    // Intersection Observer é uma API moderna que observa mudanças na interseção dos elementos
    const imageObserver = new IntersectionObserver((entries, observer) => {
        // Itera sobre todas as entradas (elementos observados) que sofreram mudanças
        entries.forEach(entry => {
            // Verifica se o elemento está visível na viewport (intersectando)
            if (entry.isIntersecting) {
                // Obtém a referência para a imagem que está visível
                const img = entry.target;

                // Substitui o src placeholder pelo src real (armazenado em data-src)
                img.src = img.dataset.src;

                // Remove o atributo data-src para evitar recarregamentos
                img.removeAttribute('data-src');

                // Para de observar a imagem (já foi carregada)
                imageObserver.unobserve(img);
            }
        });
    });

    // Inicia a observação para cada imagem com data-src
    images.forEach(img => imageObserver.observe(img));
});

// =============================================
// PRINT FUNCTIONALITY FOR SCRATCH CARDS
// =============================================

// Função para criar e exibir a visualização de impressão
function showPrintPreview() {
    // Verifica se estamos na página correta
    const isCartoesPage = window.location.pathname.includes('cartoes-scratch.html') || 
                         window.location.pathname.endsWith('cartoes-scratch.html');
    if (!isCartoesPage) {
        console.log('Função showPrintPreview chamada fora da página de cartões scratch');
        return;
    }
    
    // Cria overlay para preview de impressão
    const printOverlay = document.createElement('div');
    printOverlay.className = 'print-overlay';
    printOverlay.style.display = 'flex';
    
    // Cria container do preview
    const printPreview = document.createElement('div');
    printPreview.className = 'print-preview';
    
    // Cria botão de fechar
    const closeButton = document.createElement('button');
    closeButton.className = 'close-preview';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => {
        document.body.removeChild(printOverlay);
    };
    
    // Cria container de impressão
    const printContainer = document.createElement('div');
    printContainer.className = 'print-container';
    
    // Adiciona instruções de impressão
    const printInstructions = document.createElement('div');
    printInstructions.className = 'print-instructions';
    printInstructions.innerHTML = `
        <h2>Instruções para Impressão</h2>
        <ul>
            <li>Use papel A4 de 180-250g para melhor durabilidade</li>
            <li>Configure a impressão para "Retrato"</li>
            <li>Defina margens para "Mínimo" ou "Nenhuma"</li>
            <li>Imprima em qualidade normal ou alta</li>
            <li>Recorte seguindo as linhas pontilhadas</li>
        </ul>
    `;
    
    // Cria grid de cartões para impressão
    const printCards = document.createElement('div');
    printCards.className = 'print-cards';
    
    // Coleta todos os cartões da página (APENAS ATÉ A SEÇÃO DE NAVEGAÇÃO)
    const contentSections = document.querySelectorAll('.content-section');
    let allCards = [];
    
    // Itera pelas seções até encontrar a seção de navegação
    contentSections.forEach(section => {
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent : '';
        
        // Para quando encontrar a seção de navegação
        if (title === 'Navegação') {
            return;
        }
        
        // Coleta os cartões desta seção
        const sectionCards = section.querySelectorAll('.nav-card');
        sectionCards.forEach(card => {
            allCards.push(card);
        });
    });
    
    // Adiciona cada cartão ao preview de impressão
    allCards.forEach((card, index) => {
        const printCard = card.cloneNode(true);
        printCard.classList.add('print-card');
        
        // Preserva a classe de categoria para cores na impressão
        if (card.classList.contains('movimento')) printCard.classList.add('movimento');
        if (card.classList.contains('aparencia')) printCard.classList.add('aparencia');
        if (card.classList.contains('som')) printCard.classList.add('som');
        if (card.classList.contains('eventos')) printCard.classList.add('eventos');
        if (card.classList.contains('controle')) printCard.classList.add('controle');
        if (card.classList.contains('operadores')) printCard.classList.add('operadores');
        
        printCards.appendChild(printCard);
    });
    
    // Cria botões de ação
    const printActions = document.createElement('div');
    printActions.className = 'print-actions';
    
    const printBtn = document.createElement('button');
    printBtn.className = 'print-button';
    printBtn.innerHTML = '🖨️ Imprimir Cartões';
    printBtn.onclick = printScratchCards;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'secondary-button';
    closeBtn.innerHTML = 'Fechar';
    closeBtn.onclick = () => document.body.removeChild(printOverlay);
    
    printActions.appendChild(printBtn);
    printActions.appendChild(closeBtn);
    
    // Monta a estrutura
    printContainer.appendChild(printInstructions);
    printContainer.appendChild(printCards);
    printPreview.appendChild(closeButton);
    printPreview.appendChild(printContainer);
    printPreview.appendChild(printActions);
    printOverlay.appendChild(printPreview);
    
    // Adiciona ao documento
    document.body.appendChild(printOverlay);
}

// Função para imprimir os cartões
function printScratchCards() {
    // Verifica se estamos na página correta
    const isCartoesPage = window.location.pathname.includes('cartoes-scratch.html') || 
                         window.location.pathname.endsWith('cartoes-scratch.html');
    if (!isCartoesPage) {
        console.log('Função printScratchCards chamada fora da página de cartões scratch');
        return;
    }
    
    // Cria um iframe para impressão
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.left = '-9999px';
    printFrame.style.top = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    
    document.body.appendChild(printFrame);
    
    const printDocument = printFrame.contentWindow.document;
    
    // Escreve o conteúdo HTML para impressão
    printDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Cartões Scratch para Recortar</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: white;
                    color: black;
                }
                
                .print-container {
                    max-width: 100%;
                }
                
                .print-instructions {
                    background: #f8f9fa;
                    border: 1px solid #000;
                    padding: 15px;
                    margin-bottom: 20px;
                    page-break-after: avoid;
                }
                
                .print-instructions h2 {
                    color: black;
                    font-size: 16px;
                    margin-bottom: 10px;
                }
                
                .print-instructions ul {
                    margin: 0;
                    padding-left: 20px;
                }
                
                .print-instructions li {
                    font-size: 12px;
                    margin-bottom: 5px;
                    color: black;
                }
                
                .print-cards {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                    margin: 0;
                    padding: 0;
                }
                
                .print-card {
                    break-inside: avoid;
                    page-break-inside: avoid;
                    background: white !important;
                    border: 2px solid #000 !important;
                    border-radius: 8px !important;
                    padding: 15px !important;
                    margin: 0 !important;
                    box-shadow: none !important;
                    min-height: 120px !important;
                    display: flex !important;
                    flex-direction: column !important;
                    justify-content: center !important;
                }
                
                .print-card h3 {
                    font-size: 14px !important;
                    margin: 0 0 8px 0 !important;
                    color: black !important;
                }
                
                .print-card p {
                    font-size: 12px !important;
                    margin: 2px 0 !important;
                    color: black !important;
                }
                
                .print-card code {
                    background: #f5f5f5 !important;
                    color: black !important;
                    border: 1px solid #ddd !important;
                    font-size: 11px !important;
                    padding: 2px 4px !important;
                    border-radius: 3px !important;
                }
                
                /* Cores das bordas para categorias */
                .print-card.movimento {
                    border-left: 8px solid #4a6cd4 !important;
                }
                
                .print-card.aparencia {
                    border-left: 8px solid #8a55d7 !important;
                }
                
                .print-card.som {
                    border-left: 8px solid #bb42c3 !important;
                }
                
                .print-card.eventos {
                    border-left: 8px solid #ffbf00 !important;
                }
                
                .print-card.controle {
                    border-left: 8px solid #ff8c1a !important;
                }
                
                .print-card.operadores {
                    border-left: 8px solid #5cb712 !important;
                }
                
                @media print {
                    body {
                        padding: 10px;
                    }
                    
                    .print-cards {
                        grid-template-columns: repeat(3, 1fr);
                    }
                    
                    .print-card {
                        min-height: 110px !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-container">
                <div class="print-instructions">
                    <h2>Cartões Scratch para Recortar - UTFPR</h2>
                    <ul>
                        <li><strong>Papel:</strong> Use A4 de 180-250g</li>
                        <li><strong>Orientação:</strong> Retrato</li>
                        <li><strong>Margens:</strong> Mínimas ou Nenhuma</li>
                        <li><strong>Corte:</strong> Siga as linhas dos cartões</li>
                        <li><strong>Plastificação:</strong> Opcional para maior durabilidade</li>
                    </ul>
                </div>
                <div class="print-cards">
    `);
    
    // Coleta todos os cartões da página (APENAS ATÉ A SEÇÃO DE NAVEGAÇÃO)
    const contentSections = document.querySelectorAll('.content-section');
    let allCards = [];
    
    // Itera pelas seções até encontrar a seção de navegação
    contentSections.forEach(section => {
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent : '';
        
        // Para quando encontrar a seção de navegação
        if (title === 'Navegação') {
            return;
        }
        
        // Coleta os cartões desta seção
        const sectionCards = section.querySelectorAll('.nav-card');
        sectionCards.forEach(card => {
            allCards.push(card);
        });
    });
    
    // Adiciona cada cartão ao documento de impressão
    allCards.forEach((card, index) => {
        const title = card.querySelector('h3') ? card.querySelector('h3').textContent : 'Cartão ' + (index + 1);
        const firstParagraph = card.querySelector('p') ? card.querySelector('p').innerHTML : '';
        const secondParagraph = card.querySelectorAll('p')[1] ? card.querySelectorAll('p')[1].textContent : '';
        
        const category = 
            card.classList.contains('movimento') ? 'movimento' :
            card.classList.contains('aparencia') ? 'aparencia' :
            card.classList.contains('som') ? 'som' :
            card.classList.contains('eventos') ? 'eventos' :
            card.classList.contains('controle') ? 'controle' :
            card.classList.contains('operadores') ? 'operadores' : '';
        
        printDocument.write(`
            <div class="print-card ${category}">
                <h3>${title}</h3>
                ${firstParagraph ? `<p>${firstParagraph}</p>` : ''}
                ${secondParagraph ? `<p>${secondParagraph}</p>` : ''}
            </div>
        `);
    });
    
    // Finaliza o documento
    printDocument.write(`
                </div>
            </div>
        </body>
        </html>
    `);
    
    printDocument.close();
    
    // Aguarda o carregamento e imprime
    printFrame.onload = function() {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
        
        // Remove o iframe após a impressão
        setTimeout(() => {
            if (document.body.contains(printFrame)) {
                document.body.removeChild(printFrame);
            }
            const printOverlay = document.querySelector('.print-overlay');
            if (printOverlay) {
                document.body.removeChild(printOverlay);
            }
        }, 500);
    };
}

// =============================================
// PRINT FUNCTIONALITY FOR INDEX PAGE
// =============================================

// Função para criar e exibir a visualização de impressão da PÁGINA INICIAL
function showPrintPreviewIndex() {
    // Verifica se estamos na página correta
    const isIndexPage = window.location.pathname.includes('index.html') || 
                       window.location.pathname === '/' || 
                       window.location.pathname.endsWith('/');
    if (!isIndexPage) {
        console.log('Função showPrintPreviewIndex chamada fora da página inicial');
        return;
    }
    
    // Cria overlay para preview de impressão
    const printOverlay = document.createElement('div');
    printOverlay.className = 'print-overlay';
    printOverlay.style.display = 'flex';
    
    // Cria container do preview
    const printPreview = document.createElement('div');
    printPreview.className = 'print-preview';
    printPreview.style.maxWidth = '90%';
    printPreview.style.maxHeight = '90%';
    
    // Cria botão de fechar
    const closeButton = document.createElement('button');
    closeButton.className = 'close-preview';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => {
        document.body.removeChild(printOverlay);
    };
    
    // Cria container de impressão
    const printContainer = document.createElement('div');
    printContainer.className = 'print-container';
    
    // Adiciona instruções de impressão
    const printInstructions = document.createElement('div');
    printInstructions.className = 'print-instructions';
    printInstructions.innerHTML = `
        <h2>Instruções para Impressão - Cartilha Pedagógica</h2>
        <ul>
            <li>Use papel A4 padrão</li>
            <li>Configure a impressão para "Retrato"</li>
            <li>Defina margens para "Padrão" ou "Mínimo"</li>
            <li>Imprima em qualidade normal</li>
            <li>Verifique a visualização antes de imprimir</li>
            <li>Recomendado: imprimir por seções conforme necessidade</li>
        </ul>
    `;
    
    // Cria container para o conteúdo da página inicial
    const printIndexContent = document.createElement('div');
    printIndexContent.className = 'print-index-content';
    
    // Coleta todas as seções de conteúdo da página inicial (APENAS content-sections)
    const contentSections = document.querySelectorAll('.content-section');
    
    // Adiciona cada seção ao preview de impressão
    contentSections.forEach((section, index) => {
        const printSection = section.cloneNode(true);
        printSection.classList.add('print-section');
        printIndexContent.appendChild(printSection);
    });
    
    // Cria botões de ação
    const printActions = document.createElement('div');
    printActions.className = 'print-actions';
    
    const printBtn = document.createElement('button');
    printBtn.className = 'print-button';
    printBtn.innerHTML = '🖨️ Imprimir Cartilha';
    printBtn.onclick = () => printIndexContentFunction();
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'secondary-button';
    closeBtn.innerHTML = 'Fechar';
    closeBtn.onclick = () => document.body.removeChild(printOverlay);
    
    printActions.appendChild(printBtn);
    printActions.appendChild(closeBtn);
    
    // Monta a estrutura
    printContainer.appendChild(printInstructions);
    printContainer.appendChild(printIndexContent);
    printPreview.appendChild(closeButton);
    printPreview.appendChild(printContainer);
    printPreview.appendChild(printActions);
    printOverlay.appendChild(printPreview);
    
    // Adiciona ao documento
    document.body.appendChild(printOverlay);
}

// Função para imprimir o conteúdo da página inicial
function printIndexContentFunction() {
    // Verifica se estamos na página correta
    const isIndexPage = window.location.pathname.includes('index.html') || 
                       window.location.pathname === '/' || 
                       window.location.pathname.endsWith('/');
    if (!isIndexPage) {
        console.log('Função printIndexContentFunction chamada fora da página inicial');
        return;
    }
    
    // Cria um iframe para impressão
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.left = '-9999px';
    printFrame.style.top = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    
    document.body.appendChild(printFrame);
    
    const printDocument = printFrame.contentWindow.document;
    
    // Escreve o conteúdo HTML para impressão
    printDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Cartilha Pedagógica: Scratch na Educação Básica - UTFPR</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: white;
                    color: black;
                    font-size: 12pt;
                    line-height: 1.4;
                }
                
                .print-container {
                    max-width: 100%;
                }
                
                .print-instructions {
                    background: #f8f9fa;
                    border: 1px solid #000;
                    padding: 15px;
                    margin-bottom: 20px;
                    page-break-after: avoid;
                }
                
                .print-instructions h2 {
                    color: black;
                    font-size: 16px;
                    margin-bottom: 10px;
                }
                
                .print-instructions ul {
                    margin: 0;
                    padding-left: 20px;
                }
                
                .print-instructions li {
                    font-size: 12px;
                    margin-bottom: 5px;
                    color: black;
                }
                
                .print-section {
                    break-inside: avoid;
                    page-break-inside: avoid;
                    background: white !important;
                    border: 2px solid #000 !important;
                    border-radius: 8px !important;
                    padding: 20px !important;
                    margin: 20px 0 !important;
                    box-shadow: none !important;
                }
                
                .print-section h2 {
                    color: #000 !important;
                    font-size: 18px !important;
                    margin-bottom: 15px !important;
                    border-bottom: 2px solid #000 !important;
                    padding-bottom: 8px !important;
                    page-break-after: avoid;
                }
                
                .print-section h3 {
                    color: #333 !important;
                    font-size: 16px !important;
                    margin: 20px 0 10px 0 !important;
                    border-left: 3px solid #000 !important;
                    padding-left: 10px !important;
                    page-break-after: avoid;
                }
                
                .print-section h4 {
                    color: #555 !important;
                    font-size: 14px !important;
                    margin: 15px 0 8px 0 !important;
                }
                
                .print-section h5 {
                    color: #666 !important;
                    font-size: 13px !important;
                    margin: 12px 0 6px 0 !important;
                }
                
                .print-section p {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 10px !important;
                    line-height: 1.5 !important;
                }
                
                .print-section ul, .print-section ol {
                    color: black !important;
                    font-size: 12px !important;
                    margin: 10px 0 !important;
                    padding-left: 25px !important;
                }
                
                .print-section li {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 6px !important;
                    line-height: 1.4 !important;
                }
                
                .sumario {
                    background: #f8f9fa !important;
                    border: 1px solid #ccc !important;
                    padding: 20px !important;
                    border-radius: 6px !important;
                }
                
                .sumario li {
                    margin-bottom: 8px !important;
                }
                
                .sumario a {
                    color: #000 !important;
                    text-decoration: none !important;
                }
                
                .projeto-ano {
                    background: #f8f9fa !important;
                    border: 1px solid #ccc !important;
                    padding: 15px !important;
                    margin: 15px 0 !important;
                    border-radius: 6px !important;
                }
                
                .image-container {
                    text-align: center;
                    margin: 15px 0;
                }
                
                .content-image {
                    max-width: 100%;
                    height: auto;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                }
                
                code {
                    background: #f5f5f5 !important;
                    color: black !important;
                    border: 1px solid #ddd !important;
                    font-size: 11px !important;
                    padding: 2px 4px !important;
                    border-radius: 3px !important;
                    font-family: 'Courier New', monospace !important;
                }
                
                @media print {
                    body {
                        padding: 10px;
                    }
                    
                    .print-section {
                        margin: 15px 0 !important;
                        padding: 15px !important;
                    }
                    
                    .print-instructions {
                        margin-bottom: 15px !important;
                    }
                    
                    .print-section h2 {
                        font-size: 16px !important;
                    }
                    
                    .print-section h3 {
                        font-size: 14px !important;
                    }
                    
                    /* Quebra de página antes de cada seção principal (exceto a primeira) */
                    .print-section:nth-child(n+2) {
                        page-break-before: always;
                    }
                    
                    /* Evita que elementos específicos quebrem no meio */
                    .projeto-ano, .sumario {
                        page-break-inside: avoid;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-container">
                <div class="print-instructions">
                    <h2>Cartilha Pedagógica: Scratch na Educação Básica - UTFPR</h2>
                    <ul>
                        <li><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</li>
                        <li><strong>Página:</strong> Página Inicial - Cartilha Completa</li>
                        <li><strong>Material:</strong> Projeto Scratch na Educação Básica</li>
                        <li><strong>Autores:</strong> Gisele Nunes, Rodrigo Barbosa</li>
                        <li><strong>Instruções:</strong> Cada seção principal inicia em uma nova página</li>
                    </ul>
                </div>
    `);
    
    // Adiciona cada seção de conteúdo ao documento de impressão
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach((section, index) => {
        const sectionContent = section.cloneNode(true);
        const contentHTML = sectionContent.innerHTML;
        
        printDocument.write(`
            <div class="print-section">
                ${contentHTML}
            </div>
        `);
    });
    
    // Finaliza o documento
    printDocument.write(`
            </div>
        </body>
        </html>
    `);
    
    printDocument.close();
    
    // Aguarda o carregamento e imprime
    printFrame.onload = function() {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
        
        // Remove o iframe após a impressão
        setTimeout(() => {
            if (document.body.contains(printFrame)) {
                document.body.removeChild(printFrame);
            }
            const printOverlay = document.querySelector('.print-overlay');
            if (printOverlay) {
                document.body.removeChild(printOverlay);
            }
        }, 500);
    };
}

// =============================================
// PRINT FUNCTIONALITY FOR MATERIAIS COMPLEMENTARES
// =============================================

// Função para criar e exibir a visualização de impressão dos MATERIAIS COMPLEMENTARES
function showPrintPreviewMateriaisComplementares() {
    // Verifica se estamos na página correta
    const isMateriaisPage = window.location.pathname.includes('materiais-complementares.html') || 
                           window.location.pathname.endsWith('materiais-complementares.html');
    if (!isMateriaisPage) {
        console.log('Função showPrintPreviewMateriaisComplementares chamada fora da página materiais complementares');
        return;
    }
    
    // Cria overlay para preview de impressão
    const printOverlay = document.createElement('div');
    printOverlay.className = 'print-overlay';
    printOverlay.style.display = 'flex';
    
    // Cria container do preview
    const printPreview = document.createElement('div');
    printPreview.className = 'print-preview';
    printPreview.style.maxWidth = '90%';
    printPreview.style.maxHeight = '90%';
    
    // Cria botão de fechar
    const closeButton = document.createElement('button');
    closeButton.className = 'close-preview';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => {
        document.body.removeChild(printOverlay);
    };
    
    // Cria container de impressão
    const printContainer = document.createElement('div');
    printContainer.className = 'print-container';
    
    // Adiciona instruções de impressão
    const printInstructions = document.createElement('div');
    printInstructions.className = 'print-instructions';
    printInstructions.innerHTML = `
        <h2>Instruções para Impressão - Materiais Complementares</h2>
        <ul>
            <li>Use papel A4 padrão</li>
            <li>Configure a impressão para "Retrato"</li>
            <li>Defina margens para "Padrão" ou "Mínimo"</li>
            <li>Imprima em qualidade normal</li>
            <li>Verifique a visualização antes de imprimir</li>
            <li>Recomendado: imprimir seções específicas conforme necessidade</li>
        </ul>
    `;
    
    // Cria container para o conteúdo dos materiais complementares
    const printMateriais = document.createElement('div');
    printMateriais.className = 'print-materiais';
    
    // Coleta todas as seções de conteúdo da página materiais complementares
    const contentSections = document.querySelectorAll('.content-section');
    
    // Adiciona cada seção ao preview de impressão (REMOVENDO NAVEGAÇÃO)
    contentSections.forEach((section, index) => {
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent : '';
        
        // Remove a seção de navegação e tudo que vem após
        if (title === 'Navegação') {
            return;
        }
        
        const printSection = section.cloneNode(true);
        printSection.classList.add('print-section');
        
        // Remove elementos de navegação dentro das seções
        const navCards = printSection.querySelector('.card-grid');
        if (navCards) {
            navCards.remove();
        }
        
        printMateriais.appendChild(printSection);
    });
    
    // Cria botões de ação
    const printActions = document.createElement('div');
    printActions.className = 'print-actions';
    
    const printBtn = document.createElement('button');
    printBtn.className = 'print-button';
    printBtn.innerHTML = '🖨️ Imprimir Materiais Complementares';
    printBtn.onclick = () => printMateriaisComplementaresContent();
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'secondary-button';
    closeBtn.innerHTML = 'Fechar';
    closeBtn.onclick = () => document.body.removeChild(printOverlay);
    
    printActions.appendChild(printBtn);
    printActions.appendChild(closeBtn);
    
    // Monta a estrutura
    printContainer.appendChild(printInstructions);
    printContainer.appendChild(printMateriais);
    printPreview.appendChild(closeButton);
    printPreview.appendChild(printContainer);
    printPreview.appendChild(printActions);
    printOverlay.appendChild(printPreview);
    
    // Adiciona ao documento
    document.body.appendChild(printOverlay);
}

// Função para imprimir o conteúdo dos materiais complementares
function printMateriaisComplementaresContent() {
    // Verifica se estamos na página correta
    const isMateriaisPage = window.location.pathname.includes('materiais-complementares.html') || 
                           window.location.pathname.endsWith('materiais-complementares.html');
    if (!isMateriaisPage) {
        console.log('Função printMateriaisComplementaresContent chamada fora da página materiais complementares');
        return;
    }
    
    // Cria um iframe para impressão
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.left = '-9999px';
    printFrame.style.top = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    
    document.body.appendChild(printFrame);
    
    const printDocument = printFrame.contentWindow.document;
    
    // Escreve o conteúdo HTML para impressão
    printDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Materiais Complementares Scratch - UTFPR</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: white;
                    color: black;
                    font-size: 12pt;
                    line-height: 1.4;
                }
                
                .print-container {
                    max-width: 100%;
                }
                
                .print-instructions {
                    background: #f8f9fa;
                    border: 1px solid #000;
                    padding: 15px;
                    margin-bottom: 20px;
                    page-break-after: avoid;
                }
                
                .print-instructions h2 {
                    color: black;
                    font-size: 16px;
                    margin-bottom: 10px;
                }
                
                .print-instructions ul {
                    margin: 0;
                    padding-left: 20px;
                }
                
                .print-instructions li {
                    font-size: 12px;
                    margin-bottom: 5px;
                    color: black;
                }
                
                .print-section {
                    break-inside: avoid;
                    page-break-inside: avoid;
                    background: white !important;
                    border: 2px solid #000 !important;
                    border-radius: 8px !important;
                    padding: 20px !important;
                    margin: 20px 0 !important;
                    box-shadow: none !important;
                }
                
                .print-section h2 {
                    color: #000 !important;
                    font-size: 18px !important;
                    margin-bottom: 15px !important;
                    border-bottom: 2px solid #000 !important;
                    padding-bottom: 8px !important;
                    page-break-after: avoid;
                }
                
                .print-section h3 {
                    color: #333 !important;
                    font-size: 16px !important;
                    margin: 20px 0 10px 0 !important;
                    border-left: 3px solid #000 !important;
                    padding-left: 10px !important;
                    page-break-after: avoid;
                }
                
                .print-section h4 {
                    color: #555 !important;
                    font-size: 14px !important;
                    margin: 15px 0 8px 0 !important;
                }
                
                .print-section h5 {
                    color: #666 !important;
                    font-size: 13px !important;
                    margin: 12px 0 6px 0 !important;
                }
                
                .print-section p {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 10px !important;
                    line-height: 1.5 !important;
                }
                
                .print-section ul, .print-section ol {
                    color: black !important;
                    font-size: 12px !important;
                    margin: 10px 0 !important;
                    padding-left: 25px !important;
                }
                
                .print-section li {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 6px !important;
                    line-height: 1.4 !important;
                }
                
                .glossario-termo, .referencia-item, .problema-solucao, .modelo-projeto {
                    background: #f8f9fa !important;
                    border: 1px solid #ccc !important;
                    padding: 15px !important;
                    margin: 15px 0 !important;
                    border-radius: 6px !important;
                }
                
                .ficha-rapida {
                    background: #f8f9fa !important;
                    border: 2px solid #666 !important;
                    padding: 15px !important;
                    margin: 15px 0 !important;
                    border-radius: 6px !important;
                }
                
                .ficha-header {
                    background: #e9ecef !important;
                    border-bottom: 2px solid #666 !important;
                    padding: 10px !important;
                    margin-bottom: 15px !important;
                    border-radius: 4px !important;
                }
                
                .ficha-tempo {
                    background: #ffd200 !important;
                    color: black !important;
                    padding: 5px 10px !important;
                    border-radius: 15px !important;
                    font-size: 11px !important;
                    font-weight: bold !important;
                    display: inline-block !important;
                    margin-right: 10px !important;
                }
                
                .cartaz-box {
                    background: white !important;
                    border: 2px solid #000 !important;
                    margin: 15px 0 !important;
                    border-radius: 6px !important;
                }
                
                .cartaz-header {
                    background: #ffd200 !important;
                    color: black !important;
                    padding: 12px !important;
                    font-size: 14px !important;
                    font-weight: bold !important;
                    border-bottom: 2px solid #000 !important;
                }
                
                .cartaz-content {
                    padding: 15px !important;
                }
                
                .checklist-professor {
                    background: #f8f9fa !important;
                    border: 1px solid #ccc !important;
                    padding: 15px !important;
                    margin: 15px 0 !important;
                    border-radius: 6px !important;
                }
                
                .checklist-item {
                    margin: 8px 0 !important;
                    display: flex !important;
                    align-items: center !important;
                }
                
                .checklist-item input[type="checkbox"] {
                    margin-right: 10px !important;
                }
                
                .rubrica-avaliacao {
                    display: grid !important;
                    grid-template-columns: 1fr 1fr !important;
                    gap: 20px !important;
                    margin: 20px 0 !important;
                }
                
                .scratch-code {
                    background: #f5f5f5 !important;
                    color: black !important;
                    border: 1px solid #ccc !important;
                    border-left: 4px solid #000 !important;
                    padding: 12px !important;
                    margin: 10px 0 !important;
                    border-radius: 6px !important;
                    font-family: 'Courier New', monospace !important;
                    font-size: 11px !important;
                    white-space: pre-wrap !important;
                    line-height: 1.3 !important;
                }
                
                code {
                    background: #f5f5f5 !important;
                    color: black !important;
                    border: 1px solid #ddd !important;
                    font-size: 11px !important;
                    padding: 2px 4px !important;
                    border-radius: 3px !important;
                    font-family: 'Courier New', monospace !important;
                }
                
                @media print {
                    body {
                        padding: 10px;
                    }
                    
                    .print-section {
                        margin: 15px 0 !important;
                        padding: 15px !important;
                    }
                    
                    .print-instructions {
                        margin-bottom: 15px !important;
                    }
                    
                    .print-section h2 {
                        font-size: 16px !important;
                    }
                    
                    .print-section h3 {
                        font-size: 14px !important;
                    }
                    
                    /* Quebra de página antes de cada seção principal (exceto a primeira) */
                    .print-section:nth-child(n+2) {
                        page-break-before: always;
                    }
                    
                    /* Evita que elementos específicos quebrem no meio */
                    .ficha-rapida, .cartaz-box, .rubrica-avaliacao {
                        page-break-inside: avoid;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-container">
                <div class="print-instructions">
                    <h2>Materiais Complementares Scratch - UTFPR</h2>
                    <ul>
                        <li><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</li>
                        <li><strong>Página:</strong> Materiais Complementares</li>
                        <li><strong>Material:</strong> Projeto Scratch na Educação Básica</li>
                        <li><strong>Instruções:</strong> Cada seção principal inicia em uma nova página</li>
                    </ul>
                </div>
    `);
    
    // Adiciona cada seção dos materiais complementares ao documento de impressão (REMOVENDO NAVEGAÇÃO)
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach((section, index) => {
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent : `Seção ${index + 1}`;
        
        // Remove a seção de navegação e tudo que vem após
        if (title === 'Navegação') {
            return;
        }
        
        const sectionContent = section.cloneNode(true);
        
        // Remove elementos de navegação
        const navCards = sectionContent.querySelector('.card-grid');
        if (navCards) {
            navCards.remove();
        }
        
        const contentHTML = sectionContent.innerHTML;
        
        printDocument.write(`
            <div class="print-section">
                ${contentHTML}
            </div>
        `);
    });
    
    // Finaliza o documento
    printDocument.write(`
            </div>
        </body>
        </html>
    `);
    
    printDocument.close();
    
    // Aguarda o carregamento e imprime
    printFrame.onload = function() {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
        
        // Remove o iframe após a impressão
        setTimeout(() => {
            if (document.body.contains(printFrame)) {
                document.body.removeChild(printFrame);
            }
            const printOverlay = document.querySelector('.print-overlay');
            if (printOverlay) {
                document.body.removeChild(printOverlay);
            }
        }, 500);
    };
}

// =============================================
// PRINT FUNCTIONALITY FOR PRIMEIROS PASSOS
// =============================================

// Função para criar e exibir a visualização de impressão dos PRIMEIROS PASSOS
function showPrintPreviewPrimeirosPassos() {
    // Verifica se estamos na página correta
    const isPrimeirosPassosPage = window.location.pathname.includes('primeiros-passos.html') || 
                                 window.location.pathname.endsWith('primeiros-passos.html');
    if (!isPrimeirosPassosPage) {
        console.log('Função showPrintPreviewPrimeirosPassos chamada fora da página primeiros passos');
        return;
    }
    
    // Cria overlay para preview de impressão
    const printOverlay = document.createElement('div');
    printOverlay.className = 'print-overlay';
    printOverlay.style.display = 'flex';
    
    // Cria container do preview
    const printPreview = document.createElement('div');
    printPreview.className = 'print-preview';
    printPreview.style.maxWidth = '90%';
    printPreview.style.maxHeight = '90%';
    
    // Cria botão de fechar
    const closeButton = document.createElement('button');
    closeButton.className = 'close-preview';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => {
        document.body.removeChild(printOverlay);
    };
    
    // Cria container de impressão
    const printContainer = document.createElement('div');
    printContainer.className = 'print-container';
    
    // Adiciona instruções de impressão
    const printInstructions = document.createElement('div');
    printInstructions.className = 'print-instructions';
    printInstructions.innerHTML = `
        <h2>Instruções para Impressão - Primeiros Passos no Scratch</h2>
        <ul>
            <li>Use papel A4 padrão</li>
            <li>Configure a impressão para "Retrato"</li>
            <li>Defina margens para "Padrão" ou "Mínimo"</li>
            <li>Imprima em qualidade normal</li>
            <li>Verifique a visualização antes de imprimir</li>
            <li>Recomendado: imprimir para consulta e estudo</li>
        </ul>
    `;
    
    // Cria container para o conteúdo dos primeiros passos
    const printPrimeirosPassos = document.createElement('div');
    printPrimeirosPassos.className = 'print-primeiros-passos';
    
    // Coleta todas as seções de conteúdo da página primeiros passos
    const contentSections = document.querySelectorAll('.content-section');
    
    // Adiciona cada seção ao preview de impressão (REMOVENDO NAVEGAÇÃO)
    contentSections.forEach((section, index) => {
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent : '';
        
        // Remove a seção de navegação e tudo que vem após
        if (title === 'Navegação') {
            return;
        }
        
        const printSection = section.cloneNode(true);
        printSection.classList.add('print-section');
        
        // Remove elementos de navegação dentro das seções
        const navCards = printSection.querySelector('.card-grid');
        if (navCards) {
            navCards.remove();
        }
        
        printPrimeirosPassos.appendChild(printSection);
    });
    
    // Cria botões de ação
    const printActions = document.createElement('div');
    printActions.className = 'print-actions';
    
    const printBtn = document.createElement('button');
    printBtn.className = 'print-button';
    printBtn.innerHTML = '🖨️ Imprimir Primeiros Passos';
    printBtn.onclick = () => printPrimeirosPassosContent();
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'secondary-button';
    closeBtn.innerHTML = 'Fechar';
    closeBtn.onclick = () => document.body.removeChild(printOverlay);
    
    printActions.appendChild(printBtn);
    printActions.appendChild(closeBtn);
    
    // Monta a estrutura
    printContainer.appendChild(printInstructions);
    printContainer.appendChild(printPrimeirosPassos);
    printPreview.appendChild(closeButton);
    printPreview.appendChild(printContainer);
    printPreview.appendChild(printActions);
    printOverlay.appendChild(printPreview);
    
    // Adiciona ao documento
    document.body.appendChild(printOverlay);
}

// Função para imprimir o conteúdo dos primeiros passos
function printPrimeirosPassosContent() {
    // Verifica se estamos na página correta
    const isPrimeirosPassosPage = window.location.pathname.includes('primeiros-passos.html') || 
                                 window.location.pathname.endsWith('primeiros-passos.html');
    if (!isPrimeirosPassosPage) {
        console.log('Função printPrimeirosPassosContent chamada fora da página primeiros passos');
        return;
    }
    
    // Cria um iframe para impressão
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.left = '-9999px';
    printFrame.style.top = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    
    document.body.appendChild(printFrame);
    
    const printDocument = printFrame.contentWindow.document;
    
    // Escreve o conteúdo HTML para impressão
    printDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Primeiros Passos no Scratch - UTFPR</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: white;
                    color: black;
                    font-size: 12pt;
                    line-height: 1.4;
                }
                
                .print-container {
                    max-width: 100%;
                }
                
                .print-instructions {
                    background: #f8f9fa;
                    border: 1px solid #000;
                    padding: 15px;
                    margin-bottom: 20px;
                    page-break-after: avoid;
                }
                
                .print-instructions h2 {
                    color: black;
                    font-size: 16px;
                    margin-bottom: 10px;
                }
                
                .print-instructions ul {
                    margin: 0;
                    padding-left: 20px;
                }
                
                .print-instructions li {
                    font-size: 12px;
                    margin-bottom: 5px;
                    color: black;
                }
                
                .print-section {
                    break-inside: avoid;
                    page-break-inside: avoid;
                    background: white !important;
                    border: 2px solid #000 !important;
                    border-radius: 8px !important;
                    padding: 20px !important;
                    margin: 20px 0 !important;
                    box-shadow: none !important;
                }
                
                .print-section h2 {
                    color: #000 !important;
                    font-size: 18px !important;
                    margin-bottom: 15px !important;
                    border-bottom: 2px solid #000 !important;
                    padding-bottom: 8px !important;
                    page-break-after: avoid;
                }
                
                .print-section h3 {
                    color: #333 !important;
                    font-size: 16px !important;
                    margin: 20px 0 10px 0 !important;
                    border-left: 3px solid #000 !important;
                    padding-left: 10px !important;
                    page-break-after: avoid;
                }
                
                .print-section h4 {
                    color: #555 !important;
                    font-size: 14px !important;
                    margin: 15px 0 8px 0 !important;
                }
                
                .print-section h5 {
                    color: #666 !important;
                    font-size: 13px !important;
                    margin: 12px 0 6px 0 !important;
                }
                
                .print-section p {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 10px !important;
                    line-height: 1.5 !important;
                }
                
                .print-section ul, .print-section ol {
                    color: black !important;
                    font-size: 12px !important;
                    margin: 10px 0 !important;
                    padding-left: 25px !important;
                }
                
                .print-section li {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 6px !important;
                    line-height: 1.4 !important;
                }
                
                .scratch-interface {
                    display: grid;
                    grid-template-areas:
                        "menu menu menu"
                        "palco blocos scripts"
                        "sprites blocos scripts";
                    grid-template-columns: 1fr 1fr 2fr;
                    gap: 12px;
                    background: #f8f9fa !important;
                    border: 2px solid #ccc !important;
                    border-radius: 10px !important;
                    padding: 15px !important;
                    margin: 25px auto !important;
                    max-width: 100% !important;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1) !important;
                }
                
                .interface-area {
                    background: white !important;
                    border: 1px solid #ccc !important;
                    border-radius: 6px !important;
                    padding: 10px !important;
                    box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.05) !important;
                    text-align: center !important;
                    font-size: 0.95rem !important;
                    color: black !important;
                }
                
                .menu-area {
                    grid-area: menu !important;
                    background: #ffd200 !important;
                    font-weight: bold !important;
                    border-radius: 6px !important;
                    text-align: left !important;
                    padding: 10px 15px !important;
                }
                
                .palco-area { grid-area: palco !important; }
                .blocos-area { grid-area: blocos !important; }
                .scripts-area { grid-area: scripts !important; }
                .sprites-area { grid-area: sprites !important; }
                
                .area-label {
                    font-weight: bold !important;
                    color: #000 !important;
                    border-bottom: 2px solid #ccc !important;
                    padding-bottom: 4px !important;
                    margin-bottom: 8px !important;
                }
                
                .area-content {
                    font-family: 'Courier New', monospace !important;
                    background: #f8f9fa !important;
                    border-radius: 6px !important;
                    padding: 8px !important;
                    border: 1px dashed #666 !important;
                }
                
                table {
                    width: 100% !important;
                    border-collapse: collapse !important;
                    margin: 15px 0 !important;
                    background: white !important;
                }
                
                th {
                    background: #f8f9fa !important;
                    color: black !important;
                    padding: 8px !important;
                    border: 1px solid #000 !important;
                    text-align: left !important;
                    font-weight: bold !important;
                }
                
                td {
                    padding: 8px !important;
                    border: 1px solid #000 !important;
                }
                
                tr:nth-child(even) {
                    background: #f8f9fa !important;
                }
                
                .scratch-code-block {
                    background: #f5f5f5 !important;
                    color: black !important;
                    border: 1px solid #ccc !important;
                    border-left: 4px solid #000 !important;
                    padding: 15px !important;
                    margin: 15px 0 !important;
                    border-radius: 6px !important;
                    font-family: 'Courier New', monospace !important;
                    white-space: pre-wrap !important;
                    line-height: 1.4 !important;
                }
                
                code {
                    background: #f5f5f5 !important;
                    color: black !important;
                    border: 1px solid #ddd !important;
                    font-size: 11px !important;
                    padding: 2px 4px !important;
                    border-radius: 3px !important;
                    font-family: 'Courier New', monospace !important;
                }
                
                @media print {
                    body {
                        padding: 10px;
                    }
                    
                    .print-section {
                        margin: 15px 0 !important;
                        padding: 15px !important;
                    }
                    
                    .print-instructions {
                        margin-bottom: 15px !important;
                    }
                    
                    .print-section h2 {
                        font-size: 16px !important;
                    }
                    
                    .print-section h3 {
                        font-size: 14px !important;
                    }
                    
                    /* Quebra de página antes de cada seção principal (exceto a primeira) */
                    .print-section:nth-child(n+2) {
                        page-break-before: always;
                    }
                    
                    .scratch-interface {
                        page-break-inside: avoid;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-container">
                <div class="print-instructions">
                    <h2>Primeiros Passos no Scratch - UTFPR</h2>
                    <ul>
                        <li><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</li>
                        <li><strong>Página:</strong> Primeiros Passos no Scratch</li>
                        <li><strong>Material:</strong> Projeto Scratch na Educação Básica</li>
                        <li><strong>Instruções:</strong> Cada seção principal inicia em uma nova página</li>
                    </ul>
                </div>
    `);
    
    // Adiciona cada seção dos primeiros passos ao documento de impressão (REMOVENDO NAVEGAÇÃO)
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach((section, index) => {
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent : `Seção ${index + 1}`;
        
        // Remove a seção de navegação e tudo que vem após
        if (title === 'Navegação') {
            return;
        }
        
        const sectionContent = section.cloneNode(true);
        
        // Remove elementos de navegação
        const navCards = sectionContent.querySelector('.card-grid');
        if (navCards) {
            navCards.remove();
        }
        
        const contentHTML = sectionContent.innerHTML;
        
        printDocument.write(`
            <div class="print-section">
                ${contentHTML}
            </div>
        `);
    });
    
    // Finaliza o documento
    printDocument.write(`
            </div>
        </body>
        </html>
    `);
    
    printDocument.close();
    
    // Aguarda o carregamento e imprime
    printFrame.onload = function() {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
        
        // Remove o iframe após a impressão
        setTimeout(() => {
            if (document.body.contains(printFrame)) {
                document.body.removeChild(printFrame);
            }
            const printOverlay = document.querySelector('.print-overlay');
            if (printOverlay) {
                document.body.removeChild(printOverlay);
            }
        }, 500);
    };
}

// =============================================
// PRINT FUNCTIONALITY FOR MUNDO DIGITAL
// =============================================

// Função para criar e exibir a visualização de impressão do MUNDO DIGITAL
function showPrintPreviewMundoDigital() {
    // Verifica se estamos na página correta
    const isMundoDigitalPage = window.location.pathname.includes('mundo-digital.html') || 
                              window.location.pathname.endsWith('mundo-digital.html');
    if (!isMundoDigitalPage) {
        console.log('Função showPrintPreviewMundoDigital chamada fora da página mundo digital');
        return;
    }
    
    // Cria overlay para preview de impressão
    const printOverlay = document.createElement('div');
    printOverlay.className = 'print-overlay';
    printOverlay.style.display = 'flex';
    
    // Cria container do preview
    const printPreview = document.createElement('div');
    printPreview.className = 'print-preview';
    printPreview.style.maxWidth = '90%';
    printPreview.style.maxHeight = '90%';
    
    // Cria botão de fechar
    const closeButton = document.createElement('button');
    closeButton.className = 'close-preview';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => {
        document.body.removeChild(printOverlay);
    };
    
    // Cria container de impressão
    const printContainer = document.createElement('div');
    printContainer.className = 'print-container';
    
    // Adiciona instruções de impressão
    const printInstructions = document.createElement('div');
    printInstructions.className = 'print-instructions';
    printInstructions.innerHTML = `
        <h2>Instruções para Impressão - Mundo Digital</h2>
        <ul>
            <li>Use papel A4 padrão</li>
            <li>Configure a impressão para "Retrato"</li>
            <li>Defina margens para "Padrão" ou "Mínimo"</li>
            <li>Imprima em qualidade normal</li>
            <li>Verifique a visualização antes de imprimir</li>
            <li>Recomendado: imprimir para consulta e estudo</li>
        </ul>
    `;
    
    // Cria container para o conteúdo do mundo digital
    const printMundoDigital = document.createElement('div');
    printMundoDigital.className = 'print-mundo-digital';
    
    // Coleta todas as seções de conteúdo da página mundo digital
    const contentSections = document.querySelectorAll('.content-section');
    
    // Adiciona cada seção ao preview de impressão (REMOVENDO NAVEGAÇÃO)
    contentSections.forEach((section, index) => {
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent.trim() : '';
        
        // Remove a seção de navegação e tudo que vem após - MELHORIA NA DETECÇÃO
        if (title === 'Navegação' || title.includes('Navegação')) {
            return;
        }
        
        const printSection = section.cloneNode(true);
        printSection.classList.add('print-section');
        
        // Remove elementos de navegação dentro das seções
        const navCards = printSection.querySelector('.card-grid');
        if (navCards) {
            navCards.remove();
        }
        
        printMundoDigital.appendChild(printSection);
    });
    
    // Cria botões de ação
    const printActions = document.createElement('div');
    printActions.className = 'print-actions';
    
    const printBtn = document.createElement('button');
    printBtn.className = 'print-button';
    printBtn.innerHTML = '🖨️ Imprimir Conteúdo Mundo Digital';
    printBtn.onclick = () => printMundoDigitalContent();
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'secondary-button';
    closeBtn.innerHTML = 'Fechar';
    closeBtn.onclick = () => document.body.removeChild(printOverlay);
    
    printActions.appendChild(printBtn);
    printActions.appendChild(closeBtn);
    
    // Monta a estrutura
    printContainer.appendChild(printInstructions);
    printContainer.appendChild(printMundoDigital);
    printPreview.appendChild(closeButton);
    printPreview.appendChild(printContainer);
    printPreview.appendChild(printActions);
    printOverlay.appendChild(printPreview);
    
    // Adiciona ao documento
    document.body.appendChild(printOverlay);
}

// Função para imprimir o conteúdo do mundo digital
function printMundoDigitalContent() {
    // Verifica se estamos na página correta
    const isMundoDigitalPage = window.location.pathname.includes('mundo-digital.html') || 
                              window.location.pathname.endsWith('mundo-digital.html');
    if (!isMundoDigitalPage) {
        console.log('Função printMundoDigitalContent chamada fora da página mundo digital');
        return;
    }
    
    // Cria um iframe para impressão
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.left = '-9999px';
    printFrame.style.top = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    
    document.body.appendChild(printFrame);
    
    const printDocument = printFrame.contentWindow.document;
    
    // Escreve o conteúdo HTML para impressão
    printDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Mundo Digital: Conceitos Fundamentais - UTFPR</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: white;
                    color: black;
                    font-size: 12pt;
                    line-height: 1.4;
                }
                
                .print-container {
                    max-width: 100%;
                }
                
                .print-instructions {
                    background: #f8f9fa;
                    border: 1px solid #000;
                    padding: 15px;
                    margin-bottom: 20px;
                    page-break-after: avoid;
                }
                
                .print-instructions h2 {
                    color: black;
                    font-size: 16px;
                    margin-bottom: 10px;
                }
                
                .print-instructions ul {
                    margin: 0;
                    padding-left: 20px;
                }
                
                .print-instructions li {
                    font-size: 12px;
                    margin-bottom: 5px;
                    color: black;
                }
                
                .print-section {
                    break-inside: avoid;
                    page-break-inside: avoid;
                    background: white !important;
                    border: 2px solid #000 !important;
                    border-radius: 8px !important;
                    padding: 20px !important;
                    margin: 20px 0 !important;
                    box-shadow: none !important;
                }
                
                .print-section h2 {
                    color: #000 !important;
                    font-size: 18px !important;
                    margin-bottom: 15px !important;
                    border-bottom: 2px solid #000 !important;
                    padding-bottom: 8px !important;
                    page-break-after: avoid;
                }
                
                .print-section h3 {
                    color: #333 !important;
                    font-size: 16px !important;
                    margin: 20px 0 10px 0 !important;
                    border-left: 3px solid #000 !important;
                    padding-left: 10px !important;
                    page-break-after: avoid;
                }
                
                .print-section h4 {
                    color: #555 !important;
                    font-size: 14px !important;
                    margin: 15px 0 8px 0 !important;
                }
                
                .print-section p {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 10px !important;
                    line-height: 1.5 !important;
                }
                
                .print-section ul, .print-section ol {
                    color: black !important;
                    font-size: 12px !important;
                    margin: 10px 0 !important;
                    padding-left: 25px !important;
                }
                
                .print-section li {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 6px !important;
                    line-height: 1.4 !important;
                }
                
                .info-box, .step-by-step, .practice-box {
                    background: #f8f9fa !important;
                    border: 1px dashed #666 !important;
                    padding: 15px !important;
                    margin: 15px 0 !important;
                    border-radius: 6px !important;
                }
                
                .executive-summary {
                    display: grid !important;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
                    gap: 15px !important;
                    margin: 20px 0 !important;
                }
                
                .summary-item {
                    background: #f8f9fa !important;
                    border: 1px solid #ccc !important;
                    padding: 15px !important;
                    border-radius: 6px !important;
                    border-left: 4px solid #000 !important;
                }
                
                .aviso-importante {
                    background: #fff3cd !important;
                    border: 2px solid #000 !important;
                    padding: 20px !important;
                    margin: 20px 0 !important;
                    border-radius: 8px !important;
                    text-align: center !important;
                }
                
                .aviso-importante h4 {
                    color: black !important;
                    margin: 0 !important;
                    font-size: 14px !important;
                }
                
                .scratch-code {
                    background: #f5f5f5 !important;
                    color: black !important;
                    border: 1px solid #ccc !important;
                    border-left: 4px solid #000 !important;
                    padding: 12px !important;
                    margin: 10px 0 !important;
                    border-radius: 6px !important;
                    font-family: 'Courier New', monospace !important;
                    font-size: 11px !important;
                    white-space: pre-wrap !important;
                    line-height: 1.3 !important;
                }
                
                code {
                    background: #f5f5f5 !important;
                    color: black !important;
                    border: 1px solid #ddd !important;
                    font-size: 11px !important;
                    padding: 2px 4px !important;
                    border-radius: 3px !important;
                    font-family: 'Courier New', monospace !important;
                }
                
                @media print {
                    body {
                        padding: 10px;
                    }
                    
                    .print-section {
                        margin: 15px 0 !important;
                        padding: 15px !important;
                    }
                    
                    .print-instructions {
                        margin-bottom: 15px !important;
                    }
                    
                    .print-section h2 {
                        font-size: 16px !important;
                    }
                    
                    .print-section h3 {
                        font-size: 14px !important;
                    }
                    
                    /* Quebra de página antes de cada seção principal (exceto a primeira) */
                    .print-section:nth-child(n+3) {
                        page-break-before: always;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-container">
                <div class="print-instructions">
                    <h2>Mundo Digital: Conceitos Fundamentais - UTFPR</h2>
                    <ul>
                        <li><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</li>
                        <li><strong>Página:</strong> Mundo Digital - Conceitos Fundamentais</li>
                        <li><strong>Material:</strong> Projeto Scratch na Educação Básica</li>
                        <li><strong>Instruções:</strong> Cada seção principal inicia em uma nova página</li>
                    </ul>
                </div>
    `);
    
    // Adiciona cada seção do mundo digital ao documento de impressão (REMOVENDO NAVEGAÇÃO)
    const contentSections = document.querySelectorAll('.content-section');
    let navigationFound = false;
    
    contentSections.forEach((section, index) => {
        // Verifica se já encontramos a seção de navegação em iterações anteriores
        if (navigationFound) {
            return;
        }
        
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent.trim() : `Seção ${index + 1}`;
        
        // MELHORIA: Detecção mais robusta da seção de Navegação
        if (title === 'Navegação' || title.includes('Navegação')) {
            navigationFound = true;
            return;
        }
        
        const sectionContent = section.cloneNode(true);
        
        // Remove elementos de navegação
        const navCards = sectionContent.querySelector('.card-grid');
        if (navCards) {
            navCards.remove();
        }
        
        const contentHTML = sectionContent.innerHTML;
        
        printDocument.write(`
            <div class="print-section">
                ${contentHTML}
            </div>
        `);
    });
    
    // Finaliza o documento
    printDocument.write(`
            </div>
        </body>
        </html>
    `);
    
    printDocument.close();
    
    // Aguarda o carregamento e imprime
    printFrame.onload = function() {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
        
        // Remove o iframe após a impressão
        setTimeout(() => {
            if (document.body.contains(printFrame)) {
                document.body.removeChild(printFrame);
            }
            const printOverlay = document.querySelector('.print-overlay');
            if (printOverlay) {
                document.body.removeChild(printOverlay);
            }
        }, 500);
    };
}

// =============================================
// PRINT FUNCTIONALITY FOR MODELOS PROJETOS
// =============================================

// Função para criar e exibir a visualização de impressão dos MODELOS DE PROJETOS
function showPrintPreviewModelosProjetos() {
    // Verifica se estamos na página correta
    const isModelosPage = window.location.pathname.includes('modelos-projetos.html') || 
                         window.location.pathname.endsWith('modelos-projetos.html');
    if (!isModelosPage) {
        console.log('Função showPrintPreviewModelosProjetos chamada fora da página de modelos de projetos');
        return;
    }
    
    // Cria overlay para preview de impressão
    const printOverlay = document.createElement('div');
    printOverlay.className = 'print-overlay';
    printOverlay.style.display = 'flex';
    
    // Cria container do preview
    const printPreview = document.createElement('div');
    printPreview.className = 'print-preview';
    printPreview.style.maxWidth = '90%';
    printPreview.style.maxHeight = '90%';
    
    // Cria botão de fechar
    const closeButton = document.createElement('button');
    closeButton.className = 'close-preview';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => {
        document.body.removeChild(printOverlay);
    };
    
    // Cria container de impressão
    const printContainer = document.createElement('div');
    printContainer.className = 'print-container';
    
    // Adiciona instruções de impressão
    const printInstructions = document.createElement('div');
    printInstructions.className = 'print-instructions';
    printInstructions.innerHTML = `
        <h2>Instruções para Impressão - Modelos de Projetos</h2>
        <ul>
            <li>Use papel A4 padrão</li>
            <li>Configure a impressão para "Retrato"</li>
            <li>Defina margens para "Padrão" ou "Mínimo"</li>
            <li>Imprima em qualidade normal</li>
            <li>Verifique a visualização antes de imprimir</li>
            <li>Cada modelo de projeto inicia em uma nova página</li>
            <li>Recomendado: imprimir por template conforme necessidade</li>
        </ul>
    `;
    
    // Cria container para os modelos de projetos
    const printModelos = document.createElement('div');
    printModelos.className = 'print-modelos';
    
    // Coleta todas as seções de conteúdo da página de modelos de projetos
    const contentSections = document.querySelectorAll('.content-section');
    
    // Adiciona cada seção ao preview de impressão (REMOVENDO NAVEGAÇÃO)
    contentSections.forEach((section, index) => {
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent : '';
        
        // Remove a seção de navegação e tudo que vem após
        if (title === 'Navegação') {
            return;
        }
        
        const printSection = section.cloneNode(true);
        printSection.classList.add('print-section');
        
        // Remove elementos de navegação dentro das seções
        const navCards = printSection.querySelector('.card-grid');
        if (navCards) {
            navCards.remove();
        }
        
        printModelos.appendChild(printSection);
    });
    
    // Cria botões de ação
    const printActions = document.createElement('div');
    printActions.className = 'print-actions';
    
    const printBtn = document.createElement('button');
    printBtn.className = 'print-button';
    printBtn.innerHTML = '🖨️ Imprimir Modelos de Projetos';
    printBtn.onclick = () => printModelosProjetosContent();
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'secondary-button';
    closeBtn.innerHTML = 'Fechar';
    closeBtn.onclick = () => document.body.removeChild(printOverlay);
    
    printActions.appendChild(printBtn);
    printActions.appendChild(closeBtn);
    
    // Monta a estrutura
    printContainer.appendChild(printInstructions);
    printContainer.appendChild(printModelos);
    printPreview.appendChild(closeButton);
    printPreview.appendChild(printContainer);
    printPreview.appendChild(printActions);
    printOverlay.appendChild(printPreview);
    
    // Adiciona ao documento
    document.body.appendChild(printOverlay);
}

// Função para imprimir os modelos de projetos
function printModelosProjetosContent() {
    // Verifica se estamos na página correta
    const isModelosPage = window.location.pathname.includes('modelos-projetos.html') || 
                         window.location.pathname.endsWith('modelos-projetos.html');
    if (!isModelosPage) {
        console.log('Função printModelosProjetosContent chamada fora da página de modelos de projetos');
        return;
    }
    
    // Cria um iframe para impressão
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.left = '-9999px';
    printFrame.style.top = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    
    document.body.appendChild(printFrame);
    
    const printDocument = printFrame.contentWindow.document;
    
    // Escreve o conteúdo HTML para impressão
    printDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Modelos de Projetos Scratch - UTFPR</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: white;
                    color: black;
                    font-size: 12pt;
                    line-height: 1.4;
                }
                
                .print-container {
                    max-width: 100%;
                }
                
                .print-instructions {
                    background: #f8f9fa;
                    border: 1px solid #000;
                    padding: 15px;
                    margin-bottom: 20px;
                    page-break-after: avoid;
                }
                
                .print-instructions h2 {
                    color: black;
                    font-size: 16px;
                    margin-bottom: 10px;
                }
                
                .print-instructions ul {
                    margin: 0;
                    padding-left: 20px;
                }
                
                .print-instructions li {
                    font-size: 12px;
                    margin-bottom: 5px;
                    color: black;
                }
                
                .print-section {
                    break-inside: avoid;
                    page-break-inside: avoid;
                    background: white !important;
                    border: 2px solid #000 !important;
                    border-radius: 8px !important;
                    padding: 20px !important;
                    margin: 20px 0 !important;
                    box-shadow: none !important;
                }
                
                .print-section h2 {
                    color: #000 !important;
                    font-size: 18px !important;
                    margin-bottom: 15px !important;
                    border-bottom: 2px solid #000 !important;
                    padding-bottom: 8px !important;
                    page-break-after: avoid;
                }
                
                .print-section h3 {
                    color: #333 !important;
                    font-size: 16px !important;
                    margin: 20px 0 10px 0 !important;
                    border-left: 3px solid #000 !important;
                    padding-left: 10px !important;
                    page-break-after: avoid;
                }
                
                .print-section h4 {
                    color: #555 !important;
                    font-size: 14px !important;
                    margin: 15px 0 8px 0 !important;
                }
                
                .print-section p {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 10px !important;
                    line-height: 1.5 !important;
                }
                
                .print-section ul, .print-section ol {
                    color: black !important;
                    font-size: 12px !important;
                    margin: 10px 0 !important;
                    padding-left: 25px !important;
                }
                
                .print-section li {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 6px !important;
                    line-height: 1.4 !important;
                }
                
                .scratch-code {
                    background: #f5f5f5 !important;
                    color: black !important;
                    border: 1px solid #ccc !important;
                    border-left: 4px solid #000 !important;
                    padding: 12px !important;
                    margin: 10px 0 !important;
                    border-radius: 6px !important;
                    font-family: 'Courier New', monospace !important;
                    font-size: 11px !important;
                    white-space: pre-wrap !important;
                    line-height: 1.3 !important;
                }
                
                code {
                    background: #f5f5f5 !important;
                    color: black !important;
                    border: 1px solid #ddd !important;
                    font-size: 11px !important;
                    padding: 2px 4px !important;
                    border-radius: 3px !important;
                    font-family: 'Courier New', monospace !important;
                }
                
                @media print {
                    body {
                        padding: 10px;
                    }
                    
                    .print-section {
                        margin: 15px 0 !important;
                        padding: 15px !important;
                    }
                    
                    .print-instructions {
                        margin-bottom: 15px !important;
                    }
                    
                    .print-section h2 {
                        font-size: 16px !important;
                    }
                    
                    .print-section h3 {
                        font-size: 14px !important;
                    }
                    
                    /* Quebra de página antes de cada modelo de projeto (exceto o primeiro) */
                    .print-section:nth-child(n+3) {
                        page-break-before: always;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-container">
                <div class="print-instructions">
                    <h2>Modelos de Projetos Scratch - UTFPR</h2>
                    <ul>
                        <li><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</li>
                        <li><strong>Página:</strong> Modelos de Projetos Prontos</li>
                        <li><strong>Material:</strong> Projeto Scratch na Educação Básica</li>
                        <li><strong>Instruções:</strong> Cada modelo inicia em uma nova página</li>
                    </ul>
                </div>
    `);
    
    // Adiciona cada seção de modelo de projeto ao documento de impressão (REMOVENDO NAVEGAÇÃO)
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach((section, index) => {
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent : `Seção ${index + 1}`;
        
        // Remove a seção de navegação e tudo que vem após
        if (title === 'Navegação') {
            return;
        }
        
        const sectionContent = section.cloneNode(true);
        
        // Remove elementos de navegação
        const navCards = sectionContent.querySelector('.card-grid');
        if (navCards) {
            navCards.remove();
        }
        
        const contentHTML = sectionContent.innerHTML;
        
        printDocument.write(`
            <div class="print-section">
                ${contentHTML}
            </div>
        `);
    });
    
    // Finaliza o documento
    printDocument.write(`
            </div>
        </body>
        </html>
    `);
    
    printDocument.close();
    
    // Aguarda o carregamento e imprime
    printFrame.onload = function() {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
        
        // Remove o iframe após a impressão
        setTimeout(() => {
            if (document.body.contains(printFrame)) {
                document.body.removeChild(printFrame);
            }
            const printOverlay = document.querySelector('.print-overlay');
            if (printOverlay) {
                document.body.removeChild(printOverlay);
            }
        }, 500);
    };
}

// =============================================
// PRINT FUNCTIONALITY FOR PROJETOS DIDATICOS
// =============================================

// Função para criar e exibir a visualização de impressão dos PROJETOS DIDÁTICOS
function showPrintPreviewProjetosDidaticos() {
    // Verifica se estamos na página correta
    const isProjetosPage = window.location.pathname.includes('projetos-didaticos.html') || 
                          window.location.pathname.endsWith('projetos-didaticos.html');
    if (!isProjetosPage) {
        console.log('Função showPrintPreviewProjetosDidaticos chamada fora da página de projetos didáticos');
        return;
    }
    
    // Cria overlay para preview de impressão
    const printOverlay = document.createElement('div');
    printOverlay.className = 'print-overlay';
    printOverlay.style.display = 'flex';
    
    // Cria container do preview
    const printPreview = document.createElement('div');
    printPreview.className = 'print-preview';
    printPreview.style.maxWidth = '90%';
    printPreview.style.maxHeight = '90%';
    
    // Cria botão de fechar
    const closeButton = document.createElement('button');
    closeButton.className = 'close-preview';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => {
        document.body.removeChild(printOverlay);
    };
    
    // Cria container de impressão
    const printContainer = document.createElement('div');
    printContainer.className = 'print-container';
    
    // Adiciona instruções de impressão
    const printInstructions = document.createElement('div');
    printInstructions.className = 'print-instructions';
    printInstructions.innerHTML = `
        <h2>Instruções para Impressão - Projetos Didáticos</h2>
        <ul>
            <li>Use papel A4 padrão</li>
            <li>Configure a impressão para "Retrato"</li>
            <li>Defina margens para "Padrão" ou "Mínimo"</li>
            <li>Imprima em qualidade normal</li>
            <li>Verifique a visualização antes de imprimir</li>
            <li>Cada projeto didático inicia em uma nova página</li>
            <li>Recomendado: imprimir por ano escolar conforme necessidade</li>
        </ul>
    `;
    
    // Cria container para os projetos didáticos
    const printProjetos = document.createElement('div');
    printProjetos.className = 'print-projetos';
    
    // Coleta todas as seções de conteúdo da página de projetos didáticos
    const contentSections = document.querySelectorAll('.content-section');
    
    // Adiciona cada seção ao preview de impressão (REMOVENDO NAVEGAÇÃO)
    contentSections.forEach((section, index) => {
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent : '';
        
        // Remove a seção de navegação e tudo que vem após
        if (title === 'Navegação') {
            return;
        }
        
        const printSection = section.cloneNode(true);
        printSection.classList.add('print-section');
        
        // Remove elementos de navegação dentro das seções
        const navCards = printSection.querySelector('.card-grid');
        if (navCards) {
            navCards.remove();
        }
        
        printProjetos.appendChild(printSection);
    });
    
    // Cria botões de ação
    const printActions = document.createElement('div');
    printActions.className = 'print-actions';
    
    const printBtn = document.createElement('button');
    printBtn.className = 'print-button';
    printBtn.innerHTML = '🖨️ Imprimir Projetos Didáticos';
    printBtn.onclick = () => printProjetosDidaticosContent();
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'secondary-button';
    closeBtn.innerHTML = 'Fechar';
    closeBtn.onclick = () => document.body.removeChild(printOverlay);
    
    printActions.appendChild(printBtn);
    printActions.appendChild(closeBtn);
    
    // Monta a estrutura
    printContainer.appendChild(printInstructions);
    printContainer.appendChild(printProjetos);
    printPreview.appendChild(closeButton);
    printPreview.appendChild(printContainer);
    printPreview.appendChild(printActions);
    printOverlay.appendChild(printPreview);
    
    // Adiciona ao documento
    document.body.appendChild(printOverlay);
}

// Função para imprimir os projetos didáticos
function printProjetosDidaticosContent() {
    // Verifica se estamos na página correta
    const isProjetosPage = window.location.pathname.includes('projetos-didaticos.html') || 
                          window.location.pathname.endsWith('projetos-didaticos.html');
    if (!isProjetosPage) {
        console.log('Função printProjetosDidaticosContent chamada fora da página de projetos didáticos');
        return;
    }
    
    // Cria um iframe para impressão
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.left = '-9999px';
    printFrame.style.top = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    
    document.body.appendChild(printFrame);
    
    const printDocument = printFrame.contentWindow.document;
    
    // Escreve o conteúdo HTML para impressão
    printDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Projetos Didáticos Scratch - UTFPR</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: white;
                    color: black;
                    font-size: 12pt;
                    line-height: 1.4;
                }
                
                .print-container {
                    max-width: 100%;
                }
                
                .print-instructions {
                    background: #f8f9fa;
                    border: 1px solid #000;
                    padding: 15px;
                    margin-bottom: 20px;
                    page-break-after: avoid;
                }
                
                .print-instructions h2 {
                    color: black;
                    font-size: 16px;
                    margin-bottom: 10px;
                }
                
                .print-instructions ul {
                    margin: 0;
                    padding-left: 20px;
                }
                
                .print-instructions li {
                    font-size: 12px;
                    margin-bottom: 5px;
                    color: black;
                }
                
                .print-section {
                    break-inside: avoid;
                    page-break-inside: avoid;
                    background: white !important;
                    border: 2px solid #000 !important;
                    border-radius: 8px !important;
                    padding: 20px !important;
                    margin: 20px 0 !important;
                    box-shadow: none !important;
                }
                
                .print-section h2 {
                    color: #000 !important;
                    font-size: 18px !important;
                    margin-bottom: 15px !important;
                    border-bottom: 2px solid #000 !important;
                    padding-bottom: 8px !important;
                    page-break-after: avoid;
                }
                
                .print-section h3 {
                    color: #333 !important;
                    font-size: 16px !important;
                    margin: 20px 0 10px 0 !important;
                    border-left: 3px solid #000 !important;
                    padding-left: 10px !important;
                    page-break-after: avoid;
                }
                
                .print-section h4 {
                    color: #555 !important;
                    font-size: 14px !important;
                    margin: 15px 0 8px 0 !important;
                }
                
                .print-section p {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 10px !important;
                    line-height: 1.5 !important;
                }
                
                .print-section ul, .print-section ol {
                    color: black !important;
                    font-size: 12px !important;
                    margin: 10px 0 !important;
                    padding-left: 25px !important;
                }
                
                .print-section li {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 6px !important;
                    line-height: 1.4 !important;
                }
                
                .scratch-code {
                    background: #f5f5f5 !important;
                    color: black !important;
                    border: 1px solid #ccc !important;
                    border-left: 4px solid #000 !important;
                    padding: 12px !important;
                    margin: 10px 0 !important;
                    border-radius: 6px !important;
                    font-family: 'Courier New', monospace !important;
                    font-size: 11px !important;
                    white-space: pre-wrap !important;
                    line-height: 1.3 !important;
                }
                
                .progression-table {
                    width: 100% !important;
                    margin: 15px 0 !important;
                    border-collapse: collapse !important;
                }
                
                .progression-table table {
                    width: 100% !important;
                    border: 1px solid #000 !important;
                }
                
                .progression-table th {
                    background: #f8f9fa !important;
                    color: black !important;
                    border: 1px solid #000 !important;
                    padding: 8px !important;
                    font-size: 11px !important;
                    font-weight: bold !important;
                }
                
                .progression-table td {
                    border: 1px solid #000 !important;
                    padding: 8px !important;
                    font-size: 11px !important;
                }
                
                .checklist {
                    list-style: none !important;
                    padding-left: 0 !important;
                }
                
                .checklist li::before {
                    content: "☐ " !important;
                    margin-right: 8px !important;
                }
                
                code {
                    background: #f5f5f5 !important;
                    color: black !important;
                    border: 1px solid #ddd !important;
                    font-size: 11px !important;
                    padding: 2px 4px !important;
                    border-radius: 3px !important;
                    font-family: 'Courier New', monospace !important;
                }
                
                @media print {
                    body {
                        padding: 10px;
                    }
                    
                    .print-section {
                        margin: 15px 0 !important;
                        padding: 15px !important;
                    }
                    
                    .print-instructions {
                        margin-bottom: 15px !important;
                    }
                    
                    .print-section h2 {
                        font-size: 16px !important;
                    }
                    
                    .print-section h3 {
                        font-size: 14px !important;
                    }
                    
                    /* Quebra de página antes de cada projeto didático (exceto o primeiro) */
                    .print-section:nth-child(n+3) {
                        page-break-before: always;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-container">
                <div class="print-instructions">
                    <h2>Projetos Didáticos Scratch - UTFPR</h2>
                    <ul>
                        <li><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</li>
                        <li><strong>Página:</strong> Projetos Didáticos 1º ao 5º Ano</li>
                        <li><strong>Material:</strong> Projeto Scratch na Educação Básica</li>
                        <li><strong>Instruções:</strong> Cada projeto inicia em uma nova página</li>
                    </ul>
                </div>
    `);
    
    // Adiciona cada seção de projeto didático ao documento de impressão (REMOVENDO NAVEGAÇÃO)
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach((section, index) => {
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent : `Seção ${index + 1}`;
        
        // Remove a seção de navegação e tudo que vem após
        if (title === 'Navegação') {
            return;
        }
        
        const sectionContent = section.cloneNode(true);
        
        // Remove elementos de navegação
        const navCards = sectionContent.querySelector('.card-grid');
        if (navCards) {
            navCards.remove();
        }
        
        const contentHTML = sectionContent.innerHTML;
        
        printDocument.write(`
            <div class="print-section">
                ${contentHTML}
            </div>
        `);
    });
    
    // Finaliza o documento
    printDocument.write(`
            </div>
        </body>
        </html>
    `);
    
    printDocument.close();
    
    // Aguarda o carregamento e imprime
    printFrame.onload = function() {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
        
        // Remove o iframe após a impressão
        setTimeout(() => {
            if (document.body.contains(printFrame)) {
                document.body.removeChild(printFrame);
            }
            const printOverlay = document.querySelector('.print-overlay');
            if (printOverlay) {
                document.body.removeChild(printOverlay);
            }
        }, 500);
    };
}

// =============================================
// PRINT FUNCTIONALITY FOR FICHAS ATIVIDADES
// =============================================

// Função para criar e exibir a visualização de impressão das FICHAS DE ATIVIDADES
function showPrintPreviewFichasAtividades() {
    // Verifica se estamos na página correta
    const isFichasPage = window.location.pathname.includes('fichas-atividades.html') || 
                        window.location.pathname.endsWith('fichas-atividades.html');
    if (!isFichasPage) {
        console.log('Função showPrintPreviewFichasAtividades chamada fora da página de fichas de atividades');
        return;
    }
    
    // Cria overlay para preview de impressão
    const printOverlay = document.createElement('div');
    printOverlay.className = 'print-overlay';
    printOverlay.style.display = 'flex';
    
    // Cria container do preview
    const printPreview = document.createElement('div');
    printPreview.className = 'print-preview';
    printPreview.style.maxWidth = '90%';
    printPreview.style.maxHeight = '90%';
    
    // Cria botão de fechar
    const closeButton = document.createElement('button');
    closeButton.className = 'close-preview';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => {
        document.body.removeChild(printOverlay);
    };
    
    // Cria container de impressão
    const printContainer = document.createElement('div');
    printContainer.className = 'print-container';
    
    // Adiciona instruções de impressão
    const printInstructions = document.createElement('div');
    printInstructions.className = 'print-instructions';
    printInstructions.innerHTML = `
        <h2>Instruções para Impressão - Fichas de Atividades</h2>
        <ul>
            <li>Use papel A4 padrão</li>
            <li>Configure a impressão para "Retrato"</li>
            <li>Defina margens para "Padrão" ou "Mínimo"</li>
            <li>Imprima em qualidade normal</li>
            <li>Verifique a visualização antes de imprimir</li>
            <li>Cada ficha de atividade inicia em uma nova página</li>
            <li>Recomendado: imprimir por ano escolar conforme necessidade</li>
        </ul>
    `;
    
    // Cria container para as fichas de atividades
    const printFichas = document.createElement('div');
    printFichas.className = 'print-fichas';
    
    // Coleta todas as seções de conteúdo da página de fichas de atividades
    const contentSections = document.querySelectorAll('.content-section');
    
    // Adiciona cada seção ao preview de impressão (REMOVENDO NAVEGAÇÃO)
    contentSections.forEach((section, index) => {
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent : '';
        
        // Remove a seção de navegação e tudo que vem após
        if (title === 'Navegação') {
            return;
        }
        
        const printSection = section.cloneNode(true);
        printSection.classList.add('print-section');
        
        // Remove elementos de navegação dentro das seções
        const navCards = printSection.querySelector('.card-grid');
        if (navCards) {
            navCards.remove();
        }
        
        printFichas.appendChild(printSection);
    });
    
    // Cria botões de ação
    const printActions = document.createElement('div');
    printActions.className = 'print-actions';
    
    const printBtn = document.createElement('button');
    printBtn.className = 'print-button';
    printBtn.innerHTML = '🖨️ Imprimir Fichas de Atividades';
    printBtn.onclick = () => printFichasAtividadesContent();
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'secondary-button';
    closeBtn.innerHTML = 'Fechar';
    closeBtn.onclick = () => document.body.removeChild(printOverlay);
    
    printActions.appendChild(printBtn);
    printActions.appendChild(closeBtn);
    
    // Monta a estrutura
    printContainer.appendChild(printInstructions);
    printContainer.appendChild(printFichas);
    printPreview.appendChild(closeButton);
    printPreview.appendChild(printContainer);
    printPreview.appendChild(printActions);
    printOverlay.appendChild(printPreview);
    
    // Adiciona ao documento
    document.body.appendChild(printOverlay);
}

// Função para imprimir as fichas de atividades
function printFichasAtividadesContent() {
    // Verifica se estamos na página correta
    const isFichasPage = window.location.pathname.includes('fichas-atividades.html') || 
                        window.location.pathname.endsWith('fichas-atividades.html');
    if (!isFichasPage) {
        console.log('Função printFichasAtividadesContent chamada fora da página de fichas de atividades');
        return;
    }
    
    // Cria um iframe para impressão
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.left = '-9999px';
    printFrame.style.top = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    
    document.body.appendChild(printFrame);
    
    const printDocument = printFrame.contentWindow.document;
    
    // Escreve o conteúdo HTML para impressão
    printDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Fichas de Atividades Scratch - UTFPR</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: white;
                    color: black;
                    font-size: 12pt;
                    line-height: 1.4;
                }
                
                .print-container {
                    max-width: 100%;
                }
                
                .print-instructions {
                    background: #f8f9fa;
                    border: 1px solid #000;
                    padding: 15px;
                    margin-bottom: 20px;
                    page-break-after: avoid;
                }
                
                .print-instructions h2 {
                    color: black;
                    font-size: 16px;
                    margin-bottom: 10px;
                }
                
                .print-instructions ul {
                    margin: 0;
                    padding-left: 20px;
                }
                
                .print-instructions li {
                    font-size: 12px;
                    margin-bottom: 5px;
                    color: black;
                }
                
                .print-section {
                    break-inside: avoid;
                    page-break-inside: avoid;
                    background: white !important;
                    border: 2px solid #000 !important;
                    border-radius: 8px !important;
                    padding: 20px !important;
                    margin: 20px 0 !important;
                    box-shadow: none !important;
                }
                
                .print-section h2 {
                    color: #000 !important;
                    font-size: 18px !important;
                    margin-bottom: 15px !important;
                    border-bottom: 2px solid #000 !important;
                    padding-bottom: 8px !important;
                    page-break-after: avoid;
                }
                
                .print-section h3 {
                    color: #333 !important;
                    font-size: 16px !important;
                    margin: 20px 0 10px 0 !important;
                    border-left: 3px solid #000 !important;
                    padding-left: 10px !important;
                    page-break-after: avoid;
                }
                
                .print-section h4 {
                    color: #555 !important;
                    font-size: 14px !important;
                    margin: 15px 0 8px 0 !important;
                }
                
                .print-section p {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 10px !important;
                    line-height: 1.5 !important;
                }
                
                .print-section ul, .print-section ol {
                    color: black !important;
                    font-size: 12px !important;
                    margin: 10px 0 !important;
                    padding-left: 25px !important;
                }
                
                .print-section li {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 6px !important;
                    line-height: 1.4 !important;
                }
                
                .ficha-atividade {
                    background: #f8f9fa !important;
                    border: 1px solid #666 !important;
                    padding: 15px !important;
                    margin: 15px 0 !important;
                    border-radius: 6px !important;
                }
                
                .ficha-cabecalho {
                    background: #e9ecef !important;
                    border-bottom: 2px solid #666 !important;
                    padding: 10px !important;
                    margin-bottom: 15px !important;
                    border-radius: 4px !important;
                }
                
                .checklist-ficha {
                    list-style: none !important;
                    padding-left: 0 !important;
                }
                
                .checklist-ficha li::before {
                    content: "☐ " !important;
                    margin-right: 8px !important;
                }
                
                .form-input-space {
                    display: inline-block;
                    min-width: 200px;
                    border-bottom: 1px solid #000;
                    margin: 0 5px;
                }
                
                .form-list-space {
                    display: inline-block;
                    min-width: 300px;
                    border-bottom: 1px solid #000;
                    margin: 0 5px;
                }
                
                .area-desenho {
                    border: 2px dashed #666 !important;
                    height: 200px !important;
                    border-radius: 8px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    color: #666 !important;
                    margin: 15px 0 !important;
                    background: white !important;
                }
                
                .assinatura {
                    border-top: 2px solid #000 !important;
                    padding-top: 15px !important;
                    margin-top: 20px !important;
                }
                
                .pergunta-item, .teste-item, .formula-box {
                    background: white !important;
                    border: 1px solid #ccc !important;
                    padding: 12px !important;
                    margin: 10px 0 !important;
                    border-radius: 6px !important;
                }
                
                .diario-bordo {
                    border: 1px solid #ccc !important;
                    padding: 12px !important;
                    margin: 10px 0 !important;
                    border-radius: 6px !important;
                    min-height: 60px !important;
                    background: white !important;
                }
                
                .brainstorming-section, .plano-acao {
                    background: #f8f9fa !important;
                    border: 1px solid #666 !important;
                    padding: 15px !important;
                    margin: 15px 0 !important;
                    border-radius: 6px !important;
                }
                
                .semana-plano {
                    background: white !important;
                    border: 1px solid #ccc !important;
                    padding: 12px !important;
                    margin: 10px 0 !important;
                    border-radius: 6px !important;
                }
                
                code {
                    background: #f5f5f5 !important;
                    color: black !important;
                    border: 1px solid #ddd !important;
                    font-size: 11px !important;
                    padding: 2px 4px !important;
                    border-radius: 3px !important;
                    font-family: 'Courier New', monospace !important;
                }
                
                @media print {
                    body {
                        padding: 10px;
                    }
                    
                    .print-section {
                        margin: 15px 0 !important;
                        padding: 15px !important;
                    }
                    
                    .print-instructions {
                        margin-bottom: 15px !important;
                    }
                    
                    .print-section h2 {
                        font-size: 16px !important;
                    }
                    
                    .print-section h3 {
                        font-size: 14px !important;
                    }
                    
                    /* Quebra de página antes de cada ficha de atividade (exceto a primeira) */
                    .print-section:nth-child(n+3) {
                        page-break-before: always;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-container">
                <div class="print-instructions">
                    <h2>Fichas de Atividades Scratch - UTFPR</h2>
                    <ul>
                        <li><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</li>
                        <li><strong>Página:</strong> Fichas de Atividades 1º ao 5º Ano + Bônus</li>
                        <li><strong>Material:</strong> Projeto Scratch na Educação Básica</li>
                        <li><strong>Instruções:</strong> Cada ficha inicia em uma nova página</li>
                    </ul>
                </div>
    `);
    
    // Adiciona cada seção de ficha de atividade ao documento de impressão (REMOVENDO NAVEGAÇÃO)
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach((section, index) => {
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent : `Seção ${index + 1}`;
        
        // Remove a seção de navegação e tudo que vem após
        if (title === 'Navegação') {
            return;
        }
        
        const sectionContent = section.cloneNode(true);
        
        // Remove elementos de navegação
        const navCards = sectionContent.querySelector('.card-grid');
        if (navCards) {
            navCards.remove();
        }
        
        const contentHTML = sectionContent.innerHTML;
        
        printDocument.write(`
            <div class="print-section">
                ${contentHTML}
            </div>
        `);
    });
    
    // Finaliza o documento
    printDocument.write(`
            </div>
        </body>
        </html>
    `);
    
    printDocument.close();
    
    // Aguarda o carregamento e imprime
    printFrame.onload = function() {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
        
        // Remove o iframe após a impressão
        setTimeout(() => {
            if (document.body.contains(printFrame)) {
                document.body.removeChild(printFrame);
            }
            const printOverlay = document.querySelector('.print-overlay');
            if (printOverlay) {
                document.body.removeChild(printOverlay);
            }
        }, 500);
    };
}

// =============================================
// PRINT FUNCTIONALITY FOR LESSON PLANS
// =============================================

// Função para criar e exibir a visualização de impressão de PLANOS DE AULA
function showPrintPreviewLessonPlans() {
    // Verifica se estamos na página correta
    const isPlanosPage = window.location.pathname.includes('planos-aula.html') || 
                        window.location.pathname.endsWith('planos-aula.html');
    if (!isPlanosPage) {
        console.log('Função showPrintPreviewLessonPlans chamada fora da página de planos de aula');
        return;
    }
    
    // Cria overlay para preview de impressão
    const printOverlay = document.createElement('div');
    printOverlay.className = 'print-overlay';
    printOverlay.style.display = 'flex';
    
    // Cria container do preview
    const printPreview = document.createElement('div');
    printPreview.className = 'print-preview';
    
    // Cria botão de fechar
    const closeButton = document.createElement('button');
    closeButton.className = 'close-preview';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => {
        document.body.removeChild(printOverlay);
    };
    
    // Cria container de impressão
    const printContainer = document.createElement('div');
    printContainer.className = 'print-container';
    
    // Adiciona instruções de impressão
    const printInstructions = document.createElement('div');
    printInstructions.className = 'print-instructions';
    printInstructions.innerHTML = `
        <h2>Instruções para Impressão - Planos de Aula</h2>
        <ul>
            <li>Use papel A4 padrão</li>
            <li>Configure a impressão para "Retrato"</li>
            <li>Defina margens para "Padrão" ou "Mínimo"</li>
            <li>Imprima em qualidade normal</li>
            <li>Verifique a visualização antes de imprimir</li>
        </ul>
    `;
    
    // Cria container para os planos de aula
    const printLessonPlans = document.createElement('div');
    printLessonPlans.className = 'print-lesson-plans';
    
    // Coleta todas as seções de conteúdo da página de planos de aula
    const contentSections = document.querySelectorAll('.content-section');
    
    // Adiciona cada seção ao preview de impressão (REMOVENDO NAVEGAÇÃO)
    contentSections.forEach((section, index) => {
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent : '';
        
        // Remove a seção de navegação e tudo que vem após
        if (title === 'Navegação') {
            return;
        }
        
        const printSection = section.cloneNode(true);
        printSection.classList.add('print-section');
        
        // Remove elementos não necessários para impressão
        const navCards = printSection.querySelector('.card-grid');
        if (navCards) {
            navCards.remove();
        }
        
        printLessonPlans.appendChild(printSection);
    });
    
    // Cria botões de ação
    const printActions = document.createElement('div');
    printActions.className = 'print-actions';
    
    const printBtn = document.createElement('button');
    printBtn.className = 'print-button';
    printBtn.innerHTML = '🖨️ Imprimir Planos de Aula';
    printBtn.onclick = () => printLessonPlansContent();
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'secondary-button';
    closeBtn.innerHTML = 'Fechar';
    closeBtn.onclick = () => document.body.removeChild(printOverlay);
    
    printActions.appendChild(printBtn);
    printActions.appendChild(closeBtn);
    
    // Monta a estrutura
    printContainer.appendChild(printInstructions);
    printContainer.appendChild(printLessonPlans);
    printPreview.appendChild(closeButton);
    printPreview.appendChild(printContainer);
    printPreview.appendChild(printActions);
    printOverlay.appendChild(printPreview);
    
    // Adiciona ao documento
    document.body.appendChild(printOverlay);
}

// Função para imprimir os planos de aula
function printLessonPlansContent() {
    // Verifica se estamos na página correta
    const isPlanosPage = window.location.pathname.includes('planos-aula.html') || 
                        window.location.pathname.endsWith('planos-aula.html');
    if (!isPlanosPage) {
        console.log('Função printLessonPlansContent chamada fora da página de planos de aula');
        return;
    }
    
    // Cria um iframe para impressão
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.left = '-9999px';
    printFrame.style.top = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    
    document.body.appendChild(printFrame);
    
    const printDocument = printFrame.contentWindow.document;
    
    // Escreve o conteúdo HTML para impressão
    printDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Planos de Aula Scratch - UTFPR</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: white;
                    color: black;
                    font-size: 12pt;
                    line-height: 1.4;
                }
                
                .print-container {
                    max-width: 100%;
                }
                
                .print-instructions {
                    background: #f8f9fa;
                    border: 1px solid #000;
                    padding: 15px;
                    margin-bottom: 20px;
                    page-break-after: avoid;
                }
                
                .print-instructions h2 {
                    color: black;
                    font-size: 16px;
                    margin-bottom: 10px;
                }
                
                .print-instructions ul {
                    margin: 0;
                    padding-left: 20px;
                }
                
                .print-instructions li {
                    font-size: 12px;
                    margin-bottom: 5px;
                    color: black;
                }
                
                .print-section {
                    break-inside: avoid;
                    page-break-inside: avoid;
                    background: white !important;
                    border: 2px solid #000 !important;
                    border-radius: 8px !important;
                    padding: 20px !important;
                    margin: 20px 0 !important;
                    box-shadow: none !important;
                }
                
                .print-section h2 {
                    color: #000 !important;
                    font-size: 18px !important;
                    margin-bottom: 15px !important;
                    border-bottom: 2px solid #000 !important;
                    padding-bottom: 8px !important;
                }
                
                .print-section h3 {
                    color: #333 !important;
                    font-size: 16px !important;
                    margin: 20px 0 10px 0 !important;
                    border-left: 3px solid #000 !important;
                    padding-left: 10px !important;
                }
                
                .print-section h4 {
                    color: #555 !important;
                    font-size: 14px !important;
                    margin: 15px 0 8px 0 !important;
                }
                
                .print-section p {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 10px !important;
                    line-height: 1.5 !important;
                }
                
                .print-section ul, .print-section ol {
                    color: black !important;
                    font-size: 12px !important;
                    margin: 10px 0 !important;
                    padding-left: 25px !important;
                }
                
                .print-section li {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 6px !important;
                    line-height: 1.4 !important;
                }
                
                .plano-info {
                    background: #f8f9fa !important;
                    border: 1px solid #ccc !important;
                    padding: 15px !important;
                    margin-bottom: 15px !important;
                    border-radius: 6px !important;
                }
                
                .scratch-code {
                    background: #f5f5f5 !important;
                    color: black !important;
                    border: 1px solid #ccc !important;
                    border-left: 4px solid #000 !important;
                    padding: 12px !important;
                    margin: 10px 0 !important;
                    border-radius: 6px !important;
                    font-family: 'Courier New', monospace !important;
                    font-size: 11px !important;
                    white-space: pre-wrap !important;
                    line-height: 1.3 !important;
                }
                
                .checklist {
                    list-style: none !important;
                    padding-left: 0 !important;
                }
                
                .checklist li::before {
                    content: "☐ " !important;
                    margin-right: 8px !important;
                }
                
                @media print {
                    body {
                        padding: 10px;
                    }
                    
                    .print-section {
                        margin: 15px 0 !important;
                        padding: 15px !important;
                    }
                    
                    .print-instructions {
                        margin-bottom: 15px !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-container">
                <div class="print-instructions">
                    <h2>Planos de Aula Scratch - UTFPR</h2>
                    <ul>
                        <li><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</li>
                        <li><strong>Página:</strong> Planos de Aula 1º ao 5º Ano</li>
                        <li><strong>Instruções:</strong> Verifique a visualização antes de imprimir</li>
                    </ul>
                </div>
    `);
    
    // Adiciona cada seção de plano de aula ao documento de impressão (REMOVENDO NAVEGAÇÃO)
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach((section, index) => {
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent : `Seção ${index + 1}`;
        
        // Remove a seção de navegação e tudo que vem após
        if (title === 'Navegação') {
            return;
        }
        
        const sectionContent = section.cloneNode(true);
        
        // Remove elementos de navegação
        const navCards = sectionContent.querySelector('.card-grid');
        if (navCards) {
            navCards.remove();
        }
        
        const contentHTML = sectionContent.innerHTML;
        
        printDocument.write(`
            <div class="print-section">
                ${contentHTML}
            </div>
        `);
    });
    
    // Finaliza o documento
    printDocument.write(`
            </div>
        </body>
        </html>
    `);
    
    printDocument.close();
    
    // Aguarda o carregamento e imprime
    printFrame.onload = function() {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
        
        // Remove o iframe após a impressão
        setTimeout(() => {
            if (document.body.contains(printFrame)) {
                document.body.removeChild(printFrame);
            }
            const printOverlay = document.querySelector('.print-overlay');
            if (printOverlay) {
                document.body.removeChild(printOverlay);
            }
        }, 500);
    };
}

// =============================================
// PRINT FUNCTIONALITY FOR SUGESTOES ATIVIDADES
// =============================================

// Função para criar e exibir a visualização de impressão das SUGESTÕES DE ATIVIDADES
function showPrintPreviewSugestoesAtividades() {
    // Verifica se estamos na página correta
    const isSugestoesPage = window.location.pathname.includes('sugestoes-atividades.html') || 
                           window.location.pathname.endsWith('sugestoes-atividades.html');
    if (!isSugestoesPage) {
        console.log('Função showPrintPreviewSugestoesAtividades chamada fora da página de sugestões de atividades');
        return;
    }
    
    // Cria overlay para preview de impressão
    const printOverlay = document.createElement('div');
    printOverlay.className = 'print-overlay';
    printOverlay.style.display = 'flex';
    
    // Cria container do preview
    const printPreview = document.createElement('div');
    printPreview.className = 'print-preview';
    printPreview.style.maxWidth = '90%';
    printPreview.style.maxHeight = '90%';
    
    // Cria botão de fechar
    const closeButton = document.createElement('button');
    closeButton.className = 'close-preview';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => {
        document.body.removeChild(printOverlay);
    };
    
    // Cria container de impressão
    const printContainer = document.createElement('div');
    printContainer.className = 'print-container';
    
    // Adiciona instruções de impressão
    const printInstructions = document.createElement('div');
    printInstructions.className = 'print-instructions';
    printInstructions.innerHTML = `
        <h2>Instruções para Impressão - Sugestões de Atividades</h2>
        <ul>
            <li>Use papel A4 padrão</li>
            <li>Configure a impressão para "Retrato"</li>
            <li>Defina margens para "Padrão" ou "Mínimo"</li>
            <li>Imprima em qualidade normal</li>
            <li>Verifique a visualização antes de imprimir</li>
            <li>Recomendado: imprimir por seções para melhor organização</li>
        </ul>
    `;
    
    // Cria container para as sugestões de atividades
    const printSugestoes = document.createElement('div');
    printSugestoes.className = 'print-sugestoes';
    
    // Coleta todas as seções de conteúdo da página de sugestões de atividades
    const contentSections = document.querySelectorAll('.content-section');
    
    // Adiciona cada seção ao preview de impressão (REMOVENDO NAVEGAÇÃO)
    contentSections.forEach((section, index) => {
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent : '';
        
        // Remove a seção de navegação e tudo que vem após
        if (title === 'Navegação') {
            return;
        }
        
        const printSection = section.cloneNode(true);
        printSection.classList.add('print-section');
        
        // Remove elementos de navegação dentro das seções
        const navCards = printSection.querySelector('.card-grid');
        if (navCards) {
            navCards.remove();
        }
        
        printSugestoes.appendChild(printSection);
    });
    
    // Cria botões de ação
    const printActions = document.createElement('div');
    printActions.className = 'print-actions';
    
    const printBtn = document.createElement('button');
    printBtn.className = 'print-button';
    printBtn.innerHTML = '🖨️ Imprimir Sugestões de Atividades';
    printBtn.onclick = () => printSugestoesAtividadesContent();
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'secondary-button';
    closeBtn.innerHTML = 'Fechar';
    closeBtn.onclick = () => document.body.removeChild(printOverlay);
    
    printActions.appendChild(printBtn);
    printActions.appendChild(closeBtn);
    
    // Monta a estrutura
    printContainer.appendChild(printInstructions);
    printContainer.appendChild(printSugestoes);
    printPreview.appendChild(closeButton);
    printPreview.appendChild(printContainer);
    printPreview.appendChild(printActions);
    printOverlay.appendChild(printPreview);
    
    // Adiciona ao documento
    document.body.appendChild(printOverlay);
}

// Função para imprimir as sugestões de atividades
function printSugestoesAtividadesContent() {
    // Verifica se estamos na página correta
    const isSugestoesPage = window.location.pathname.includes('sugestoes-atividades.html') || 
                           window.location.pathname.endsWith('sugestoes-atividades.html');
    if (!isSugestoesPage) {
        console.log('Função printSugestoesAtividadesContent chamada fora da página de sugestões de atividades');
        return;
    }
    
    // Cria um iframe para impressão
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.left = '-9999px';
    printFrame.style.top = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    
    document.body.appendChild(printFrame);
    
    const printDocument = printFrame.contentWindow.document;
    
    // Escreve o conteúdo HTML para impressão
    printDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Sugestões de Atividades com Cartões Scratch - UTFPR</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: white;
                    color: black;
                    font-size: 12pt;
                    line-height: 1.4;
                }
                
                .print-container {
                    max-width: 100%;
                }
                
                .print-instructions {
                    background: #f8f9fa;
                    border: 1px solid #000;
                    padding: 15px;
                    margin-bottom: 20px;
                    page-break-after: avoid;
                }
                
                .print-instructions h2 {
                    color: black;
                    font-size: 16px;
                    margin-bottom: 10px;
                }
                
                .print-instructions ul {
                    margin: 0;
                    padding-left: 20px;
                }
                
                .print-instructions li {
                    font-size: 12px;
                    margin-bottom: 5px;
                    color: black;
                }
                
                .print-section {
                    break-inside: avoid;
                    page-break-inside: avoid;
                    background: white !important;
                    border: 2px solid #000 !important;
                    border-radius: 8px !important;
                    padding: 20px !important;
                    margin: 20px 0 !important;
                    box-shadow: none !important;
                }
                
                .print-section h2 {
                    color: #000 !important;
                    font-size: 18px !important;
                    margin-bottom: 15px !important;
                    border-bottom: 2px solid #000 !important;
                    padding-bottom: 8px !important;
                    page-break-after: avoid;
                }
                
                .print-section h3 {
                    color: #333 !important;
                    font-size: 16px !important;
                    margin: 20px 0 10px 0 !important;
                    border-left: 3px solid #000 !important;
                    padding-left: 10px !important;
                    page-break-after: avoid;
                }
                
                .print-section h4 {
                    color: #555 !important;
                    font-size: 14px !important;
                    margin: 15px 0 8px 0 !important;
                }
                
                .print-section h5 {
                    color: #666 !important;
                    font-size: 13px !important;
                    margin: 12px 0 6px 0 !important;
                }
                
                .print-section p {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 10px !important;
                    line-height: 1.5 !important;
                }
                
                .print-section ul, .print-section ol {
                    color: black !important;
                    font-size: 12px !important;
                    margin: 10px 0 !important;
                    padding-left: 25px !important;
                }
                
                .print-section li {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 6px !important;
                    line-height: 1.4 !important;
                }
                
                .atividade-info {
                    background: #f8f9fa !important;
                    border: 1px solid #ccc !important;
                    padding: 15px !important;
                    margin-bottom: 15px !important;
                    border-radius: 6px !important;
                }
                
                .scratch-code {
                    background: #f5f5f5 !important;
                    color: black !important;
                    border: 1px solid #ccc !important;
                    border-left: 4px solid #000 !important;
                    padding: 12px !important;
                    margin: 10px 0 !important;
                    border-radius: 6px !important;
                    font-family: 'Courier New', monospace !important;
                    font-size: 11px !important;
                    white-space: pre-wrap !important;
                    line-height: 1.3 !important;
                }
                
                pre {
                    background: #f5f5f5 !important;
                    color: black !important;
                    border: 1px solid #ccc !important;
                    border-left: 4px solid #000 !important;
                    padding: 12px !important;
                    margin: 10px 0 !important;
                    border-radius: 6px !important;
                    font-family: 'Courier New', monospace !important;
                    font-size: 11px !important;
                    white-space: pre-wrap !important;
                    line-height: 1.3 !important;
                }
                
                code {
                    background: #f5f5f5 !important;
                    color: black !important;
                    border: 1px solid #ddd !important;
                    font-size: 11px !important;
                }
                
                .step-by-step {
                    background: #f8f9fa !important;
                    border: 1px dashed #666 !important;
                    padding: 15px !important;
                    margin: 15px 0 !important;
                    border-radius: 6px !important;
                }
                
                .ficha-modelo {
                    background: #f8f9fa !important;
                    border: 1px solid #666 !important;
                    padding: 15px !important;
                    margin: 15px 0 !important;
                    border-radius: 6px !important;
                }
                
                @media print {
                    body {
                        padding: 10px;
                    }
                    
                    .print-section {
                        margin: 15px 0 !important;
                        padding: 15px !important;
                    }
                    
                    .print-instructions {
                        margin-bottom: 15px !important;
                    }
                    
                    .print-section h2 {
                        font-size: 16px !important;
                    }
                    
                    .print-section h3 {
                        font-size: 14px !important;
                    }
                }
                
                /* Quebra de página antes de cada atividade principal */
                .print-section:nth-child(n+2) {
                    page-break-before: always;
                }
            </style>
        </head>
        <body>
            <div class="print-container">
                <div class="print-instructions">
                    <h2>Sugestões de Atividades com Cartões Scratch - UTFPR</h2>
                    <ul>
                        <li><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</li>
                        <li><strong>Página:</strong> Sugestões de Atividades 1º ao 5º Ano</li>
                        <li><strong>Material:</strong> Projeto Scratch na Educação Básica</li>
                        <li><strong>Instruções:</strong> Cada seção inicia em uma nova página</li>
                    </ul>
                </div>
    `);
    
    // Adiciona cada seção de sugestão de atividade ao documento de impressão (REMOVENDO NAVEGAÇÃO)
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach((section, index) => {
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent : `Seção ${index + 1}`;
        
        // Remove a seção de navegação e tudo que vem após
        if (title === 'Navegação') {
            return;
        }
        
        const sectionContent = section.cloneNode(true);
        
        // Remove elementos de navegação
        const navCards = sectionContent.querySelector('.card-grid');
        if (navCards) {
            navCards.remove();
        }
        
        const contentHTML = sectionContent.innerHTML;
        
        printDocument.write(`
            <div class="print-section">
                ${contentHTML}
            </div>
        `);
    });
    
    // Finaliza o documento
    printDocument.write(`
            </div>
        </body>
        </html>
    `);
    
    printDocument.close();
    
    // Aguarda o carregamento e imprime
    printFrame.onload = function() {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
        
        // Remove o iframe após a impressão
        setTimeout(() => {
            if (document.body.contains(printFrame)) {
                document.body.removeChild(printFrame);
            }
            const printOverlay = document.querySelector('.print-overlay');
            if (printOverlay) {
                document.body.removeChild(printOverlay);
            }
        }, 500);
    };
}

// =============================================
// PRINT FUNCTIONALITY FOR ATIVIDADES RAPIDAS
// =============================================

// Função para criar e exibir a visualização de impressão das FICHAS RÁPIDAS
function showPrintPreviewAtividadesRapidas() {
    // Verifica se estamos na página correta
    const isAtividadesRapidasPage = window.location.pathname.includes('atividades-rapidas.html') || 
                                   window.location.pathname.endsWith('atividades-rapidas.html');
    if (!isAtividadesRapidasPage) {
        console.log('Função showPrintPreviewAtividadesRapidas chamada fora da página de atividades rápidas');
        return;
    }
    
    // Cria overlay para preview de impressão
    const printOverlay = document.createElement('div');
    printOverlay.className = 'print-overlay';
    printOverlay.style.display = 'flex';
    
    // Cria container do preview
    const printPreview = document.createElement('div');
    printPreview.className = 'print-preview';
    printPreview.style.maxWidth = '90%';
    printPreview.style.maxHeight = '90%';
    
    // Cria botão de fechar
    const closeButton = document.createElement('button');
    closeButton.className = 'close-preview';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => {
        document.body.removeChild(printOverlay);
    };
    
    // Cria container de impressão
    const printContainer = document.createElement('div');
    printContainer.className = 'print-container';
    
    // Adiciona instruções de impressão
    const printInstructions = document.createElement('div');
    printInstructions.className = 'print-instructions';
    printInstructions.innerHTML = `
        <h2>Instruções para Impressão - Fichas Rápidas</h2>
        <ul>
            <li>Use papel A4 padrão</li>
            <li>Configure a impressão para "Retrato"</li>
            <li>Defina margens para "Padrão" ou "Mínimo"</li>
            <li>Imprima em qualidade normal</li>
            <li>Verifique a visualização antes de imprimir</li>
            <li>Cada ficha rápida inicia em uma nova página</li>
        </ul>
    `;
    
    // Cria container para as fichas rápidas
    const printAtividadesRapidas = document.createElement('div');
    printAtividadesRapidas.className = 'print-atividades-rapidas';
    
    // Coleta todas as seções de conteúdo da página de fichas rápidas
    const contentSections = document.querySelectorAll('.content-section');
    
    // Adiciona cada seção ao preview de impressão (REMOVENDO NAVEGAÇÃO)
    contentSections.forEach((section, index) => {
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent : '';
        
        // Remove a seção de navegação e tudo que vem após
        if (title === 'Navegação') {
            return;
        }
        
        const printSection = section.cloneNode(true);
        printSection.classList.add('print-section');
        
        // Remove elementos de navegação dentro das seções
        const navCards = printSection.querySelector('.card-grid');
        if (navCards) {
            navCards.remove();
        }
        
        printAtividadesRapidas.appendChild(printSection);
    });
    
    // Cria botões de ação
    const printActions = document.createElement('div');
    printActions.className = 'print-actions';
    
    const printBtn = document.createElement('button');
    printBtn.className = 'print-button';
    printBtn.innerHTML = '🖨️ Imprimir Fichas Rápidas';
    printBtn.onclick = () => printAtividadesRapidasContent();
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'secondary-button';
    closeBtn.innerHTML = 'Fechar';
    closeBtn.onclick = () => document.body.removeChild(printOverlay);
    
    printActions.appendChild(printBtn);
    printActions.appendChild(closeBtn);
    
    // Monta a estrutura
    printContainer.appendChild(printInstructions);
    printContainer.appendChild(printAtividadesRapidas);
    printPreview.appendChild(closeButton);
    printPreview.appendChild(printContainer);
    printPreview.appendChild(printActions);
    printOverlay.appendChild(printPreview);
    
    // Adiciona ao documento
    document.body.appendChild(printOverlay);
}

// Função para imprimir as fichas rápidas
function printAtividadesRapidasContent() {
    // Verifica se estamos na página correta
    const isAtividadesRapidasPage = window.location.pathname.includes('atividades-rapidas.html') || 
                                   window.location.pathname.endsWith('atividades-rapidas.html');
    if (!isAtividadesRapidasPage) {
        console.log('Função printAtividadesRapidasContent chamada fora da página de atividades rápidas');
        return;
    }
    
    // Cria um iframe para impressão
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.left = '-9999px';
    printFrame.style.top = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    
    document.body.appendChild(printFrame);
    
    const printDocument = printFrame.contentWindow.document;
    
    // Escreve o conteúdo HTML para impressão
    printDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Fichas de Atividade Rápida Scratch - UTFPR</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: white;
                    color: black;
                    font-size: 12pt;
                    line-height: 1.4;
                }
                
                .print-container {
                    max-width: 100%;
                }
                
                .print-instructions {
                    background: #f8f9fa;
                    border: 1px solid #000;
                    padding: 15px;
                    margin-bottom: 20px;
                    page-break-after: avoid;
                }
                
                .print-instructions h2 {
                    color: black;
                    font-size: 16px;
                    margin-bottom: 10px;
                }
                
                .print-instructions ul {
                    margin: 0;
                    padding-left: 20px;
                }
                
                .print-instructions li {
                    font-size: 12px;
                    margin-bottom: 5px;
                    color: black;
                }
                
                .print-section {
                    break-inside: avoid;
                    page-break-inside: avoid;
                    background: white !important;
                    border: 2px solid #000 !important;
                    border-radius: 8px !important;
                    padding: 20px !important;
                    margin: 20px 0 !important;
                    box-shadow: none !important;
                }
                
                .print-section h2 {
                    color: #000 !important;
                    font-size: 18px !important;
                    margin-bottom: 15px !important;
                    border-bottom: 2px solid #000 !important;
                    padding-bottom: 8px !important;
                    page-break-after: avoid;
                }
                
                .print-section h3 {
                    color: #333 !important;
                    font-size: 16px !important;
                    margin: 20px 0 10px 0 !important;
                    border-left: 3px solid #000 !important;
                    padding-left: 10px !important;
                    page-break-after: avoid;
                }
                
                .print-section h4 {
                    color: #555 !important;
                    font-size: 14px !important;
                    margin: 15px 0 8px 0 !important;
                }
                
                .print-section p {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 10px !important;
                    line-height: 1.5 !important;
                }
                
                .print-section ul, .print-section ol {
                    color: black !important;
                    font-size: 12px !important;
                    margin: 10px 0 !important;
                    padding-left: 25px !important;
                }
                
                .print-section li {
                    color: black !important;
                    font-size: 12px !important;
                    margin-bottom: 6px !important;
                    line-height: 1.4 !important;
                }
                
                .ficha-rapida {
                    background: #f8f9fa !important;
                    border: 1px solid #666 !important;
                    padding: 15px !important;
                    margin: 15px 0 !important;
                    border-radius: 6px !important;
                }
                
                .ficha-header {
                    background: #e9ecef !important;
                    border-bottom: 2px solid #666 !important;
                    padding: 10px !important;
                    margin-bottom: 15px !important;
                    border-radius: 4px !important;
                }
                
                .ficha-tempo, .ficha-nivel {
                    background: #ffd200 !important;
                    color: black !important;
                    padding: 5px 10px !important;
                    border-radius: 15px !important;
                    font-size: 11px !important;
                    font-weight: bold !important;
                    display: inline-block !important;
                    margin-right: 10px !important;
                }
                
                .scratch-code {
                    background: #f5f5f5 !important;
                    color: black !important;
                    border: 1px solid #ccc !important;
                    border-left: 4px solid #000 !important;
                    padding: 12px !important;
                    margin: 10px 0 !important;
                    border-radius: 6px !important;
                    font-family: 'Courier New', monospace !important;
                    font-size: 11px !important;
                    white-space: pre-wrap !important;
                    line-height: 1.3 !important;
                }
                
                .dica-box {
                    background: #fff3cd !important;
                    border: 1px solid #666 !important;
                    border-left: 4px solid #000 !important;
                    padding: 12px !important;
                    margin: 10px 0 !important;
                    border-radius: 6px !important;
                }
                
                .cartaz-box {
                    background: white !important;
                    border: 2px solid #000 !important;
                    margin: 15px 0 !important;
                    border-radius: 6px !important;
                }
                
                .cartaz-header {
                    background: #ffd200 !important;
                    color: black !important;
                    padding: 12px !important;
                    font-size: 14px !important;
                    font-weight: bold !important;
                    border-bottom: 2px solid #000 !important;
                }
                
                .cartaz-content {
                    padding: 15px !important;
                }
                
                .checklist {
                    list-style: none !important;
                    padding-left: 0 !important;
                }
                
                .checklist li::before {
                    content: "☐ " !important;
                    margin-right: 8px !important;
                }
                
                @media print {
                    body {
                        padding: 10px;
                    }
                    
                    .print-section {
                        margin: 15px 0 !important;
                        padding: 15px !important;
                    }
                    
                    .print-instructions {
                        margin-bottom: 15px !important;
                    }
                    
                    .print-section h2 {
                        font-size: 16px !important;
                    }
                    
                    .print-section h3 {
                        font-size: 14px !important;
                    }
                    
                    /* Quebra de página antes de cada ficha rápida (exceto a primeira) */
                    .print-section:nth-child(n+3) {
                        page-break-before: always;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-container">
                <div class="print-instructions">
                    <h2>Fichas de Atividade Rápida Scratch - UTFPR</h2>
                    <ul>
                        <li><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</li>
                        <li><strong>Página:</strong> Fichas de Atividade Rápida (15 minutos)</li>
                        <li><strong>Material:</strong> Projeto Scratch na Educação Básica</li>
                        <li><strong>Instruções:</strong> Cada ficha inicia em uma nova página</li>
                    </ul>
                </div>
    `);
    
    // Adiciona cada seção de ficha rápida ao documento de impressão (REMOVENDO NAVEGAÇÃO)
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach((section, index) => {
        const title = section.querySelector('h2') ? section.querySelector('h2').textContent : `Seção ${index + 1}`;
        
        // Remove a seção de navegação e tudo que vem após
        if (title === 'Navegação') {
            return;
        }
        
        const sectionContent = section.cloneNode(true);
        
        // Remove elementos de navegação
        const navCards = sectionContent.querySelector('.card-grid');
        if (navCards) {
            navCards.remove();
        }
        
        const contentHTML = sectionContent.innerHTML;
        
        printDocument.write(`
            <div class="print-section">
                ${contentHTML}
            </div>
        `);
    });
    
    // Finaliza o documento
    printDocument.write(`
            </div>
        </body>
        </html>
    `);
    
    printDocument.close();
    
    // Aguarda o carregamento e imprime
    printFrame.onload = function() {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
        
        // Remove o iframe após a impressão
        setTimeout(() => {
            if (document.body.contains(printFrame)) {
                document.body.removeChild(printFrame);
            }
            const printOverlay = document.querySelector('.print-overlay');
            if (printOverlay) {
                document.body.removeChild(printOverlay);
            }
        }, 500);
    };
}

// =============================================
// INITIALIZE PRINT BUTTONS ON PAGE LOAD
// =============================================

// Adiciona o botão de impressão à página quando carregada
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se estamos na página de cartões scratch
    const isCartoesPage = window.location.pathname.includes('cartoes-scratch.html') || 
                         window.location.pathname.endsWith('cartoes-scratch.html');
    
    // Verifica se estamos na página de planos de aula
    const isPlanosPage = window.location.pathname.includes('planos-aula.html') || 
                        window.location.pathname.endsWith('planos-aula.html');

    // Verifica se estamos na página de sugestões de atividades
    const isSugestoesPage = window.location.pathname.includes('sugestoes-atividades.html') || 
                           window.location.pathname.endsWith('sugestoes-atividades.html');

    // Verifica se estamos na página de atividades rápidas
    const isAtividadesRapidasPage = window.location.pathname.includes('atividades-rapidas.html') || 
                                   window.location.pathname.endsWith('atividades-rapidas.html');

    // Verifica se estamos na página de fichas de atividades
    const isFichasPage = window.location.pathname.includes('fichas-atividades.html') || 
                        window.location.pathname.endsWith('fichas-atividades.html');

    // Verifica se estamos na página de projetos didáticos
    const isProjetosPage = window.location.pathname.includes('projetos-didaticos.html') || 
                          window.location.pathname.endsWith('projetos-didaticos.html');

    // Verifica se estamos na página de modelos de projetos
    const isModelosPage = window.location.pathname.includes('modelos-projetos.html') || 
                         window.location.pathname.endsWith('modelos-projetos.html');

    // Verifica se estamos na página de mundo digital
    const isMundoDigitalPage = window.location.pathname.includes('mundo-digital.html') || 
                              window.location.pathname.endsWith('mundo-digital.html');

    // Verifica se estamos na página de primeiros passos
    const isPrimeirosPassosPage = window.location.pathname.includes('primeiros-passos.html') || 
                                 window.location.pathname.endsWith('primeiros-passos.html');

    // Verifica se estamos na página de materiais complementares
    const isMateriaisPage = window.location.pathname.includes('materiais-complementares.html') || 
                           window.location.pathname.endsWith('materiais-complementares.html');

    // Verifica se estamos na página inicial (index.html)
    const isIndexPage = window.location.pathname.includes('index.html') || 
                       window.location.pathname === '/' || 
                       window.location.pathname.endsWith('/');

    // BOTÃO PARA PÁGINA INICIAL (index.html)
    if (isIndexPage) {
        // Cria e adiciona o botão de impressão específico para a página inicial
        const printButton = document.createElement('button');
        printButton.className = 'print-button';
        printButton.innerHTML = '🖨️ Imprimir Cartilha';
        printButton.onclick = showPrintPreviewIndex;
        printButton.style.margin = '20px 0';
        printButton.style.display = 'block';
        printButton.style.marginLeft = 'auto';
        printButton.style.marginRight = 'auto';
        
        // Adiciona o botão após o page-header
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.parentNode.insertBefore(printButton, pageHeader.nextSibling);
        }
    }

    // BOTÃO PARA CARTÕES SCRATCH (apenas na página cartoes-scratch.html)
    if (isCartoesPage) {
        // Cria e adiciona o botão de impressão para cartões
        const printButton = document.createElement('button');
        printButton.className = 'print-button';
        printButton.innerHTML = '🖨️ Imprimir Cartões';
        printButton.onclick = showPrintPreview;
        
        // Adiciona o botão após o primeiro content-section
        const firstSection = document.querySelector('.content-section');
        if (firstSection) {
            firstSection.parentNode.insertBefore(printButton, firstSection.nextSibling);
        }
    }
    
    // BOTÃO PARA PLANOS DE AULA (apenas na página planos-aula.html)
    if (isPlanosPage) {
        // Cria e adiciona o botão de impressão específico para planos de aula
        const printButton = document.createElement('button');
        printButton.className = 'print-button';
        printButton.innerHTML = '🖨️ Imprimir Planos de Aula';
        printButton.onclick = showPrintPreviewLessonPlans;
        printButton.style.margin = '20px 0';
        printButton.style.display = 'block';
        printButton.style.marginLeft = 'auto';
        printButton.style.marginRight = 'auto';
        
        // Adiciona o botão após o page-header
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.parentNode.insertBefore(printButton, pageHeader.nextSibling);
        }
    }
    
    // BOTÃO PARA SUGESTÕES DE ATIVIDADES (apenas na página sugestoes-atividades.html)
    if (isSugestoesPage) {
        // Cria e adiciona o botão de impressão específico para sugestões de atividades
        const printButton = document.createElement('button');
        printButton.className = 'print-button';
        printButton.innerHTML = '🖨️ Imprimir Sugestões de Atividades';
        printButton.onclick = showPrintPreviewSugestoesAtividades;
        printButton.style.margin = '20px 0';
        printButton.style.display = 'block';
        printButton.style.marginLeft = 'auto';
        printButton.style.marginRight = 'auto';
        
        // Adiciona o botão após o page-header
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.parentNode.insertBefore(printButton, pageHeader.nextSibling);
        }
    }
    
    // BOTÃO PARA ATIVIDADES RÁPIDAS (apenas na página atividades-rapidas.html)
    if (isAtividadesRapidasPage) {
        // Cria e adiciona o botão de impressão específico para fichas rápidas
        const printButton = document.createElement('button');
        printButton.className = 'print-button';
        printButton.innerHTML = '🖨️ Imprimir Fichas Rápidas';
        printButton.onclick = showPrintPreviewAtividadesRapidas;
        printButton.style.margin = '20px 0';
        printButton.style.display = 'block';
        printButton.style.marginLeft = 'auto';
        printButton.style.marginRight = 'auto';
        
        // Adiciona o botão após o page-header
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.parentNode.insertBefore(printButton, pageHeader.nextSibling);
        }
    }
    
    // BOTÃO PARA FICHAS DE ATIVIDADES (apenas na página fichas-atividades.html)
    if (isFichasPage) {
        // Cria e adiciona o botão de impressão específico para fichas de atividades
        const printButton = document.createElement('button');
        printButton.className = 'print-button';
        printButton.innerHTML = '🖨️ Imprimir Fichas de Atividades';
        printButton.onclick = showPrintPreviewFichasAtividades;
        printButton.style.margin = '20px 0';
        printButton.style.display = 'block';
        printButton.style.marginLeft = 'auto';
        printButton.style.marginRight = 'auto';
        
        // Adiciona o botão após o page-header
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.parentNode.insertBefore(printButton, pageHeader.nextSibling);
        }
    }
    
    // BOTÃO PARA PROJETOS DIDÁTICOS (apenas na página projetos-didaticos.html)
    if (isProjetosPage) {
        // Cria e adiciona o botão de impressão específico para projetos didáticos
        const printButton = document.createElement('button');
        printButton.className = 'print-button';
        printButton.innerHTML = '🖨️ Imprimir Projetos Didáticos';
        printButton.onclick = showPrintPreviewProjetosDidaticos;
        printButton.style.margin = '20px 0';
        printButton.style.display = 'block';
        printButton.style.marginLeft = 'auto';
        printButton.style.marginRight = 'auto';
        
        // Adiciona o botão após o page-header
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.parentNode.insertBefore(printButton, pageHeader.nextSibling);
        }
    }
    
    // BOTÃO PARA MODELOS DE PROJETOS (apenas na página modelos-projetos.html)
    if (isModelosPage) {
        // Cria e adiciona o botão de impressão específico para modelos de projetos
        const printButton = document.createElement('button');
        printButton.className = 'print-button';
        printButton.innerHTML = '🖨️ Imprimir Modelos de Projetos';
        printButton.onclick = showPrintPreviewModelosProjetos;
        printButton.style.margin = '20px 0';
        printButton.style.display = 'block';
        printButton.style.marginLeft = 'auto';
        printButton.style.marginRight = 'auto';
        
        // Adiciona o botão após o page-header
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.parentNode.insertBefore(printButton, pageHeader.nextSibling);
        }
    }
    
    // BOTÃO PARA MUNDO DIGITAL (apenas na página mundo-digital.html)
    if (isMundoDigitalPage) {
        // Cria e adiciona o botão de impressão específico para mundo digital
        const printButton = document.createElement('button');
        printButton.className = 'print-button';
        printButton.innerHTML = '🖨️ Imprimir Conteúdo Mundo Digital';
        printButton.onclick = showPrintPreviewMundoDigital;
        printButton.style.margin = '20px 0';
        printButton.style.display = 'block';
        printButton.style.marginLeft = 'auto';
        printButton.style.marginRight = 'auto';
        
        // Adiciona o botão após o page-header
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.parentNode.insertBefore(printButton, pageHeader.nextSibling);
        }
    }
    
    // BOTÃO PARA PRIMEIROS PASSOS (apenas na página primeiros-passos.html)
    if (isPrimeirosPassosPage) {
        // Cria e adiciona o botão de impressão específico para primeiros passos
        const printButton = document.createElement('button');
        printButton.className = 'print-button';
        printButton.innerHTML = '🖨️ Imprimir Primeiros Passos';
        printButton.onclick = showPrintPreviewPrimeirosPassos;
        printButton.style.margin = '20px 0';
        printButton.style.display = 'block';
        printButton.style.marginLeft = 'auto';
        printButton.style.marginRight = 'auto';
        
        // Adiciona o botão após o page-header
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.parentNode.insertBefore(printButton, pageHeader.nextSibling);
        }
    }
    
    // BOTÃO PARA MATERIAIS COMPLEMENTARES (apenas na página materiais-complementares.html)
    if (isMateriaisPage) {
        // Cria e adiciona o botão de impressão específico para materiais complementares
        const printButton = document.createElement('button');
        printButton.className = 'print-button';
        printButton.innerHTML = '🖨️ Imprimir Materiais Complementares';
        printButton.onclick = showPrintPreviewMateriaisComplementares;
        printButton.style.margin = '20px 0';
        printButton.style.display = 'block';
        printButton.style.marginLeft = 'auto';
        printButton.style.marginRight = 'auto';
        
        // Adiciona o botão após o page-header
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.parentNode.insertBefore(printButton, pageHeader.nextSibling);
        }
    }
});
