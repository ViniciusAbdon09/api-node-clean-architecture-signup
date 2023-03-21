import { app } from "./config/app"
import env from "./config/env";

// O Correto aqui é somente startar o server após a conexao com o banco.
app.listen(env.port, () => {
  console.log('server running at http://localhost:5050')
})
