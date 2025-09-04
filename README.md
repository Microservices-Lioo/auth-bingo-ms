# 🔐 Auth Bingo Microservice

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=flat&logo=node.js)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-Framework-red?style=flat&logo=nestjs)](https://nestjs.com/)
[![NATS](https://img.shields.io/badge/NATS-Messaging-blue?style=flat&logo=nats)](https://nats.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=flat&logo=postgresql)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue?style=flat&logo=docker)](https://www.docker.com/)

Microservicio de autenticación y autorización para el sistema de Bingo, construido con NestJS. Proporciona funcionalidades completas de gestión de usuarios, autenticación JWT, autorización basada en roles y comunicación asíncrona a través de NATS.

## 🛠️ Tecnologías Utilizadas

- **Framework**: NestJS 10+
- **Runtime**: Node.js 18+
- **Lenguaje**: TypeScript 5+
- **Base de Datos**: PostgreSQL 15+
- **Message Broker**: NATS
- **Autenticación**: JWT + BCrypt
- **Containerización**: Docker

## ✨ Características

- 🔐 **Autenticación JWT**: Tokens seguros con refresh automático
- 👥 **Gestión de Usuarios**: CRUD completo de usuarios y perfiles
- 🛡️ **Autorización por Roles**: Sistema flexible de permisos
- 📧 **Verificación de Email**: Confirmación de cuenta por correo
- 🔄 **Recuperación de Contraseña**: Reset seguro de credenciales
- 🚀 **Comunicación Asíncrona**: Integración NATS para microservicios
- 🔒 **Encriptación BCrypt**: Hashing seguro de contraseñas
- ⚡ **Rate Limiting**: Protección contra ataques de fuerza bruta

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) v8 o superior
- [Docker](https://www.docker.com/) y Docker Compose
- [PostgreSQL](https://postgresql.org/) v15+
- [Git](https://git-scm.com/)

## 🚀 Ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/Microservices-Lioo/auth-bingo-ms.git
cd auth-bingo-ms
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.template .env
# Editar el archivo .env con tu configuración
```

### 4. Levantar servicios con Docker
#### PostgreSQL y NATS 
Ejecutar el archivo docker-compose.yml para ambiente de desarrollo, caso
contrario ejecutar el docker-compose.prod.yml.
```bash
# Modo desarrollo
docker compose -f docker-compose.yml up --build

# Modo de producción
docker compose -f docker-compose.prod.yml up --build
```

### 5. Iniciar el microservicio
```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod
```

## Docker para contenedor único en producción
```bash
docker build -f dockerfile.prod -t auth-ms .
```

## NATS con Docker
```bash
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
```

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Add nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

### Estándares
- Seguir convenciones de TypeScript y NestJS
- Incluir tests para nuevas funcionalidades
- Documentar funciones complejas

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

Desarrollado por el equipo **Microservices-Lioo**.

## 📞 Soporte

Si tienes problemas o preguntas:

1. Busca en [Issues](https://github.com/Microservices-Lioo/auth-bingo-ms/issues)
2. Crea un nuevo issue si es necesario

---

⭐ **¡Si este proyecto te es útil, dale una estrella en GitHub!**