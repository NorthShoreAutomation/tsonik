import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class IconikApi implements ICredentialType {
  name = 'iconikApi';
  displayName = 'Iconik API';
  documentationUrl = 'https://app.iconik.io/docs';
  properties: INodeProperties[] = [
    {
      displayName: 'App ID',
      name: 'appId',
      type: 'string',
      required: true,
      default: '',
      description: 'Your Iconik App ID',
    },
    {
      displayName: 'Auth Token',
      name: 'authToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      required: true,
      default: '',
      description: 'Your Iconik Auth Token',
    },
    {
      displayName: 'Base URL',
      name: 'baseURL',
      type: 'string',
      required: false,
      default: 'https://app.iconik.io',
      description: 'Iconik Base URL (use default unless using custom instance)',
    },
  ];
}