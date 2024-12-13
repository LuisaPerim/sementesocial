document.addEventListener('DOMContentLoaded', () => {
    // Recupera o ID e o tipo do usuário do localStorage
    const ongId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');

    // Verifica se o usuário é uma ONG
    if (userType !== 'ong') {
        alert('Acesso restrito. Apenas ONGs podem acessar esta página.');
        window.location.href = '../index.html';
        return;
    }

    if (!ongId) {
        alert('Erro: ID da ONG não encontrado. Por favor, faça login novamente.');
        window.location.href = '../index.html';
        return;
    }

    // Função para carregar o header com o avatar da ONG
    async function carregarHeader() {
        try {
            const avatarImg = document.querySelector('.avatar img');

            if (avatarImg) {
                const ongResponse = await fetch(`http://localhost:2000/api/ongs/${ongId}`);
                if (!ongResponse.ok) throw new Error('Erro ao buscar dados da ONG');

                const ongData = await ongResponse.json();

                avatarImg.src = ongData.foto
                    ? `data:image/png;base64,${ongData.foto}`
                    : '../images/avatar.png'; // Avatar padrão
            }
        } catch (error) {
            console.error('Erro ao carregar o avatar da ONG:', error);
            alert('Não foi possível carregar o avatar.');
        }
    }

    // Função para carregar os voluntários com match (apenas na home da ONG)
    async function carregarMatches() {
        const voluntariosList = document.getElementById('voluntarios-list');

        // Verifica se a lista de voluntários existe na página
        if (!voluntariosList) return;

        try {
            const matchesResponse = await fetch(`http://localhost:2000/api/matches/${ongId}`);
            if (!matchesResponse.ok) throw new Error('Erro ao buscar voluntários com match');

            const matchesData = await matchesResponse.json();

            voluntariosList.innerHTML = matchesData.map(voluntario => `
                <div class="voluntario-card">
                    <img src="data:image/png;base64,${voluntario.foto || ''}" alt="Foto do Voluntário">
                    <h3>${voluntario.nome}</h3>
                    <p>${voluntario.biografia || 'Sem biografia disponível'}</p>
                    <p><strong>Contato:</strong> ${voluntario.contato_email || 'Sem contato'}</p>
                </div>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar os voluntários:', error);
            alert('Não foi possível carregar a lista de voluntários.');
        }
    }

    // Carregar o header (avatar)
    carregarHeader();

    // Carregar os voluntários (apenas se estiver na página de home da ONG)
    carregarMatches();
});