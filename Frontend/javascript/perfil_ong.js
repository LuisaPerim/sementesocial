document.addEventListener('DOMContentLoaded', () => {
    const ongId = localStorage.getItem('userId');
    const excluirContaLink = document.querySelector('.excluirconta');
    const form = document.querySelector('form');
    const inputs = {
        nome: form.querySelector('input[name="nome"]'),
        tel: form.querySelector('input[name="tel"]'),
        email: form.querySelector('input[name="email"]'),
        resp: form.querySelector('input[name="resp"]'),
        cnpj: form.querySelector('input[name="cnpj"]'),
        cat: form.querySelector('select[name="cat"]'),
        estado: form.querySelector('select[name="estado"]'),
        cidade: form.querySelector('input[name="cidade"]'),
        end: form.querySelector('input[name="end"]'),
        foto: form.querySelector('input[name="foto"]'),
    };

    if (!ongId) {
        alert('Erro: ID do usuário não encontrado. Por favor, faça login novamente.');
        window.location.href = '../pages/login.html';
        return;
    }

    // Função para carregar os dados da ONG
    async function carregarDadosOng() {
        try {
            const response = await fetch(`http://localhost:2000/api/ongs/${ongId}`);
            if (!response.ok) throw new Error('Erro ao buscar dados da ONG');
            const data = await response.json();

            inputs.nome.value = data.nome || '';
            inputs.tel.value = data.contato_telefone || '';
            inputs.email.value = data.contato_email || '';
            inputs.resp.value = data.nome_responsavel || '';
            inputs.cnpj.value = data.cnpj || '';
            inputs.cat.value = data.categoria || '';
            inputs.estado.value = data.endereco_estado || '';
            inputs.cidade.value = data.endereco_cidade || '';
            inputs.end.value = data.endereco_endereco || '';
        } catch (error) {
            console.error('Erro ao carregar dados da ONG:', error);
            alert('Não foi possível carregar os dados da ONG.');
        }
    }

    // Função para atualizar os dados da ONG
    async function atualizarDadosOng(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('usuario_id', ongId); // Adiciona o ID
        formData.append('nome', inputs.nome.value);
        formData.append('contato_telefone', inputs.tel.value);
        formData.append('contato_email', inputs.email.value);
        formData.append('nome_responsavel', inputs.resp.value);
        formData.append('categoria', inputs.cat.value);
        formData.append('endereco_estado', inputs.estado.value);
        formData.append('endereco_cidade', inputs.cidade.value);
        formData.append('endereco_endereco', inputs.end.value);

        if (inputs.foto.files[0]) {
            formData.append('foto', inputs.foto.files[0]);
        }

        try {
            const response = await fetch(`http://localhost:2000/api/ongs/${ongId}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) throw new Error('Erro ao atualizar os dados da ONG');
            alert('Dados atualizados com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar os dados da ONG:', error);
            alert('Não foi possível atualizar os dados da ONG.');
        }
    }

    async function excluirConta() {
        const confirmar = confirm('Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.');
        if (!confirmar) return;

        try {
            const response = await fetch(`http://localhost:2000/api/ongs/${ongId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir conta');
            }

            alert('Sua conta foi excluída com sucesso.');
            
            // Limpa o localStorage e redireciona para a página de login
            localStorage.clear();
            window.location.href = '../index.html';
        } catch (error) {
            console.error('Erro ao excluir conta:', error);
            alert('Não foi possível excluir sua conta. Tente novamente.');
        }
    }

    // Adiciona o evento de clique no link de exclusão
    excluirContaLink.addEventListener('click', (event) => {
        event.preventDefault();
        excluirConta();
    });

    carregarDadosOng();
    form.addEventListener('submit', atualizarDadosOng);
});
