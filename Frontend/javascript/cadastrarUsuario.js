document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    // Captura os dados do formulário
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('password').value;
    const tipo = document.querySelector('input[name="cadastro"]:checked').value;

        try {
            // Envia os dados para o backend
            const response = await fetch('http://localhost:2000/api/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: usuario, senha, tipo }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Usuário cadastrado com sucesso!');
                // Salva o usuario_id no localStorage
                if (data.usuarioId) {
                    localStorage.setItem('usuario_id', data.usuarioId);
                }

                // Redirecionar para páginas específicas com base no tipo de cadastro
                if (tipo === 'ONG') {
                    window.location.href = '../pages/ong_cadastro.html';
                } else if (tipo === 'Voluntario') {
                    window.location.href = '../pages/voluntario_cadastro.html';
                }
            } else {
                alert(`Erro: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Ocorreu um erro ao cadastrar o usuário. Tente novamente.');
        }
});

