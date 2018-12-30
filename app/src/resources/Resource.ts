import { RouteObject, Router } from '@/resources/Router'
import { AxiosInstance } from 'axios'
import { Config } from '@/Config'
import axios from 'axios'

export class Resource {
  public baseURL: string;
  public router: Router;
  public requester: AxiosInstance;

  constructor(endpoint: string, routeObjects: RouteObject[]) {
    this.baseURL = `${Config.backend}/${endpoint}`
    this.router = new Router();
    this.requester = axios.create({
      baseURL: this.baseURL,
      timeout: 1000,
      headers: {'Content-Type': 'application/json'},
    })
    this.register(routeObjects);
  }

  public register(routeObjects: RouteObject[]) {
    routeObjects.forEach((route) => {
      this.router.route(route)
    })
  }

  public async request(name: string, params: object = {}, data: object = {}) {
    const route = this.router.routes[name];
    const {error: qerr, value: qval} = route.paramsValidator(params);
    if (qerr) {
      throw Error(`Invalid query: ${qval}`)
    }
    const {error: berr, value: bval} = route.dataValidator(data);
    if (berr) {
      throw Error(`Invalid body: ${bval}`)
    }
    try {
      const {data: resData} = await this.requester.request(route);
      return resData;
    } catch (err) {
      console.error('Request error: ', err)
      throw Error('Request Error')
    }
  }
}
