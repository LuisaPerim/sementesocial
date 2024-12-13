document.addEventListener('DOMContentLoaded', async () => {
    const voluntarioId = localStorage.getItem('userId'); // Assumindo que o ID do voluntário está salvo no localStorage
    const avatarImg = document.querySelector('.avatar img'); // Seleciona o elemento da imagem do avatar

    if (!voluntarioId) {
        alert('Erro: ID do voluntário não encontrado. Por favor, faça login novamente.');
        window.location.href = '../pages/login.html';
        return;
    }
    
    // Função para carregar os dados do voluntário
    async function carregarVoluntario() {
        try {
            const response = await fetch(`http://localhost:2000/api/voluntarios/${voluntarioId}`);
            if (!response.ok) {
                throw new Error('Erro ao carregar dados do voluntário');
            }

            const voluntario = await response.json();

            // Atualizar a imagem do avatar
            if (voluntario.foto) {
                avatarImg.src = `data:image/png;base64,${voluntario.foto}`;
            } else {
                avatarImg.src = '../images/default-avatar.png'; // Imagem padrão caso não haja foto
            }
        } catch (error) {
            console.error('Erro ao carregar os dados do voluntário:', error);
            alert('Não foi possível carregar os dados do voluntário.');
        }
    }

    // Carrega os dados do voluntário ao abrir a página
    carregarVoluntario();
});