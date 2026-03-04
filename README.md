----------------------------------
ESPANHOL
----------------------------------

## PRUEBA SPS REACT

- Crear un CRUD de usuarios

## Reglas

- Crear la página de inicio de sesión (signIn) para autenticar al usuario (usar el usuario previamente registrado para validar).
- Se puede utilizar cualquier tipo de almacenamiento para guardar el token.
- Solo será posible registrar y/o visualizar usuarios si el usuario está autenticado.
- Consumir la API creada anteriormente (test-sps-server).


----------------------------------
PORTUGUÊS
----------------------------------

# SPS REACT TEST

- Criar um CRUD de usuários

# Regras

- Criar a página de signIn para fazer a autenticação do usuário (Usar o usuário previamente cadastrado para validar)
- Pode usar qualquer tipo de storage para guardar o token
- Só será possível cadastrar e/ou visualizar os usuários se estiver autenticado
- Chamar a API que foi criada anteriormente (test-sps-server)

---

## Como utilizar / Cómo utilizar

### Pré-requisitos / Prerrequisitos

- [Node.js](https://nodejs.org/) v20+
- npm ou yarn
- O servidor `test-sps-server` deve estar rodando / El servidor `test-sps-server` debe estar corriendo

### Instalação / Instalación

```bash
npm install
```

### Variáveis de Ambiente / Variables de Entorno

Crie um arquivo `.env` na raiz do projeto / Cree un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_SERVER_URL=http://localhost:3000
```

> **Nota / Nota:** Quando executado via Docker com o `docker-compose.yml` da pasta pai, a URL da API
> é configurada automaticamente para `http://localhost:3000`.
> Cuando se ejecuta vía Docker con el `docker-compose.yml` de la carpeta padre, la URL de la API
> se configura automáticamente a `http://localhost:3000`.

### Executar em desenvolvimento / Ejecutar en desarrollo

```bash
npm start
```

A aplicação iniciará em `http://localhost:3001` (ou na porta disponível).
La aplicación se iniciará en `http://localhost:3001` (o en el puerto disponible).

### Build para produção / Build para producción

```bash
npm run build
```

Os arquivos serão gerados na pasta `build/`.
Los archivos serán generados en la carpeta `build/`.

### Login padrão / Login por defecto

Use as credenciais do admin criado no server / Use las credenciales del admin creado en el servidor:

```json
{
  "email": "admin@spsgroup.com.br",
  "password": "1234"
}
```

---

## Docker

### Build e execução individual / Build y ejecución individual

```bash
docker build -t test-sps-react .
docker run -p 3001:80 test-sps-react
```

> **Importante:** Ao executar individualmente, certifique-se de que o server está acessível
> em `http://localhost:3000`.
> Al ejecutar individualmente, asegúrese de que el servidor esté accesible
> en `http://localhost:3000`.

### Com docker-compose (server + react) / Con docker-compose (server + react)

Para executar ambos os projetos juntos, clone os dois repositórios e crie um `docker-compose.yml` no diretório pai.
Para ejecutar ambos proyectos juntos, clone ambos repositorios y cree un `docker-compose.yml` en el directorio padre.

A estrutura esperada é / La estructura esperada es:

```
sps/
├── docker-compose.yml    ← criar este arquivo / crear este archivo
├── test-sps-server/
└── test-sps-react/
```

Crie o arquivo `docker-compose.yml` com o seguinte conteúdo / Cree el archivo `docker-compose.yml` con el siguiente contenido:

```yaml
services:
  api:
    build: ./test-sps-server
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - JWT_SECRET=sps-jwt-secret-change-in-production
      - JWT_REFRESH_SECRET=sps-refresh-secret-change-in-production
      - JWT_EXPIRES_IN=15m
      - JWT_REFRESH_EXPIRES_IN=7d
    volumes:
      - sqlite-data:/app/data
    restart: unless-stopped

  web:
    build:
      context: ./test-sps-react
      args:
        - REACT_APP_SERVER_URL=http://localhost:3000
    ports:
      - "3001:80"
    depends_on:
      - api
    restart: unless-stopped

volumes:
  sqlite-data:
```

Em seguida, execute / Luego ejecute:

```bash
docker compose up --build
```

| Serviço / Servicio | URL                          |
| ------------------- | ---------------------------- |
| API (Server)        | http://localhost:3000         |
| Swagger             | http://localhost:3000/api-docs |
| Frontend (React)    | http://localhost:3001         |
