import {
    Count,
    DeleteOptions,
    ListFilter,
    ListResponse,
    Resource,
    Response,
    UnifiedOptions,
  } from "@integrationos/node";
  
  interface UnifiedApi<Type> {
    create(
      object: Type,
      options?: UnifiedOptions | undefined | null
    ): Promise<Response<Type>>;
    list(
      filter?: ListFilter | undefined | null,
      options?: UnifiedOptions | undefined | null
    ): Promise<ListResponse<Type>>;
    get(
      id: string,
      options?: UnifiedOptions | undefined | null
    ): Promise<Response<Type>>;
    update(
      id: string,
      object: Type,
      options?: UnifiedOptions | undefined | null
    ): Promise<Response<Type>>;
    count(options?: UnifiedOptions | undefined | null): Promise<Response<Count>>;
    delete(
      id: string,
      deleteOptions?: DeleteOptions | undefined | null,
      options?: UnifiedOptions | undefined | null
    ): Promise<Response<Type>>;
  }
  
  export declare class UnifiedResourceImpl<T>
    extends Resource<T>
    implements UnifiedApi<T>
  {
    create(object: T, options?: UnifiedOptions): Promise<Response<T>>;
    upsert(object: T, options?: UnifiedOptions): Promise<Response<T>>;
    list(filter?: ListFilter, options?: UnifiedOptions): Promise<ListResponse<T>>;
    get(id: string, options?: UnifiedOptions): Promise<Response<T>>;
    update(id: string, object: T, options?: UnifiedOptions): Promise<Response<T>>;
    count(options?: UnifiedOptions): Promise<Response<Count>>;
    delete(
      id: string,
      deleteOptions?: DeleteOptions,
      options?: UnifiedOptions
    ): Promise<Response<T>>;
  }