import axios, { AxiosResponse, Method } from 'axios'
import { UpbitApiError } from './error'

interface RequestPayload {
  method: Method
  url: string
  params?: {}
  data?: {}
  headers?: {}
}

export default class Api {
  async #request<T>({
    method,
    url,
    params,
    data,
    headers,
  }: RequestPayload): Promise<AxiosResponse<T>> {
    try {
      const response = await axios({
        method,
        url,
        params,
        data,
        headers,
      })

      return response
    } catch (err) {
      const {
        response: { data },
      } = err

      throw new UpbitApiError(data.error.name, data.error.message)
    }
  }

  protected async get<T>(
    url: string,
    params?: {},
    headers?: {},
  ): Promise<AxiosResponse<T>> {
    return await this.#request({
      method: 'GET',
      url,
      params,
      headers,
    })
  }

  protected async post<T>(
    url: string,
    data?: {},
    headers?: {},
  ): Promise<AxiosResponse<T>> {
    return await this.#request({
      method: 'POST',
      url,
      data,
      headers,
    })
  }
}
