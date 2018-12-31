import joi, { ValidationResult, Schema, SchemaMap } from 'joi';
import { AxiosRequestConfig } from 'axios'

export enum METHODS {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

interface RouteInterface extends AxiosRequestConfig {
  paramsValidator: (data: object) => ValidationResult<object>;
  dataValidator: (data: object) => ValidationResult<object>;
}

export interface RouteObject {
  method: METHODS,
  name: string,
  path: string,
  paramsSchema: SchemaMap,
  dataSchema: SchemaMap
}

export class Router {
  public routes: { [key: string]: RouteInterface };

  constructor() {
    this.routes = {};
  }

  public route({
                 method,
                 name,
                 path,
                 paramsSchema,
                 dataSchema,
               }: RouteObject) {
    this.routes[name] = {
      method: METHODS.GET,
      url: path,
      paramsValidator: (params: object) => {
        const schema = joi.object().keys(paramsSchema);
        return joi.validate(params, schema);
      },
      dataValidator: (data: object) => {
        const schema = joi.object().keys(dataSchema);
        return joi.validate(data, schema);
      },
    };
  }
}
