import { ValidationError } from "../../errors/validationError.js";
import prisma from "../../prisma/client.js";
import { ValidatePaginationUtils } from "../../utils/validatePaginationUtils.js";
import validator from "validator";
import { BaseService } from "../baseService.js";

export class GetListUsersService extends BaseService {
    static async call(filters = {}) {
        this.validate(filters)

        const email = filters.email
        const page = Number(filters.page) || 1
        const perPage = Number(filters.perPage) || 50

        const where = {}

        if (email) {
            where.email = email
        }

        const users = await prisma.users.findMany({
            where,
            orderBy: [
                { name: 'asc' }
            ],
            include: {
                user_subscription: {
                    where: {
                        start_date: {
                            gte: new Date()
                        },
                        end_date: {
                            lte: new Date()
                        }
                    },
                    select: {
                        start_date: true,
                        end_date: true,
                    }
                },
                user_credit: {
                    select: {
                        balance: true,
                    }
                }
            },
            orderBy: {
                id: 'desc'
            },
            skip: (page - 1) * perPage,
            take: perPage + 1
        })

        const isLastPage = users.length > perPage
        const usersToReturn = isLastPage ? users.slice(0, perPage) : users
        return { users: usersToReturn, isLastPage }
    }

    static validate(filters) {
        ValidatePaginationUtils.validate(Number(filters.page), Number(filters.perPage))

        if (filters.email) {
            const isEmailValid = validator.isEmail(filters.email)
            if (!isEmailValid) {
                throw new ValidationError("Email tidak valid")
            }
        }
    }
}