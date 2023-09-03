import {
    ProcessRepository,
    ProcessCreateArgs,
    ProcessCreateManyArgs,
    ProcessDeleteArgs,
    ProcessDeleteManyArgs,
    ProcessFindFirstArgs,
    ProcessFindIndexArgs,
    ProcessFindManyArgs,
    ProcessFindManyIndexArgs,
    ProcessUpdateArgs,
    ProcessUpdateManyArgs
} from './process.repository'

export class ProcessController {
    private readonly repository: ProcessRepository

    constructor() {
        this.repository = new ProcessRepository()
    }

    // Repository
    create(args: ProcessCreateArgs) {
        return this.repository.create(args)
    }

    createMany(args: ProcessCreateManyArgs) {
        return this.repository.createMany(args)
    }

    update(args: ProcessUpdateArgs) {
        this.repository.update(args)
    }

    updateMany(args: ProcessUpdateManyArgs) {
        this.repository.updateMany(args)
    }

    delete(args: ProcessDeleteArgs) {
        this.repository.delete(args)
    }

    deleteMany(args: ProcessDeleteManyArgs) {
        this.repository.deleteMany(args)
    }

    findMany(args?: ProcessFindManyArgs) {
        return this.repository.findMany({
            orderBy: { column: 'ASC' },
            ...args
        })
    }

    findFirst(args: ProcessFindFirstArgs) {
        const header = this.repository.findFirst(args)

        return header
    }

    findIndex(args: ProcessFindIndexArgs) {
        return this.repository.findIndex(args)
    }

    findManyIndex(args: ProcessFindManyIndexArgs) {
        return this.repository.findManyIndex(args)
    }
}