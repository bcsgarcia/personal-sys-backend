export enum SqlError {
    DuplicateKey = 'ER_DUP_ENTRY',
    ForeignKeyViolation = '23503',
    UniqueViolation = '23505',
    InvalidInputSyntax = '22P02',
    DataOutOfRange = '22003',
    UndefinedColumn = '42703',
    InvalidColumnReference = '42P10',
    InvalidForeignKey = '42830',
    NotNullViolation = '23502',
    Other = '99999',
}

export function getMessage(errorCode: SqlError): string {
    switch (errorCode) {
        case SqlError.DuplicateKey:
            return 'A duplicate key was found in the database.';
        case SqlError.ForeignKeyViolation:
            return 'A foreign key constraint was violated.';
        case SqlError.UniqueViolation:
            return 'A unique constraint was violated.';
        case SqlError.InvalidInputSyntax:
            return 'The input syntax is invalid.';
        case SqlError.DataOutOfRange:
            return 'A value is out of range.';
        case SqlError.UndefinedColumn:
            return 'An undefined column was referenced.';
        case SqlError.InvalidColumnReference:
            return 'An invalid column reference was used.';
        case SqlError.InvalidForeignKey:
            return 'An invalid foreign key was used.';
        case SqlError.NotNullViolation:
            return 'A NOT NULL constraint was violated.';
        default:
            return 'An unknown SQL error occurred.';
    }
}