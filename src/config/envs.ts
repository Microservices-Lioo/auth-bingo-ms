import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    JWT_SECRET: string;
    JWT_EXPIRATION: string;    
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRATION: string;
    NATS_SERVERS: string[];
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    POSTGRES_USER: joi.string().required(),
    POSTGRES_PASSWORD: joi.string().required(),
    POSTGRES_DB: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRATION: joi.string().required(),
    JWT_REFRESH_SECRET: joi.string().required(),
    JWT_REFRESH_EXPIRATION: joi.string().required(),
    NATS_SERVERS: joi.array().items( joi.string() ).required(),
})
.unknown(true);

const { error, value } = envsSchema.validate( {
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
} );

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs: EnvVars = {
    PORT: envVars.PORT,
    POSTGRES_USER: envVars.POSTGRES_USER,
    POSTGRES_PASSWORD: envVars.POSTGRES_PASSWORD,
    POSTGRES_DB: envVars.POSTGRES_DB,
    JWT_SECRET: envVars.JWT_SECRET,
    JWT_EXPIRATION: envVars.JWT_EXPIRATION,
    JWT_REFRESH_SECRET: envVars.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRATION: envVars.JWT_REFRESH_EXPIRATION,
    NATS_SERVERS: envVars.NATS_SERVERS
}
