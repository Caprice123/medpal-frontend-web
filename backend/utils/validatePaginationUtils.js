import { ValidationError } from "../errors/validationError.js"

export class ValidatePaginationUtils {
    static validate(page = 1, perPage = 50) {
        if (page < 1 || perPage < 1) {
            throw new ValidationError('Invalid pagination parameters')
        }

        if (perPage > 100) {
            throw new ValidationError('Invalid pagination parameters')
        }
    }
}