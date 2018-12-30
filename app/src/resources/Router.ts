import joi, { ValidationResult, Schema } from 'joi';
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
  paramsSchema: Schema,
  dataSchema: Schema
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
      paramsValidator: (params: object) => joi.validate(params, paramsSchema || {}),
      dataValidator: (data: object) => joi.validate(data, dataSchema || {}),
    };
  }
}
