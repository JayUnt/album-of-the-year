import React from 'react';
import {ApiClient} from './ApiClient';

export interface ApiContextProps {
  apiClient: ApiClient;
}

export const ApiContext = React.createContext({} as ApiContextProps);

export const useApiContext = () => React.useContext(ApiContext);
