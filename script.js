// Objetivo: Implementar as funcionalidades necessárias no projeto  - projeto Scratch na Educação Básica
// - Toggle de Tema Escuro/Claro: Permite alternar entre temas e salva a preferência
// - Rolagem Suave: Suaviza a navegação por links âncora
// - Navegação Ativa: Destaca a página atual no menu de navegação
// - Lazy Loading de Imagens: Carrega imagens apenas quando ficam visíveis
// - Funcionalidade de Impressão: Permite imprimir os cartões Scratch
// Desenvolvido por: Gisele Nunes, Rodrigo Barbosa
// Data: Segundo semestre de 2025 

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
// Se o tema salvo for 'dark' OU (não houver tema salvo E o sistema preferir tema escuro)
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
    
    // Coleta todos os cartões da página
    const allCards = document.querySelectorAll('.nav-card');
    
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
                    font-size: 12px !important;
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
    
    // Adiciona cada cartão ao documento de impressão
    const allCards = document.querySelectorAll('.nav-card');
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

// Adiciona o botão de impressão à página quando carregada
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se estamos na página de cartões scratch
    if (window.location.pathname.includes('cartoes-scratch.html') || 
        document.querySelector('.nav-card')) {
        
        // Cria e adiciona o botão de impressão
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
});
