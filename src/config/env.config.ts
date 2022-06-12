import * as dotenv from 'dotenv';
import { cleanEnv, port, str } from 'envalid';

export interface Environment {
  PORT: number;
  STAGE: string;
  COGNITO_USER_POOL_ID: string;
  COGNITO_CLIENT_ID: string;
  COGNITO_REGION: string;
  SENDGRID_API_KEY: string;
  SENDGRID_SENDING_DOMAIN: string;
  FRONTEND_URL: string;
  DATABASE_URL: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  SWAGGER_USERNAME: string;
  SWAGGER_PASSWORD: string;
}

let fullEnv: Environment;

if (!process.env.STAGE || process.env.STAGE === 'development') {
  fullEnv = {
    ...(dotenv.config().parsed as unknown as Environment),
    ...process.env,
  };
} else {
  fullEnv = {
    ...(process.env as unknown as Environment),
  };
}

const env: Environment = cleanEnv(fullEnv, {
  PORT: port({
    default: 3000,
    desc: 'The TCP port that this server will listen to',
  }),
  STAGE: str({
    desc: 'The current stage of this application',
    example: 'development',
    devDefault: 'development',
  }),
  COGNITO_USER_POOL_ID: str({
    desc: 'AWS Cognito user pool id',
    example: 'us-east-1_ridkd...',
  }),
  COGNITO_CLIENT_ID: str({
    desc: 'AWS Cognito client id',
    example: '7cp4b241qcd3addjd...',
  }),
  COGNITO_REGION: str({
    desc: 'AWS Cognito region',
    example: 'us-east-1',
    devDefault: 'us-east-1',
  }),
  SENDGRID_API_KEY: str({
    desc: 'Sendgrid API key',
    example: '080ba91b60db42e8ade4137748dsadb1',
  }),
  SENDGRID_SENDING_DOMAIN: str({
    desc: 'Verified Domain Name on Sendgrid for outbound emails',
    example: 'customercity.com',
    default: 'customercity.com',
  }),
  FRONTEND_URL: str({
    desc: 'Front end URL to accept requests from',
    default: 'http://localhost:3000',
  }),
  DATABASE_URL: str({
    desc: 'Full URL to connect to database server.',
    example: 'postgresql://username:password@localhost:5432/database',
  }),
  AWS_ACCESS_KEY_ID: str({
    desc: 'AWS Access Key Id',
    example: 'AKIXXXXXXXXXXXXXXXXP',
    devDefault: 'AKIXXXXXXXXXXXXXXXXP',
  }),
  AWS_SECRET_ACCESS_KEY: str({
    desc: 'AWS Secret Access Key',
    example: 'SbEfTobxxxxxxxxxxxxxxxxxxxxxxxhu',
    devDefault: 'SbEfTobxxxxxxxxxxxxxxxxxxxxxxxhu',
  }),
  SWAGGER_USERNAME: str({
    desc: 'Swagger docs endpoint username',
    default: 'admin',
  }),
  SWAGGER_PASSWORD: str({
    desc: 'Swagger docs endpoint password',
    default: 'admin',
  }),
});

export default () => {
  return {
    port: env.PORT,
    stage: env.STAGE,
    isProduction: env.STAGE === 'production',
    isStaging: env.STAGE === 'staging',
    isDevelopment: env.STAGE === 'development',
    cognitoUserPoolId: env.COGNITO_USER_POOL_ID,
    cognitoClientId: env.COGNITO_CLIENT_ID,
    cognitoRegion: env.COGNITO_REGION,
    cognitoAuthority: `https://cognito-idp.${env.COGNITO_REGION}.amazonaws.com/${env.COGNITO_USER_POOL_ID}`,
    sendgridApiKey: env.SENDGRID_API_KEY,
    sendgridSendingDomain: env.SENDGRID_SENDING_DOMAIN,
    frontEndUrl: env.FRONTEND_URL,
    databaseURL: env.DATABASE_URL,
    awsAccessKeyId: env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    swaggerUsername: env.SWAGGER_USERNAME,
    swaggerPassword: env.SWAGGER_PASSWORD,
  };
};
