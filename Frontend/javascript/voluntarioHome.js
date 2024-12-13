document.addEventListener('DOMContentLoaded', async () => {
    const catalogoContainer = document.querySelector('#catalogo .container');
    const id_voluntario = localStorage.getItem('userId'); // ID do voluntário armazenado no localStorage
    const notification = document.getElementById('match-notification');
    const searchInput = document.querySelector('.search-bar input[type="search"]');
    const searchIcon = document.querySelector('.search-bar img');

    if (!id_voluntario) {
        alert('Erro: ID do voluntário não encontrado. Por favor, faça login novamente.');
        window.location.href = '../pages/login.html';
        return;
    }

    // Função para carregar o catálogo de ONGs
    async function carregarCatalogo(nome = '') {
        try {
            // Carregar todas as ONGs (com filtro pelo nome, se fornecido)
            const responseOngs = await fetch(`http://localhost:2000/api/ongs?nome=${encodeURIComponent(nome)}`);
            if (!responseOngs.ok) {
                throw new Error('Erro ao carregar o catálogo de ONGs');
            }
            const ongs = await responseOngs.json();

            // Carregar os matches do voluntário
            const responseMatches = await fetch(`http://localhost:2000/api/matches/voluntario/${id_voluntario}`);
            if (!responseMatches.ok) {
                throw new Error('Erro ao carregar os matches do voluntário');
            }
            const matches = await responseMatches.json();

            // IDs das ONGs com match
            const matchedOngIds = matches.map(match => match.usuario_id);

            // Filtrar as ONGs que ainda não têm match
            const ongsFiltradas = ongs.filter(ong => !matchedOngIds.includes(Number(ong.usuario_id)));

            // Renderizar o catálogo
            if (ongsFiltradas.length === 0) {
                catalogoContainer.innerHTML = `<p style="text-align: center; color: #555;">Não há novas ONGs disponíveis no momento.</p>`;
            } else {
                catalogoContainer.innerHTML = ongsFiltradas.map(ong => `
                    <div class="ong-card">
                        <div class="img-circle">
                            <img src="${ong.foto ? `data:image/png;base64,${ong.foto}` : '../images/default-ong.png'}" alt="Logo da ONG">
                        </div>
                        <p>${ong.nome}</p>
                        <p>${ong.endereco_cidade}, ${ong.endereco_estado}</p>
                        <p>Categoria: ${ong.categoria}</p>
                        <div class="heart">
                            <img 
                                id="heartImage${ong.usuario_id}" 
                                src="../images/coracao_vazado.png" 
                                alt="Coração Vazado" 
                                onclick="realizarMatch(${id_voluntario}, ${ong.usuario_id}, 'heartImage${ong.usuario_id}')"
                            />
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Erro ao carregar o catálogo:', error);
            alert('Não foi possível carregar o catálogo de ONGs.');
        }
    }

    // Função para realizar o match
    window.realizarMatch = async (id_voluntario, ongId, imageId) => {
        const heartImage = document.getElementById(imageId);
        const isMatch = heartImage.src.includes('coracao_preenchido.png');

        // Alterar visualmente antes de fazer a requisição para evitar atrasos
        heartImage.src = isMatch
            ? '../images/coracao_vazado.png'
            : '../images/coracao_preenchido.png';

        try {
            const response = await fetch('http://localhost:2000/api/matches', {
                method: isMatch ? 'DELETE' : 'POST', // POST para criar, DELETE para remover
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_voluntario: id_voluntario, id_ong: ongId }),
            });

            if (!response.ok) {
                throw new Error(isMatch ? 'Erro ao remover o match' : 'Erro ao criar o match');
            }

            const data = await response.json();
            console.log(isMatch ? 'Match removido com sucesso!' : 'Match criado com sucesso!', data);

            // Exibir notificação apenas para novos matches
            if (!isMatch) {
                notification.classList.add('show');
                notification.classList.remove('hidden');

                // Ocultar a notificação após 3 segundos
                setTimeout(() => {
                    notification.classList.add('hidden');
                    notification.classList.remove('show');
                }, 3000);
            }
        } catch (error) {
            console.error('Erro ao realizar o match:', error);

            // Reverte visualmente em caso de erro
            heartImage.src = isMatch
                ? '../images/coracao_preenchido.png'
                : '../images/coracao_vazado.png';

            alert(isMatch ? 'Erro ao remover o match. Tente novamente.' : 'Erro ao criar o match. Tente novamente.');
        }
    };

    // Eventos de pesquisa
    searchIcon.addEventListener('click', () => {
        const nome = searchInput.value.trim();
        carregarCatalogo(nome);
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const nome = searchInput.value.trim();
            carregarCatalogo(nome);
        }
    });

    // Carregar catálogo ao carregar a página
    carregarCatalogo();
});
