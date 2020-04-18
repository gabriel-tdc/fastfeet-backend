![](https://github.com/gabriel-tdc/fastfeet-frontend/blob/master/src/assets/fastfeet.svg)
# Fast Feet - Backend

### Esta é uma aplicação fictícia utilizada para a certificação da Rocketseat - Bootcamp

#### Como utilizar
Basta realizar o clone do repositório  
`git clone https://github.com/gabriel-tdc/fastfeet-backend`  
  
Realize a instalação das dependências:  
`yarn`  
  
  
A aplicação está escutando a porta 3333, caso precisar utilizar outra porta, configure em `src\server.js`  
A aplicação está utilizando o banco MongoDB (mongodb://localhost:27017/fastfeet) para armazenar as notificações, caso necessário, configure em `src\database\index.js`  
A aplicação está utilizando o banco MySQL (fastfeet) para armazenar os dados, caso necessário, configure em `src\config\database.js`  
  
Utilize a migration para carregar todas as tabelas e usuário de teste:  
`yarn sequelize db:migrate`  
`yarn sequelize db:seed:all`  
  
**Usuário:** admin@fastfeet.com  
**Senha:** 123456  
  
Para executar a aplicação, utilizar o comando:  
`yarn dev` e  
`yarn queue`  

  
  
