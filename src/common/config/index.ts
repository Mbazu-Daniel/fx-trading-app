import * as dotenv from 'dotenv';
dotenv.config();

export interface IEnvironment {
  APP: {
    TITLE: string;
    NODE_ENV: string;
    PORT: number | string;
  };

  DB: {
    HOST: string;
    NAME: string;
    PORT: number;
    USERNAME: string;
    PASSWORD: string;
  };

  JWT: {
    ACCESS_SECRET: string;
    ACCESS_EXPIRES_IN: string;
  };

  MAILER: {
    EMAIL: string;
    USERNAME: string;
    PASSWORD: string;
  };

  EXCHANGE_RATE: {
    API_KEY: string;
    BASE_URL: string;
  };
}

export const ENVIRONMENT: IEnvironment = {
  APP: {
    TITLE: process.env.APP_TITLE || 'TeamLyf',
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || process.env.APP_PORT || 5000,
  },

  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    NAME: process.env.DB_NAME || 'nkata-studio',
    PORT: Number(process.env.DB_PORT) || 3306,
    USERNAME: process.env.DB_USERNAME || 'root',
    PASSWORD: process.env.DB_PASSWORD || 'Delta1force',
  },

  JWT: {
    ACCESS_SECRET: process.env.ACCESS_SECRET,
    ACCESS_EXPIRES_IN: process.env.ACCESS_EXPIRES_IN,
  },
  MAILER: {
    EMAIL: process.env.SMTP_EMAIL,
    USERNAME: process.env.SMTP_USERNAME,
    PASSWORD: process.env.SMTP_PASSWORD,
  },
  EXCHANGE_RATE: {
    API_KEY: process.env.EXCHANGE_RATE_API_KEY,
    BASE_URL: process.env.EXCHANGE_RATE_BASE_URL,
  },
};
