# users-identity-service

Microservice de autenticación e identidad. Proporciona autenticación basada en JWT con endpoints de registro, login y refresh de tokens.

## ✅ Completado

- **Auth service con JWT**: tokens de acceso (1h) y refresh (7d)
- **Bcrypt para seguridad**: hash de contraseñas con sal
- **6 endpoints y tests pasando**:
  - Health check
  - Registro de usuarios con validación
  - Login con credenciales (email/password)
  - Refresh token automático
  - Validación de duplicados
  - Manejo de credenciales inválidas
- **Models TypeScript**: interfaces User y AuthToken
- **Backend CI workflow**: incluido `.github/workflows/backend-ci.yml`
- **Almacenamiento en memoria**: placeholder para PostgreSQL

## Stack

- **Runtime**: Node.js 20 LTS
- **Language**: TypeScript 5.2
- **Framework**: Express 4.18
- **Security**: bcryptjs 2.4 + jsonwebtoken 9.0
- **Testing**: Jest 29.6 + supertest 7.1

## Quick Start

```bash
cd users-identity-service
npm install
npm run dev        # puerto 3002
```

## Run Tests

```bash
npm test           # 6 tests passing
```

## Environment Variables

- `JWT_SECRET`: Secreto para access tokens (default: dev-secret-key-change-in-prod)
- `JWT_REFRESH_SECRET`: Secreto para refresh tokens (default: dev-refresh-secret-change-in-prod)
- `PORT`: Puerto del servicio (default: 3002)

## Endpoints

- `GET /health` - Health check
- `POST /auth/register` - Registrar nuevo usuario
  - Body: `{ email: string, password: string }`
- `POST /auth/login` - Login y obtener tokens
  - Body: `{ email: string, password: string }`
  - Response: `{ accessToken, refreshToken }`
- `POST /auth/refresh` - Refrescar access token
  - Body: `{ refreshToken: string }`
  - Response: `{ accessToken }`
- `GET /auth/profile` - Obtener perfil (requiere Bearer token)

## Flujo de autenticación

1. Usuario se registra con email y contraseña
2. Contraseña se hashea con bcrypt (10 rondas)
3. User recibe access token (1h) + refresh token (7d)
4. Access token usado en requests posteriores
5. Cuando expira, usar refresh token para obtener nuevo access token

## Build & Deploy

```bash
npm run build      # compila TypeScript a dist/
npm start          # ejecuta dist/index.js
```

## Docker

```bash
docker build -t users-identity-service .
docker run -p 3002:3002 users-identity-service
```

## Próximos pasos

- Persistencia en PostgreSQL
- Middleware de autenticación reutilizable
- 2FA (two-factor authentication)
- OAuth2 integration
- Password reset flow
