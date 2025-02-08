
# Trabalho de Back-End

Autores

- [@Pedro-Landgraf](https://github.com/Pedro-Landgraf) - Pedro Landgraf

- [@Jackoki](https://github.com/Jackoki/projeto-backend) - Gabriel Kenji

Para o funcionamento e compilação do código, basta rodar apenas:
 

## Instalação

Para instalação do projeto, basta acionar:

```bash
  npm install
```

## Documentação

A documentação da API foi criada a partir do Swagger Auto-Gen, sendo sua rota: localhost:4000/docs para sua visualização.




## Funcionalidades

Nesse trabalho realizamos o cumprimento dos requistos passados, sendo eles:

- Tecnologias: Foi utilizado apenas as tecnologias passadas nas aulas, como o Express, JWT, Swagger, DotEnv e o uso de Middlewares. 
- Sistema: Os objetos são controlados em formato JSON e as funcionalidadess são implementadas em formato de API REST, realizando os testes pelo Postman.
- Usuários e Autenticação: Realização de sistema de usuários por meio de um arquivo como banco de dados. Controle feito por token JWT e proteção de rotas por permissão. Criação de todas as rotas CRUD como pedido.
- Sistema CRUD: Realização de 2 sistemas CRUD, sendo um para paises e outro para cidades, tendo relação pelo ID no arquivo de banco de dados. Existe o controle de acesso por login e protação de rotas por permissão.
- Tratamento de Erros: Criação de tratamento de erros e exceções dependendo do que o usuário realizar, por exemplo quando procurar por uma rota inexistente ou ação inválida.
- Páginação: O sistema CRUD permite o recebimento de 2 parâmetros de páginação, limite e página, se esses valores não forem definidos, o limite será 5 e a página será 1.
- Lógica de Negócio: Criação de rota GET para instação de usuário administrador no sistema. Rota /docs para visualização da documentação gerada pelo Swagger. Utilização do arquivo .env para criptografia do token. Implementação de clean-code e comentários no código.

