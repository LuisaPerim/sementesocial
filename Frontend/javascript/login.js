document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    // Captura os valores do formulário
    const username = document.getElementById('username').value;
    const senha = document.getElementById('password').value;

    try {
        // Envia os dados para o backend
        const response = await fetch('http://localhost:2000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, senha }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Login bem-sucedido!');

            // Salva o ID e o tipo do usuário no localStorage
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userType', data.tipo);

            // Redireciona com base no tipo de usuário
            if (data.tipo === 'ong') {
                window.location.href = './pages/home_ong.html';
            } else if (data.tipo === 'voluntario') {
                window.location.href = './pages/home_voluntario.html';
            } else {
                alert('Tipo de usuário desconhecido.');
            }
        } else {
            alert(`Erro: ${data.message}`);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao tentar fazer login. Tente novamente.');
    }
});