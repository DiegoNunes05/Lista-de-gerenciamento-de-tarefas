Task Manager - Teste Técnico Operand
Descrição do Projeto
Este projeto é uma aplicação de gerenciamento de tarefas simples, desenvolvida como parte de um teste técnico. O foco principal foi a implementação de uma interface de usuário intuitiva e responsiva com Vue.js 3 e Element Plus, além da integração com Firebase para autenticação e persistência de dados.

Funcionalidades Implementadas
1. Gerenciamento de Tarefas
Visualização: Lista de tarefas do usuário logado.
Criação: Formulário para adicionar uma nova tarefa, com título e descrição.
Edição: Possibilidade de editar as tarefas existentes.
Exclusão: Diálogo de confirmação para excluir uma tarefa.
Status: Alteração de status entre "pendente" e "concluída".
2. Autenticação de Usuário
Login: Autenticação de usuários através do Firebase Authentication.
Logout: Botão para sair da conta, com uma mensagem de confirmação.
Registro: Criação de uma nova conta com e-mail e senha.
Recuperação de Senha: Envio de e-mail para redefinição de senha.
3. Interface do Usuário
Utilização do Element Plus para criação dos componentes visuais (inputs, botões, diálogos).
Design responsivo: Funciona bem em dispositivos móveis e desktop.
4. Firebase
Firestore para persistência de tarefas, garantindo que cada usuário veja apenas suas próprias tarefas.
Autenticação via Firebase Authentication.
Tecnologias Utilizadas
Vue.js 3
TypeScript
Element Plus
Firebase (Auth e Firestore)
Tailwind CSS
Vite
Pinia (para gerenciamento de estado)
Vue Router (para navegação)
Como Rodar o Projeto
1. Clonar o Repositório
bash
Copiar código
git clone https://github.com/usuario/repo.git
2. Instalar Dependências
bash
Copiar código
npm install
3. Configurar Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis com suas credenciais do Firebase:

bash
Copiar código
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
4. Rodar o Projeto Localmente
bash
Copiar código
npm run dev
5. Rodar o Build para Produção
bash
Copiar código
npm run build
6. Fazer Deploy
bash
Copiar código
npm run deploy
Deploy
O projeto está hospedado no Firebase e pode ser acessado pelo link abaixo:

Link para o Deploy no Firebase