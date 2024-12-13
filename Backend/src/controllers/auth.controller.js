import dotenv from 'dotenv';
import db from '../db/mysql.js';

dotenv.config();

// Cadastro de Usuário
export const cadastrarUsuario = async (req, res) => {
    const { username, senha, tipo } = req.body;
  
    try {
       // Verifica se o username já existe
       const [existingUser] = await db.query('SELECT id FROM usuarios WHERE username = ?', [username]);

       if (existingUser.length > 0) {
           return res.status(400).json({ message: 'Nome de usuário já está em uso.' });
       }

        const [result] = await db.query(
          'INSERT INTO usuarios (username, senha, tipo) VALUES (?, ?, ?)',
          [username, senha, tipo]
        );
    
        const usuarioId = result.insertId;
    
        res.status(201).json({ message: 'Usuário cadastrado com sucesso', usuarioId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
};
  
export const login = async (req, res) => {
  const { username, senha } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM usuarios WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    const user = rows[0];

    // Verifica diretamente a senha fornecida
    if (senha !== user.senha) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    // Armazena dados do usuário na sessão
    req.session.userId = user.id;
    req.session.tipo = user.tipo;

    res.json({ 
      message: 'Login bem-sucedido', 
      userId: user.id, 
      tipo: user.tipo 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

  
// Rota de Logout
export const logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao fazer logout' });
      }
      res.json({ message: 'Logout bem-sucedido' });
    });
};
  
