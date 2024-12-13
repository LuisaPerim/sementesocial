import db from '../db/mysql.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('foto');

// Cadastro de Usuário ONG
export const cadastrarOng = async (req, res) => {
  upload(req,res, async(err) =>{
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer upload da imagem' });
    }
    const { usuario_id, nome, cnpj, nome_responsavel, contato_telefone, contato_email, endereco_estado, endereco_cidade, endereco_endereco, categoria } = req.body;
    const foto = req.file ? req.file.buffer : null; // Armazena a imagem como buffer
    try {
      await db.query(
        `INSERT INTO ongs (usuario_id, nome, cnpj, nome_responsavel, contato_telefone, contato_email, endereco_estado, endereco_cidade, endereco_endereco, categoria, foto)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [usuario_id, nome, cnpj, nome_responsavel, contato_telefone, contato_email, endereco_estado, endereco_cidade, endereco_endereco, categoria, foto]
      );

      res.status(201).json({ message: 'Perfil de ONG cadastrado com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao cadastrar perfil de ONG' });
    }
  });
}

// Atualizar ONG
export const atualizarOng = async (req, res) => {
  upload(req, res, async (err) => {
      if (err) {
          return res.status(500).json({ message: 'Erro ao fazer upload da imagem' });
      }

      const { ongId } = req.params; // ID da ONG passado como parâmetro na URL
      const {
          nome,
          contato_telefone,
          contato_email,
          nome_responsavel,
          categoria,
          endereco_estado,
          endereco_cidade,
          endereco_endereco,
      } = req.body;
      const foto = req.file ? req.file.buffer : null;

      try {
          const [ong] = await db.query('SELECT foto FROM ongs WHERE usuario_id = ?', [ongId]);
          if (ong.length === 0) {
            return res.status(404).json({ message: 'ONG não encontrada' });
          }
          
          const query = `
              UPDATE ongs 
              SET nome = ?, contato_telefone = ?, contato_email = ?, nome_responsavel = ?, categoria = ?, 
                  endereco_estado = ?, endereco_cidade = ?, endereco_endereco = ?, foto = ?
              WHERE usuario_id = ?
          `;

          const fotoAtualizada = foto || ong[0].foto;

          await db.query(query, [
              nome,
              contato_telefone,
              contato_email,
              nome_responsavel,
              categoria,
              endereco_estado,
              endereco_cidade,
              endereco_endereco,
              fotoAtualizada,
              ongId,
          ]);

          res.status(200).json({ message: 'Dados da ONG atualizados com sucesso!' });
      } catch (error) {
          console.error('Erro ao atualizar dados da ONG:', error);
          res.status(500).json({ message: 'Erro ao atualizar os dados da ONG' });
      }
  });
};
  
// Deletar ONG
// Deletar Voluntário
export const deletarOng = async (req, res) => {
  const { id } = req.params;

  try {
      // Excluir o voluntário do banco de dados
      await db.query('DELETE FROM ongs WHERE usuario_id = ?', [id]);

      // Opcional: Também excluir da tabela de matches ou qualquer outra tabela relacionada
      await db.query('DELETE FROM `match` WHERE id_ong = ?', [id]);

      // Opcional: Também excluir da tabela de matches ou qualquer outra tabela relacionada
      await db.query('DELETE FROM usuarios WHERE id = ?', [id]);

      res.status(200).json({ message: 'Conta excluída com sucesso' });
  } catch (error) {
      console.error('Erro ao excluir conta:', error);
      res.status(500).json({ message: 'Erro ao excluir conta' });
  }
};


//Função para pegar os dados da ong
export const obterDadosOng = async (req, res) => {
  const { id } = req.params;
  try {
    // Consulta ao banco de dados para obter os dados da ONG
    const [result] = await db.query(
      `SELECT id, nome, cnpj, nome_responsavel, contato_telefone, contato_email, endereco_estado, endereco_cidade, endereco_endereco, categoria, foto
       FROM ongs WHERE usuario_id = ?`,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'ONG não encontrada' });
    }

    const ong = result[0];

    // Converte o buffer de foto para base64, se existir
    if (ong.foto) {
      ong.foto = ong.foto.toString('base64');
    }

    res.status(200).json(ong);
  } catch (error) {
    console.error('Erro ao buscar dados da ONG:', error);
    res.status(500).json({ message: 'Erro ao buscar dados da ONG' });
  }
};

//Função para buscar os voluntários que deram match com a ONG
export const obterMatchesOng = async (req, res) => {
  const { ongId } = req.params;
  console.log(`Recebendo requisição de matches para a ONG com ID: ${ongId}`);
  try {
    // Consulta para obter os voluntários que deram match com a ONG
    const [result] = await db.query(
      `SELECT 
      v.usuario_id AS voluntario_id, 
      v.nome, 
      v.biografia, 
      v.contato_email, 
      v.foto 
   FROM \`match\` m
   INNER JOIN voluntarios v ON m.id_voluntario = v.usuario_id
   WHERE m.id_ong = ?`,
      [ongId]
    );

    if (result.length === 0) {
      console.log(`Nenhum match encontrado para a ONG com ID ${ongId}`);
      return res.status(404).json({ message: 'Nenhum match encontrado para esta ONG' });
    }

    // Converte o buffer da foto para base64 para cada voluntário
    const matches = result.map(voluntario => ({
      ...voluntario,
      foto: voluntario.foto ? voluntario.foto.toString('base64') : null,
    }));

    res.status(200).json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar matches da ONG' });
  }
};

//Função para listar as ongs
export const listarOngs = async (req, res) => {
  const { nome } = req.query; // Captura o parâmetro de busca na query string

  try {
      // Consulta SQL com ou sem filtro de nome
      const sql = `
          SELECT 
              id, 
              usuario_id, 
              nome, 
              categoria, 
              endereco_estado AS endereco_estado, 
              endereco_cidade AS endereco_cidade, 
              foto 
          FROM ongs
          ${nome ? 'WHERE nome LIKE ?' : ''} -- Adiciona a cláusula WHERE se houver nome
      `;

      // Executa a consulta com ou sem parâmetro
      const [ongs] = await db.query(sql, nome ? [`%${nome}%`] : []);

      if (ongs.length === 0) {
          return res.status(404).json({ message: 'Nenhuma ONG encontrada.' });
      }

      // Converte as fotos para base64
      const ongList = ongs.map((ong) => ({
          ...ong,
          foto: ong.foto ? ong.foto.toString('base64') : null,
      }));

      res.status(200).json(ongList);
  } catch (error) {
      console.error('Erro ao listar ONGs:', error);
      res.status(500).json({ message: 'Erro ao listar ONGs.' });
  }
};