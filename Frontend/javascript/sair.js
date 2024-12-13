document.addEventListener('DOMContentLoaded', () => {
    const sairBtn = document.getElementById('sair-btn');

    sairBtn.addEventListener('click', async () => {
        try {
            // Faz a requisição à API de logout
            const response = await fetch('http://localhost:2000/api/logout', { 
                method: 'POST' 
            });

            if (!response.ok) {
                throw new Error('Erro ao fazer logout');
            }

            // Limpa os dados locais após logout bem-sucedido
            localStorage.removeItem('userId');
            localStorage.removeItem('tipo');

            // Redireciona para a página de login
            window.location.href = '../index.html';
        } catch (error) {
            console.error('Erro ao sair:', error);
            alert('Não foi possível sair. Tente novamente.');
        }
    });
});