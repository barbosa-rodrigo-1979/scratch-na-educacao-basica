// Objetivo: Implementar as funcionalidades necessárias no projeto  - projeto Scratch na Educação Básica
// - Toggle de Tema Escuro/Claro: Permite alternar entre temas e salva a preferência
// - Rolagem Suave: Suaviza a navegação por links âncora
// - Navegação Ativa: Destaca a página atual no menu de navegação
// - Lazy Loading de Imagens: Carrega imagens apenas quando ficam visíveis
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
themeToggle.addEventListener('click', function() {
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
document.addEventListener('DOMContentLoaded', function() {
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
document.addEventListener('DOMContentLoaded', function() {
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
