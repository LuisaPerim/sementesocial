import express from 'express';
import dotenv from 'dotenv';
import router from './routes/api.js';
import cors from 'cors'; // Importa o pacote CORS
import session from 'express-session';


dotenv.config();
const server = express();

server.use(express.json());

server.use(express.urlencoded({extended:true}));

server.use(cors());

server.get('/ping',(req,res)=>res.json({pong:true}));

server.use(session({
    secret: 'ifprQuedasSession', // Substitua por uma string segura
    resave: false, // Não salva a sessão novamente se não houver modificações
    saveUninitialized: true, // Salva sessões vazias
    cookie: {
      secure: false, // Use `true` se estiver usando HTTPS
      maxAge: 1000 * 60 * 60 // Tempo de vida do cookie (1 hora)
    }
  }));

server.use('/api', router)

server.listen(process.env.PORT, ()=>console.log(`Servidor rodando: http://localhost:2000/ping`));