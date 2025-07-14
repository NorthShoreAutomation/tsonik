/**
 * HTTP-related type definitions
 */

import { AxiosRequestConfig } from 'axios';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type QueryParams = Record<string, string | number | boolean | object | null>;

export type HttpOptions = AxiosRequestConfig;
