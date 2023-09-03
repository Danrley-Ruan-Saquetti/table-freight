import {
    HeaderRepository,
    HeaderCreateArgs,
    HeaderCreateManyArgs,
    HeaderDeleteArgs,
    HeaderDeleteManyArgs,
    HeaderFindFirstArgs,
    HeaderFindIndexArgs,
    HeaderFindManyArgs,
    HeaderFindManyIndexArgs,
    HeaderUpdateArgs,
    HeaderUpdateManyArgs,
} from './header.repository.js'

export class HeaderController {
    private readonly repository: HeaderRepository

    constructor() {
        this.repository = new HeaderRepository()
    }

    // Repository
    create(args: HeaderCreateArgs) {
        return this.repository.create(args)
    }

    createMany(args: HeaderCreateManyArgs) {
        return this.repository.createMany(args)
    }

    update(args: HeaderUpdateArgs) {
        this.repository.update(args)
    }

    updateMany(args: HeaderUpdateManyArgs) {
        this.repository.updateMany(args)
    }

    delete(args: HeaderDeleteArgs) {
        this.repository.delete(args)
    }

    deleteMany(args: HeaderDeleteManyArgs) {
        this.repository.deleteMany(args)
    }

    findMany(args?: HeaderFindManyArgs) {
        return this.repository.findMany({ orderBy: { column: 'ASC' }, ...args })
    }

    findFirst(args: HeaderFindFirstArgs) {
        const header = this.repository.findFirst(args)

        return header
    }

    findIndex(args: HeaderFindIndexArgs) {
        return this.repository.findIndex(args)
    }

    findManyIndex(args: HeaderFindManyIndexArgs) {
        return this.repository.findManyIndex(args)
    }
}
