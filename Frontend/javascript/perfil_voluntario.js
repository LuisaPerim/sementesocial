document.addEventListener('DOMContentLoaded', () => {
    const voluntarioId = localStorage.getItem('userId');
    const form = document.querySelector('form');
    const excluirContaLink = document.querySelector('.excluirconta');
    const inputs = {
        nome: form.querySelector('input[name="nome"]'),
        dtnasc: form.querySelector('input[name="dtnasc"]'),
        tel: form.querySelector('input[name="tel"]'),
        email: form.querySelector('input[name="email"]'),
        bio: form.querySelector('textarea[name="bio"]'),
        estado: form.querySelector('select[name="estado"]'),
        cidade: form.querySelector('input[name="cidade"]'),
        end: form.querySelector('input[name="end"]'),
        foto: form.querySelector('input[name="foto"]'),
    };

    if (!voluntarioId) {
        alert('Erro: ID do usuário não encontrado. Por favor, faça login novamente.');
        window.location.href = '../pages/login.html';
        return;
    }

     // Função para formatar a data
     function formatarDataISOParaInputDate(dataISO) {
        const data = new Date(dataISO);
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    }

    // Função para carregar os dados do voluntário
    async function carregarDadosVoluntario() {
        try {
            const response = await fetch(`http://localhost:2000/api/voluntarios/${voluntarioId}`);
            if (!response.ok) throw new Error('Erro ao buscar dados do voluntário');
            const data = await response.json();

            inputs.nome.value = data.nome || '';
            inputs.dtnasc.value = data.dt_nasc ? formatarDataISOParaInputDate(data.dt_nasc) : '';
            inputs.tel.value = data.contato_telefone || '';
            inputs.email.value = data.contato_email || '';
            inputs.bio.value = data.biografia || '';
            inputs.estado.value = data.endereco_estado || '';
            inputs.cidade.value = data.endereco_cidade || '';
            inputs.end.value = data.endereco_endereco || '';
        } catch (error) {
            console.error('Erro ao carregar dados do voluntário:', error);
            alert('Não foi possível carregar os dados do voluntário.');
        }
    }

    // Função para atualizar os dados do voluntário
    async function atualizarDadosVoluntario(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('usuario_id', voluntarioId); // Adiciona o ID
        formData.append('nome', inputs.nome.value);
        formData.append('dt_nasc', inputs.dtnasc.value);
        formData.append('contato_telefone', inputs.tel.value);
        formData.append('contato_email', inputs.email.value);
        formData.append('biografia', inputs.bio.value);
        formData.append('endereco_estado', inputs.estado.value);
        formData.append('endereco_cidade', inputs.cidade.value);
        formData.append('endereco_endereco', inputs.end.value);

        if (inputs.foto.files[0]) {
            formData.append('foto', inputs.foto.files[0]);
        }

        try {
            const response = await fetch(`http://localhost:2000/api/voluntarios/${voluntarioId}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) throw new Error('Erro ao atualizar os dados do voluntário');
            alert('Dados atualizados com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar os dados do voluntário:', error);
            alert('Não foi possível atualizar os dados do voluntário.');
        }
    }

    async function excluirConta() {
        const confirmar = confirm('Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.');
        if (!confirmar) return;

        try {
            const response = await fetch(`http://localhost:2000/api/voluntarios/${voluntarioId}`, {
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

    carregarDadosVoluntario();
    form.addEventListener('submit', atualizarDadosVoluntario);
});
