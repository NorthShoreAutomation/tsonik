import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeConnectionType,
} from 'n8n-workflow';

import { Tsonik, IconikAuthError, IconikAPIError } from 'tsonik';
import { validateNodeLicense } from '../../utils/licenseValidation';

export class IconikJob implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Iconik Job',
    name: 'job',
    icon: 'file:iconik.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Manage Iconik job',
    defaults: {
      name: 'Iconik Job',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'iconikApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Get Job',
            value: 'getJob',
            description: 'Get a specific job by ID',
            action: 'Get a specific job by ID',
          },
        {
            name: 'List Jobs',
            value: 'listJobs',
            description: 'Search and list jobs with optional filtering',
            action: 'Search and list jobs with optional filtering',
          },
        {
            name: 'Create Job',
            value: 'createJob',
            description: 'Create a new job',
            action: 'Create a new job',
          },
        {
            name: 'Update Job',
            value: 'updateJob',
            description: 'Update an existing job',
            action: 'Update an existing job',
          },
        {
            name: 'Replace Job',
            value: 'replaceJob',
            description: 'Replace an existing job (full update)',
            action: 'Replace an existing job (full update)',
          },
        {
            name: 'Delete Job',
            value: 'deleteJob',
            description: 'Delete a job',
            action: 'Delete a job',
          },
        {
            name: 'Update Priority',
            value: 'updatePriority',
            description: 'Update job priority',
            action: 'Update job priority',
          },
        {
            name: 'Update Steps',
            value: 'updateSteps',
            description: 'Update job steps',
            action: 'Update job steps',
          },
        {
            name: 'Bulk Edit Jobs',
            value: 'bulkEditJobs',
            description: 'Bulk edit jobs based on query filters',
            action: 'Bulk edit jobs based on query filters',
          },
        {
            name: 'Bulk Update Priority',
            value: 'bulkUpdatePriority',
            description: 'Bulk update job priorities',
            action: 'Bulk update job priorities',
          },
        {
            name: 'Bulk Update State',
            value: 'bulkUpdateState',
            description: 'Bulk update job states',
            action: 'Bulk update job states',
          },
        {
            name: 'Bulk Delete',
            value: 'bulkDelete',
            description: 'Bulk delete multiple jobs',
            action: 'Bulk delete multiple jobs',
          },
        {
            name: 'Reindex Job',
            value: 'reindexJob',
            description: 'Reindex a job',
            action: 'Reindex a job',
          },
        {
            name: 'Update Job Steps',
            value: 'updateJobSteps',
            description: 'Update multiple steps for a job',
            action: 'Update multiple steps for a job',
          },
        {
            name: 'Replace Job Steps',
            value: 'replaceJobSteps',
            description: 'Replace multiple steps for a job',
            action: 'Replace multiple steps for a job',
          },
        {
            name: 'Update Job Step',
            value: 'updateJobStep',
            description: 'Update a single job step',
            action: 'Update a single job step',
          },
        {
            name: 'Replace Job Step',
            value: 'replaceJobStep',
            description: 'Replace a single job step (complete replacement)',
            action: 'Replace a single job step (complete replacement)',
          }
        ],
        default: 'getJob',
      },
      {
        displayName: 'Job Id',
        name: 'jobId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getJob'],
          },
        },
        default: '',
        description: 'Job Id',
      },
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        required: false,
        displayOptions: {
          show: {
            operation: ['listJobs'],
          },
        },
        default: '',
        description: 'Query',
      },
      {
        displayName: 'Job Data',
        name: 'jobData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['createJob'],
          },
        },
        default: '',
        description: 'Job Data',
      },
      {
        displayName: 'Job Id',
        name: 'jobId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['updateJob'],
          },
        },
        default: '',
        description: 'Job Id',
      },
      {
        displayName: 'Job Data',
        name: 'jobData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['updateJob'],
          },
        },
        default: '',
        description: 'Job Data',
      },
      {
        displayName: 'Job Id',
        name: 'jobId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['replaceJob'],
          },
        },
        default: '',
        description: 'Job Id',
      },
      {
        displayName: 'Job Data',
        name: 'jobData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['replaceJob'],
          },
        },
        default: '',
        description: 'Job Data',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'string',
        required: false,
        displayOptions: {
          show: {
            operation: ['replaceJob'],
          },
        },
        default: '',
        description: 'Options',
      },
      {
        displayName: 'Job Id',
        name: 'jobId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['deleteJob'],
          },
        },
        default: '',
        description: 'Job Id',
      },
      {
        displayName: 'Job Id',
        name: 'jobId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['updatePriority'],
          },
        },
        default: '',
        description: 'Job Id',
      },
      {
        displayName: 'Priority',
        name: 'priority',
        type: 'number',
        required: true,
        displayOptions: {
          show: {
            operation: ['updatePriority'],
          },
        },
        default: '',
        description: 'Priority',
      },
      {
        displayName: 'Job Id',
        name: 'jobId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['updateSteps'],
          },
        },
        default: '',
        description: 'Job Id',
      },
      {
        displayName: 'Steps Data',
        name: 'stepsData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['updateSteps'],
          },
        },
        default: '',
        description: 'Steps Data',
      },
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['bulkEditJobs'],
          },
        },
        default: '',
        description: 'Query',
      },
      {
        displayName: 'Edit Data',
        name: 'editData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['bulkEditJobs'],
          },
        },
        default: '',
        description: 'Edit Data',
      },
      {
        displayName: 'Priority Data',
        name: 'priorityData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['bulkUpdatePriority'],
          },
        },
        default: '',
        description: 'Priority Data',
      },
      {
        displayName: 'State Data',
        name: 'stateData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['bulkUpdateState'],
          },
        },
        default: '',
        description: 'State Data',
      },
      {
        displayName: 'Job Ids',
        name: 'jobIds',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['bulkDelete'],
          },
        },
        default: '',
        description: 'Job Ids',
      },
      {
        displayName: 'Job Id',
        name: 'jobId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['reindexJob'],
          },
        },
        default: '',
        description: 'Job Id',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'boolean',
        required: false,
        displayOptions: {
          show: {
            operation: ['reindexJob'],
          },
        },
        default: '',
        description: 'Options',
      },
      {
        displayName: 'Job Id',
        name: 'jobId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['updateJobSteps'],
          },
        },
        default: '',
        description: 'Job Id',
      },
      {
        displayName: 'Steps Data',
        name: 'stepsData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['updateJobSteps'],
          },
        },
        default: '',
        description: 'Steps Data',
      },
      {
        displayName: 'Job Id',
        name: 'jobId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['replaceJobSteps'],
          },
        },
        default: '',
        description: 'Job Id',
      },
      {
        displayName: 'Steps Data',
        name: 'stepsData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['replaceJobSteps'],
          },
        },
        default: '',
        description: 'Steps Data',
      },
      {
        displayName: 'Job Id',
        name: 'jobId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['updateJobStep'],
          },
        },
        default: '',
        description: 'Job Id',
      },
      {
        displayName: 'Step Id',
        name: 'stepId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['updateJobStep'],
          },
        },
        default: '',
        description: 'Step Id',
      },
      {
        displayName: 'Step Data',
        name: 'stepData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['updateJobStep'],
          },
        },
        default: '',
        description: 'Step Data',
      },
      {
        displayName: 'Job Id',
        name: 'jobId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['replaceJobStep'],
          },
        },
        default: '',
        description: 'Job Id',
      },
      {
        displayName: 'Step Id',
        name: 'stepId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['replaceJobStep'],
          },
        },
        default: '',
        description: 'Step Id',
      },
      {
        displayName: 'Step Data',
        name: 'stepData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['replaceJobStep'],
          },
        },
        default: '',
        description: 'Step Data',
      }
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    // Validate license and get credentials
    await validateNodeLicense(this);
    const credentials = await this.getCredentials('iconikApi')!;

    // Initialize Tsonik client
    const client = new Tsonik({
      appId: credentials.appId as string,
      authToken: credentials.authToken as string,
      baseUrl: credentials.baseURL as string,
    });

    // Process each input item
    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;

      try {
        let result: any;

        switch (operation) {
          case 'getJob':
            const jobId_getJob_0 = this.getNodeParameter('jobId', i) as string;
            result = await client.jobs.getJob(jobId_getJob_0);
            break;

          case 'listJobs':
            const query_listJobs_0 = this.getNodeParameter('query', i) as any;
            result = await client.jobs.listJobs(query_listJobs_0);
            break;

          case 'createJob':
            const jobData_createJob_0 = this.getNodeParameter('jobData', i) as any;
            result = await client.jobs.createJob(jobData_createJob_0);
            break;

          case 'updateJob':
            const jobId_updateJob_0 = this.getNodeParameter('jobId', i) as string;
            const jobData_updateJob_1 = this.getNodeParameter('jobData', i) as any;
            result = await client.jobs.updateJob(jobId_updateJob_0, jobData_updateJob_1);
            break;

          case 'replaceJob':
            const jobId_replaceJob_0 = this.getNodeParameter('jobId', i) as string;
            const jobData_replaceJob_1 = this.getNodeParameter('jobData', i) as any;
            const options_replaceJob_2 = this.getNodeParameter('options', i) as any;
            result = await client.jobs.replaceJob(jobId_replaceJob_0, jobData_replaceJob_1, options_replaceJob_2);
            break;

          case 'deleteJob':
            const jobId_deleteJob_0 = this.getNodeParameter('jobId', i) as string;
            result = await client.jobs.deleteJob(jobId_deleteJob_0);
            break;

          case 'updatePriority':
            const jobId_updatePriority_0 = this.getNodeParameter('jobId', i) as string;
            const priority_updatePriority_1 = this.getNodeParameter('priority', i) as number;
            result = await client.jobs.updatePriority(jobId_updatePriority_0, priority_updatePriority_1);
            break;

          case 'updateSteps':
            const jobId_updateSteps_0 = this.getNodeParameter('jobId', i) as string;
            const stepsData_updateSteps_1 = this.getNodeParameter('stepsData', i) as any;
            result = await client.jobs.updateSteps(jobId_updateSteps_0, stepsData_updateSteps_1);
            break;

          case 'bulkEditJobs':
            const query_bulkEditJobs_0 = this.getNodeParameter('query', i) as any;
            const editData_bulkEditJobs_1 = this.getNodeParameter('editData', i) as any;
            result = await client.jobs.bulkEditJobs(query_bulkEditJobs_0, editData_bulkEditJobs_1);
            break;

          case 'bulkUpdatePriority':
            const priorityData_bulkUpdatePriority_0 = this.getNodeParameter('priorityData', i) as any;
            result = await client.jobs.bulkUpdatePriority(priorityData_bulkUpdatePriority_0);
            break;

          case 'bulkUpdateState':
            const stateData_bulkUpdateState_0 = this.getNodeParameter('stateData', i) as any;
            result = await client.jobs.bulkUpdateState(stateData_bulkUpdateState_0);
            break;

          case 'bulkDelete':
            const jobIds_bulkDelete_0 = this.getNodeParameter('jobIds', i) as any;
            result = await client.jobs.bulkDelete(jobIds_bulkDelete_0);
            break;

          case 'reindexJob':
            const jobId_reindexJob_0 = this.getNodeParameter('jobId', i) as string;
            const options_reindexJob_1 = this.getNodeParameter('options', i) as any;
            result = await client.jobs.reindexJob(jobId_reindexJob_0, options_reindexJob_1);
            break;

          case 'updateJobSteps':
            const jobId_updateJobSteps_0 = this.getNodeParameter('jobId', i) as string;
            const stepsData_updateJobSteps_1 = this.getNodeParameter('stepsData', i) as any;
            result = await client.jobs.updateJobSteps(jobId_updateJobSteps_0, stepsData_updateJobSteps_1);
            break;

          case 'replaceJobSteps':
            const jobId_replaceJobSteps_0 = this.getNodeParameter('jobId', i) as string;
            const stepsData_replaceJobSteps_1 = this.getNodeParameter('stepsData', i) as any;
            result = await client.jobs.replaceJobSteps(jobId_replaceJobSteps_0, stepsData_replaceJobSteps_1);
            break;

          case 'updateJobStep':
            const jobId_updateJobStep_0 = this.getNodeParameter('jobId', i) as string;
            const stepId_updateJobStep_1 = this.getNodeParameter('stepId', i) as string;
            const stepData_updateJobStep_2 = this.getNodeParameter('stepData', i) as any;
            result = await client.jobs.updateJobStep(jobId_updateJobStep_0, stepId_updateJobStep_1, stepData_updateJobStep_2);
            break;

          case 'replaceJobStep':
            const jobId_replaceJobStep_0 = this.getNodeParameter('jobId', i) as string;
            const stepId_replaceJobStep_1 = this.getNodeParameter('stepId', i) as string;
            const stepData_replaceJobStep_2 = this.getNodeParameter('stepData', i) as any;
            result = await client.jobs.replaceJobStep(jobId_replaceJobStep_0, stepId_replaceJobStep_1, stepData_replaceJobStep_2);
            break;

          default:
            throw new NodeOperationError(
              this.getNode(),
              `Unknown operation: ${operation}`,
            );
        }

        // Add result to return data
        returnData.push({
          json: {
            operation,
            success: true,
            data: result.data,
            status: result.status,
            headers: result.headers,
          },
        });

      } catch (error) {
        if (error instanceof IconikAuthError) {
          throw new NodeOperationError(
            this.getNode(),
            'Authentication failed. Please check your App ID and Auth Token.',
            { itemIndex: i },
          );
        }

        if (error instanceof IconikAPIError) {
          throw new NodeOperationError(
            this.getNode(),
            `Iconik API Error: ${error.message}`,
            { 
              itemIndex: i,
              description: 'API request failed',
            },
          );
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new NodeOperationError(
          this.getNode(),
          `Unexpected error: ${errorMessage}`,
          { itemIndex: i },
        );
      }
    }

    return [returnData];
  }
}