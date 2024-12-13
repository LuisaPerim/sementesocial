document.addEventListener('DOMContentLoaded', async () => {
    const catalogoMatchesContainer = document.querySelector('#catalogoMatches .container');
    const id_voluntario = localStorage.getItem('userId'); // ID do voluntário armazenado no localStorage

    if (!id_voluntario) {
        alert('Erro: ID do voluntário não encontrado. Por favor, faça login novamente.');
        window.location.href = '../pages/login.html';
        return;
    }

    // Função para carregar os matches realizados
    async function carregarMatches() {
        try {
            const response = await fetch(`http://localhost:2000/api/matches/voluntario/${id_voluntario}`);
            if (!response.ok) {
                throw new Error('Erro ao carregar os matches realizados');
            }

            const matches = await response.json();

            if (matches.length === 0) {
                // Exibe mensagem caso não haja matches
                catalogoMatchesContainer.innerHTML = `
                    <p class="no-matches">Você ainda não tem matches realizados com ONGs.</p>
                `;
                return;
            }

            // Renderizar os matches no catálogo
            catalogoMatchesContainer.innerHTML = matches.map(ong => `
                <div class="ong-card">
                    <div class="img-circle">
                        <img src="${ong.foto ? `data:image/png;base64,${ong.foto}` : '../images/default-ong.png'}" alt="Logo da ONG">
                    </div>
                    <p class="nome">${ong.nome}</p>
                    <p class="endereco">${ong.endereco_cidade}, ${ong.endereco_estado}</p>
                    <p class="endereco">${ong.endereco_endereco}</p>
                    <p class="cat">Categoria: ${ong.categoria}</p>
                    <p><strong>Contato:</strong><p>
                    <p>${ong.contato_email}</p>
                    <p>${ong.contato_telefone}</p>
                    <div class="heart">
                        <img src="../images/coracao_preenchido.png" alt="Coração Preenchido" />
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar os matches realizados:', error);
            alert('Não foi possível carregar os matches realizados.');
        }
    }

    // Carregar os matches ao entrar na página
    carregarMatches();
});