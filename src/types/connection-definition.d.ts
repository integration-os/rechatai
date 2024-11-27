export interface ConnectionDefinition {
    authMethod: object | null; // You can specify the correct data type for authMethod if needed
    _id: string;
    platformVersion: string;
    platform: string;
    type: string;
    name: string;
    frontend: {
      spec: {
        title: string;
        description: string;
        platform: string;
        category: string;
        image: string;
        tags: string[];
      };
    };
    settings: {
      parseWebhookBody: boolean;
      showSecret: boolean;
      allowCustomEvents: boolean;
      oauth: boolean;
    };
    hidden: boolean;
    createdAt: number;
    updatedAt: number;
    updated: boolean;
    version: string;
    lastModifiedBy: string;
    deleted: boolean;
    tags: string[]; // You can specify the correct data type for tags if needed
    active: boolean;
    deprecated: boolean;
  }
  
  export interface ConnectionDefinitions {
    rows: ConnectionDefinition[];
    limit: number;
    skip: number;
    total: number;
  }
  
  interface ConnectionOauthDefinition {
    isFullTemplateEnabled?: boolean;
    _id: string;
    configuration: {
      init: {
        baseUrl: string;
        path: string;
        authMethod: {
          type: string;
        };
        headers: {
          connection: string[];
          accept: string[];
          authorization: string[];
        };
        content: string;
        schemas: {
          headers: null;
          queryParams: null;
          pathParams: null;
          body: null;
        };
        samples: {
          queryParams: null;
          pathParams: null;
        };
        responses: any[];
      };
      refresh: {
        baseUrl: string;
        path: string;
        authMethod: {
          type: string;
        };
        headers: {
          connection: string[];
          accept: string[];
          authorization: string[];
        };
        content: string;
        schemas: {
          headers: null;
          queryParams: null;
          pathParams: null;
          body: null;
        };
        samples: {
          queryParams: null;
          pathParams: null;
        };
        responses: any[];
      };
    };
    connectionPlatform: string;
    compute: {
      init: {
        computation: {
          entry: string;
          function: string;
          language: string;
        };
        response: {
          entry: string;
          function: string;
          language: string;
        };
      };
      refresh: {
        computation: {
          entry: string;
          function: string;
          language: string;
        };
        response: {
          entry: string;
          function: string;
          language: string;
        };
      };
    };
    frontend: {
      platformRedirectUri: string;
      scopes: string;
      iosRedirectUri: string;
      separator: string;
    };
    createdAt: number;
    updatedAt: number;
    updated: boolean;
    version: string;
    lastModifiedBy: string;
    deleted: boolean;
    changeLog: any;
    tags: any[];
    active: boolean;
    deprecated: boolean;
  }
  
  export interface ConnectionOauthDefinitions {
    rows: ConnectionOauthDefinition[];
    total: number;
    limit: number;
    skip: number;
  }