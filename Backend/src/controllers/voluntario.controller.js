import db from '../db/mysql.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('foto');

// Cadastro de Voluntário
export const cadastrarVoluntario = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer upload da imagem', error: err });
    }

    // Dados do formulário
    const {
      usuario_id,
      nome,
      biografia,
      dt_nasc,
      contato_telefone,
      contato_email,
      endereco_estado,
      endereco_cidade,
      endereco_endereco,
    } = req.body;

    // Verifica se uma foto foi enviada
    const foto = req.file ? req.file.buffer : null; // Armazena a imagem como buffer no banco

    try {
      // Salvar no banco de dados
      await db.query(
        `INSERT INTO voluntarios (usuario_id, nome, biografia, dt_nasc, contato_telefone, contato_email, endereco_estado, endereco_cidade, endereco_endereco, foto)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          usuario_id,
          nome,
          biografia,
          dt_nasc,
          contato_telefone,
          contato_email,
          endereco_estado,
          endereco_cidade,
          endereco_endereco,
          foto,
        ]
      );

      res.status(201).json({ message: 'Perfil de voluntário cadastrado com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao cadastrar perfil de voluntário' });
    }
  });
};

// Atualizar Voluntário
export const atualizarVoluntario = async (req, res) => {
    const { usuario_id, nome, biografia, dt_nasc, contato_telefone, contato_email, endereco_estado, endereco_cidade, endereco_endereco, foto } = req.body;
  
    try {
      await db.query(
        `UPDATE voluntarios SET nome = ?, biografia = ?, dt_nasc = ?, contato_telefone = ?, contato_email = ?, endereco_estado = ?, endereco_cidade = ?, endereco_endereco = ?, foto = ?
         WHERE usuario_id = ?`,
        [nome, biografia, dt_nasc, contato_telefone, contato_email, endereco_estado, endereco_cidade, endereco_endereco, foto, usuario_id]
      );
  
      res.status(200).json({ message: 'Voluntário atualizado com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar voluntário' });
    }
};
  
// Deletar Voluntário
export const deletarVoluntario = async (req, res) => {
  const { id } = req.params;

  try {
      // Excluir o voluntário do banco de dados
      await db.query('DELETE FROM voluntarios WHERE usuario_id = ?', [id]);

      // Opcional: Também excluir da tabela de matches ou qualquer outra tabela relacionada
      await db.query('DELETE FROM `match` WHERE id_voluntario = ?', [id]);

      // Opcional: Também excluir da tabela de matches ou qualquer outra tabela relacionada
      await db.query('DELETE FROM usuarios WHERE id = ?', [id]);

      res.status(200).json({ message: 'Conta excluída com sucesso' });
  } catch (error) {
      console.error('Erro ao excluir conta:', error);
      res.status(500).json({ message: 'Erro ao excluir conta' });
  }
};

//Função para fazer o match
export const criarMatch = async (req, res) => {
  const { id_voluntario, id_ong } = req.body;

  // Verifica se os dados necessários foram enviados
  if (!id_voluntario || !id_ong) {
      return res.status(400).json({ message: 'ID do voluntário e da ONG são obrigatórios.' });
  }

  try {
      // Verifica se o match já existe no banco de dados
      const [matchExistente] = await db.query(
          `SELECT * FROM \`match\` WHERE id_voluntario = ? AND id_ong = ?`,
          [id_voluntario, id_ong]
      );

      if (matchExistente.length > 0) {
          return res.status(409).json({ message: 'Match já existe.' });
      }

      // Insere o novo match no banco de dados
      await db.query(
          `INSERT INTO \`match\` (id_voluntario, id_ong) VALUES (?, ?)`,
          [id_voluntario, id_ong]
      );

      res.status(201).json({ message: 'Match criado com sucesso.' });
  } catch (error) {
      console.error('Erro ao criar match:', error);
      res.status(500).json({ message: 'Erro ao criar match.' });
  }
};

//função para remover o match
export const removerMatch = async(req,res)=>{
  const { id_voluntario, id_ong } = req.body;

    if (!id_voluntario || !id_ong) {
        return res.status(400).json({ message: 'Dados insuficientes para remover o match.' });
    }

    try {
        const [result] = await db.query(
            'DELETE FROM \`match\` WHERE id_voluntario = ? AND id_ong = ?',
            [id_voluntario, id_ong]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Match não encontrado.' });
        }

        res.status(200).json({ message: 'Match removido com sucesso.' });
    } catch (error) {
        console.error('Erro ao remover o match:', error);
        res.status(500).json({ message: 'Erro ao remover o match.' });
    }
}

// Função para obter os matches de um voluntário
export const obterMatchesVoluntario = async (req, res) => {
  const { id_voluntario } = req.params;

  try {
      // Consulta ao banco para buscar os matches do voluntário
      const [result] = await db.query(
          `SELECT 
                o.foto, 
                o.nome, 
                o.endereco_cidade, 
                o.endereco_estado, 
                o.endereco_endereco,
                o.categoria, 
                o.contato_email,
                o.contato_telefone,
                o.nome_responsavel,
                o.usuario_id
            FROM \`match\` m
            INNER JOIN ongs o ON m.id_ong = o.usuario_id
            WHERE m.id_voluntario = ?`,
          [id_voluntario]
      );

      // Converte a foto de cada ONG para base64, caso exista
      const matches = result.map(ong => ({
        ...ong,
        foto: ong.foto ? ong.foto.toString('base64') : null,
      }));

      // Retorna a lista de ONGs que deram match com o voluntário
      res.status(200).json(matches);
  } catch (error) {
      console.error('Erro ao buscar matches do voluntário:', error);
      res.status(500).json({ message: 'Erro ao buscar matches do voluntário.' });
  }
};

//Função para obter dados do voluntário
export const obterDadosVoluntario = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT 
          nome, 
          dt_nasc, 
          contato_telefone, 
          contato_email, 
          biografia, 
          endereco_estado, 
          endereco_cidade, 
          endereco_endereco, 
          foto
       FROM voluntarios 
       WHERE usuario_id = ?`,
      [id]
  );

      if (rows.length === 0) {
          return res.status(404).json({ message: 'Voluntário não encontrado' });
      }

      const voluntario = rows[0];

      // Converter a foto para base64, se existir
      if (voluntario.foto) {
          voluntario.foto = voluntario.foto.toString('base64');
      }

      res.status(200).json(voluntario);
  } catch (error) {
      console.error('Erro ao buscar dados do voluntário:', error);
      res.status(500).json({ message: 'Erro ao buscar dados do voluntário' });
  }
};

export const atualizarDadosVoluntario = (req, res) => {
  upload(req, res, async (err) => {
      if (err) {
          return res.status(500).json({ message: 'Erro ao fazer upload da imagem', error: err });
      }

      const { id } = req.params; // ID do voluntário (usuario_id)
      const {
          nome,
          dt_nasc,
          contato_telefone,
          contato_email,
          biografia,
          endereco_estado,
          endereco_cidade,
          endereco_endereco
      } = req.body;

      const foto = req.file ? req.file.buffer : null; // Obtém a foto se enviada

      try {
          // Verifica se a foto foi enviada para atualizar ou manter a existente
          const [existingData] = await db.query(
              `SELECT foto FROM voluntarios WHERE usuario_id = ?`,
              [id]
          );

          if (existingData.length === 0) {
              return res.status(404).json({ message: 'Voluntário não encontrado' });
          }

          const updatedFoto = foto || existingData[0].foto;

          // Atualiza os dados do voluntário no banco de dados
          await db.query(
              `UPDATE voluntarios
               SET nome = ?, dt_nasc = ?, contato_telefone = ?, contato_email = ?, biografia = ?, endereco_estado = ?, endereco_cidade = ?, endereco_endereco = ?, foto = ?
               WHERE usuario_id = ?`,
              [
                  nome,
                  dt_nasc,
                  contato_telefone,
                  contato_email,
                  biografia,
                  endereco_estado,
                  endereco_cidade,
                  endereco_endereco,
                  updatedFoto,
                  id
              ]
          );

          res.status(200).json({ message: 'Dados do voluntário atualizados com sucesso' });
      } catch (error) {
          console.error('Erro ao atualizar dados do voluntário:', error);
          res.status(500).json({ message: 'Erro ao atualizar dados do voluntário' });
      }
  });
};