import { RouteObject, Router } from '@/resources/Router'
import { AxiosInstance } from 'axios'
import { Config } from '@/Config'
import axios from 'axios'

export class Resource {
  public endpoint: string;
  public baseURL: string;
  public router: Router;
  public requester: AxiosInstance;

  constructor(endpoint: string, routeObjects: RouteObject[]) {
    this.endpoint = endpoint;
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
      // NOTE: overwrite name with endpoint prefix
      this.router.route({...route, name: `${this.endpoint}/${route.name}`})
    });
  }

  public async request(name: string, params: object = {}, data: object = {}) {
    const route = this.router.routes[`${this.endpoint}/${name}`];
    const {error: qerr, value: qval} = route.paramsValidator(params);
    if (qerr) {
      throw Error(`Invalid query: ${JSON.stringify(qval, null, 2)}`)
    }
    const {error: berr, value: bval} = route.dataValidator(data);
    if (berr) {
      throw Error(`Invalid body: ${JSON.stringify(bval, null, 2)}`)
    }
    try {
      const {data: resData} = await this.requester.request({...route, params, data});
      return resData;
    } catch (err) {
      // console.error('Request error: ', err)
      throw Error('Request Error')
    }
  }
}
