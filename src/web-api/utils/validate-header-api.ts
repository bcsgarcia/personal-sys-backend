import { BadRequestException } from "@nestjs/common/exceptions/bad-request.exception";
import { Request } from 'express';


export function validateHeaderApi(request: Request): void {

    const idCompany = request.headers['idcompany'] as string;

    const isIdCompanyInvalid =
        idCompany === null ||
        idCompany === '' ||
        idCompany === undefined;

    if (isIdCompanyInvalid) {
        throw new BadRequestException(`Invalid header`);
    }
}