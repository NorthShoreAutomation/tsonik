import { LicenseAPI } from "@licensespring/node-sdk";
import os from "os";
import {
  ICredentialDataDecryptedObject,
  IExecuteFunctions,
  NodeOperationError,
} from "n8n-workflow";

export interface LicenseSpringConfig {
  licenseKey: string;
  apiKey: string;
  sharedKey: string;
  appName: string;
  appVersion: string;
}

export class LicenseValidator {
  // Define error codes as static
  public static readonly codes: Record<string, string> = {
    LICENSE_KEY_REQUIRED: "LICENSE_KEY_REQUIRED",
    LICENSE_NOT_ACTIVE: "LICENSE_NOT_ACTIVE",
    LICENSE_EXPIRED: "LICENSE_EXPIRED",
    LICENSE_CHECK_FAILED: "LICENSE_CHECK_FAILED",
    LICENSE_STATUS_CHECK_FAILED: "LICENSE_STATUS_CHECK_FAILED",
    LICENSE_VALIDATION_FAILED: "LICENSE_VALIDATION_FAILED",
    LICENSE_INVALID: "LICENSE_INVALID",
  };
  public static readonly codeMap: Record<string, string> = {
    license_not_active: LicenseValidator.codes.LICENSE_NOT_ACTIVE,
  };
  private hardwareId: string =
    os.hostname() + "-" + os.platform() + "-" + os.arch();

  private licenseAPI: LicenseAPI;
  private config: LicenseSpringConfig;

  constructor(
    credentials: ICredentialDataDecryptedObject | LicenseSpringConfig
  ) {
    this.config = {
      licenseKey: String(credentials.licenseKey || ""),
      apiKey: String(credentials.apiKey || ""),
      sharedKey: String(credentials.sharedKey || ""),
      appName: String(credentials.appName || ""),
      appVersion: String(credentials.appVersion || "1.0.0"),
    };

    // Initialize LicenseSpring API
    this.licenseAPI = new LicenseAPI({
      apiKey: this.config.apiKey,
      sharedKey: this.config.sharedKey,
      appName: this.config.appName,
      appVersion: this.config.appVersion,
    });
  }

  handleUnknownError = (
    error: Error | any
  ): {
    isValid: boolean;
    error?: { message: string; code: string; status: number };
  } => {
    const errorMessage =
      error instanceof Error ? error.message : "License validation failed";
    const errorCode =
      LicenseValidator.codeMap[error?.code] ||
      LicenseValidator.codes.LICENSE_VALIDATION_FAILED;
    return {
      isValid: false,
      error: {
        message: errorMessage,
        code: errorCode,
        status: error?.status || 500,
      },
    };
  };

  /**
   * Validate the license key
   */
  async validateLicense(): Promise<{
    isValid: boolean;
    error?: { message: string; code: string; status: number };
  }> {
    try {
      // Check if license key is provided
      if (!this.config.licenseKey) {
        return {
          isValid: false,
          error: {
            message: "License key is required",
            code: LicenseValidator.codes.LICENSE_KEY_REQUIRED,
            status: 400,
          },
        };
      }

      // Attempt to activate the license
      const result = await this.licenseAPI.activateLicense({
        license_key: this.config.licenseKey,
        hardware_id: this.hardwareId,
        product: this.config.appName,
      });

      if (result) {
        // Check if license is active (ActivateLicenseResponse uses 'active')
        const isActive = result.active;
        const isExpired = result.is_expired;

        if (!isActive) {
          return {
            isValid: false,
            error: {
              message: "License is not active",
              code: LicenseValidator.codes.LICENSE_NOT_ACTIVE,
              status: 400,
            },
          };
        }

        if (isExpired) {
          return {
            isValid: false,
            error: {
              message: "License has expired",
              code: LicenseValidator.codes.LICENSE_EXPIRED,
              status: 400,
            },
          };
        }

        return { isValid: true };
      }

      return {
        isValid: false,
        error: {
          message: "Invalid license response",
          code: LicenseValidator.codes.LICENSE_INVALID,
          status: 400,
        },
      };
    } catch (error: any) {
      return this.handleUnknownError(error);
    }
  }

  /**
   * Check license status without activation
   */
  async checkLicenseStatus(): Promise<{
    isValid: boolean;
    error?: { message: string; code: string; status: number };
  }> {
    try {
      if (!this.config.licenseKey) {
        return {
          isValid: false,
          error: {
            message: "License key is required",
            code: LicenseValidator.codes.LICENSE_KEY_REQUIRED,
            status: 400,
          },
        };
      }

      // Check license status
      const result = await this.licenseAPI.checkLicense({
        product: this.config.appName,
        license_key: this.config.licenseKey,
        hardware_id: this.hardwareId,
      });

      if (result) {
        // CheckLicenseResponse uses 'license_active' and inherits 'is_expired'
        const isActive = result.license_active;
        const isExpired = result.is_expired;

        if (!isActive) {
          return {
            isValid: false,
            error: {
              message: "License is not active",
              code: LicenseValidator.codes.LICENSE_NOT_ACTIVE,
              status: 400,
            },
          };
        }

        if (isExpired) {
          return {
            isValid: false,
            error: {
              message: "License has expired",
              code: LicenseValidator.codes.LICENSE_EXPIRED,
              status: 400,
            },
          };
        }

        return { isValid: true };
      }

      return {
        isValid: false,
        error: {
          message: "License check failed",
          code: LicenseValidator.codes.LICENSE_CHECK_FAILED,
          status: 400,
        },
      };
    } catch (error: any) {
      return this.handleUnknownError(error);
    }
  }
}

/**
 * Centralized helper function to validate license for n8n nodes
 */
export async function validateNodeLicense(
  executeFunctions: IExecuteFunctions
): Promise<void> {
  // Get credentials
  const credentials = await executeFunctions.getCredentials("iconikApi");
  if (!credentials) {
    throw new NodeOperationError(
      executeFunctions.getNode(),
      "No Iconik API credentials provided"
    );
  }

  // Validate that all required fields are present
  const requiredFields = [
    "licenseKey",
    "apiKey",
    "sharedKey",
    "appName",
    "appVersion",
  ];

  if (requiredFields.some((field) => !credentials[field])) {
    throw new NodeOperationError(
      executeFunctions.getNode(),
      `Missing required license credentials: ${requiredFields.join(", ")}`
    );
  }

  // Extract license credentials for validation with explicit type casting
  const licenseCredentials: LicenseSpringConfig = {
    licenseKey: credentials.licenseKey as string,
    apiKey: credentials.apiKey as string,
    sharedKey: credentials.sharedKey as string,
    appName: credentials.appName as string,
    appVersion: credentials.appVersion as string,
  };

  // Validate license
  const licenseValidator: LicenseValidator = new LicenseValidator(
    licenseCredentials
  );
  let licenseValidation: {
    isValid: boolean;
    error?: { message: string; code: string; status: number };
  } = await licenseValidator.checkLicenseStatus();

  if (
    !licenseValidation.isValid &&
    licenseValidation.error?.message &&
    licenseValidation.error.code === LicenseValidator.codes.LICENSE_NOT_ACTIVE
  ) {
    await licenseValidator.validateLicense();
    licenseValidation = await licenseValidator.checkLicenseStatus();
  }

  if (!licenseValidation.isValid) {
    // We have an error object with details
    if (licenseValidation.error) {
      throw new NodeOperationError(
        executeFunctions.getNode(),
        `License validation failed: ${licenseValidation.error.message}`,
        { itemIndex: 0, description: licenseValidation.error.message }
      );
    }

    // Generic error with no details
    throw new NodeOperationError(
      executeFunctions.getNode(),
      "License validation failed: Invalid license",
      {
        itemIndex: 0,
        description: "Invalid license",
      }
    );
  }
}
