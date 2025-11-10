export class BaseService {
    static call(...args) {
        return new this(...args).call()
    }
}
