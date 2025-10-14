import { ICredentialType, INodeProperties, ICredentialTestFunctions, ICredentialDataDecryptedObject, INodeCredentialTestResult } from "n8n-workflow";
import { version } from "../../package.json";
export class IconikApi implements ICredentialType {
  name = "iconikApi";
  displayName = "Iconik API (Tsonik)";
  documentationUrl = "https://app.iconik.io/docs";
  properties: INodeProperties[] = [
    {
      displayName: "App ID",
      name: "appId",
      type: "string",
      required: true,
      default: "",
      description: "Your Iconik App ID",
    },
    {
      displayName: "Auth Token",
      name: "authToken",
      type: "string",
      typeOptions: {
        password: true,
      },
      required: true,
      default: "",
      description: "Your Iconik Auth Token",
    },
    {
      displayName: "Base URL",
      name: "baseURL",
      type: "string",
      required: false,
      default: "https://app.iconik.io",
      description: "Iconik Base URL (use default unless using custom instance)",
    },
    {
      displayName: "License Key",
      name: "licenseKey",
      type: "string",
      typeOptions: {
        password: true,
      },
      required: true,
      default: "",
      description: "Your LicenseSpring license key",
    },
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      typeOptions: {
        password: true,
      },
      required: true,
      default: "",
      description: "Your LicenseSpring API key",
    },
    {
      displayName: "Shared Key",
      name: "sharedKey",
      type: "string",
      typeOptions: {
        password: true,
      },
      required: true,
      default: "",
      description: "Your LicenseSpring shared key",
    },
    {
      displayName: "App Name",
      name: "appName",
      type: "string",
      required: true,
      default: "",
      description: "Your application name in LicenseSpring",
    },
    {
      displayName: "App Version",
      name: "appVersion",
      type: "string",
      required: true,
      default: version,
      description: "Your application version",
    },
  ];

}
