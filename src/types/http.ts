/**
 * HTTP-related type definitions
 */

import { AxiosRequestConfig } from 'axios';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type QueryParams = Record<string, any>;

export type HttpOptions = AxiosRequestConfig;
