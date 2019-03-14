const envAlias: string = process.env.NODE_ENV || 'development';
const EnvEnum = {
  DEV: 'development',
  PROD: 'production',
};
const EnvMaps = {
  development: EnvEnum.DEV,
  dev: EnvEnum.DEV,
  production: EnvEnum.PROD,
  prod: EnvEnum.PROD,
} as { [key: string]: string };

const ENV: string = EnvMaps[envAlias];

const Backends = {
  [EnvEnum.DEV]: `http://192.168.31.5:3000`,
  [EnvEnum.PROD]: 'http://localhost:3000',
};

export class Config {
  public static backend = Backends[ENV];
}
