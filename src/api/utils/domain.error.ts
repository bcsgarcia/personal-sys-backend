export enum DomainError {
    DUPLICATE_ITEMS = 'DUPLICATE_ITEMS: Array contains duplicate items',
    INVALID_INPUT = 'INVALID_INPUT: Invalid input provided',
    RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND: Resource not found',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR: Internal server error',
}


export type DomainErrorState = DomainError;
