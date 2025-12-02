import { ValidationError } from "../errors/validationError.js"

export class ValidationUtils {
    static async validate_fields({ request, requiredFields = [], optionalFields = [] }) {
        const collectedRequest = { ...request.params, ...request.query, ...request.body }

        for (let field of requiredFields) {
            const value = collectedRequest[field]

            // Check if value is missing, null, or undefined
            if (value === null || value === undefined) {
                throw new ValidationError(`Params ${field} tidak boleh kosong`)
            }

            // For strings, check if empty after trim
            if (typeof value === 'string' && value.trim().length === 0) {
                throw new ValidationError(`Params ${field} tidak boleh kosong`)
            }
        }
    }
}