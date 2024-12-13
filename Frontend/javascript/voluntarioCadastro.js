document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    // Captura os dados do formulário
    const formData = new FormData();
    formData.append('usuario_id', localStorage.getItem('usuario_id')); // Assumindo que o ID do usuário está salvo no localStorage
    formData.append('nome', document.querySelector('input[name="nome"]').value);
    formData.append('dt_nasc', document.querySelector('input[name="dtnasc"]').value);
    formData.append('contato_telefone', document.querySelector('input[name="tel"]').value);
    formData.append('contato_email', document.querySelector('input[name="email"]').value);
    formData.append('endereco_estado', document.querySelector('select[name="estado"]').value);
    formData.append('endereco_cidade', document.querySelector('input[name="cidade"]').value);
    formData.append('endereco_endereco', document.querySelector('input[name="end"]').value);
    formData.append('biografia', document.querySelector('textarea[name="bio"]').value);
    
    // Upload da foto (se selecionada)
    const foto = document.querySelector('input[name="foto"]').files[0];
    if (foto) {
        formData.append('foto', foto);
    }

    try {
        // Envia os dados para o backend
        const response = await fetch('http://localhost:2000/api/cadastrar/voluntario', {
            method: 'POST',
            body: formData, // FormData já cuida do cabeçalho de Content-Type
        });

        const data = await response.json();

        if (response.ok) {
            alert('Cadastro do voluntário realizado com sucesso!');
            window.location.href = '../index.html'; // Redireciona para a página inicial ou qualquer outra página
        } else {
            alert(`Erro: ${data.message}`);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Ocorreu um erro ao cadastrar o voluntário. Tente novamente.');
    }
});