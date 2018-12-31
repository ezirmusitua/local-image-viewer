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
  public paramsSchemas: { [key: string]: SchemaMap };
  public dataSchemas: { [key: string]: SchemaMap };

  constructor() {
    this.routes = {};
    this.paramsSchemas = {};
    this.dataSchemas = {};
  }

  public route({
                 method,
                 name,
                 path,
                 paramsSchema,
                 dataSchema,
               }: RouteObject) {
    this.paramsSchemas[name] = paramsSchema;
    this.dataSchemas[name] = dataSchema;
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
