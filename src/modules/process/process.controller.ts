import { Process } from './process.model.js'
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
    ProcessUpdateManyArgs,
} from './process.repository.js'

export class ProcessController {
    private readonly repository: ProcessRepository

    constructor() {
        this.repository = new ProcessRepository()
    }

    createProcess() {}

    // Repository
    create<T = any, P = any>(args: ProcessCreateArgs<T, P>) {
        return this.repository.create(args)
    }

    createMany<T = any, P = any>(args: ProcessCreateManyArgs<T, P>) {
        return this.repository.createMany(args)
    }

    update<T = any, P = any>(args: ProcessUpdateArgs<T, P>) {
        this.repository.update(args)
    }

    updateMany<T = any, P = any>(args: ProcessUpdateManyArgs<T, P>) {
        this.repository.updateMany(args)
    }

    delete<T = any, P = any>(args: ProcessDeleteArgs<T, P>) {
        this.repository.delete(args)
    }

    deleteMany<T = any, P = any>(args: ProcessDeleteManyArgs<T, P>) {
        this.repository.deleteMany(args)
    }

    findMany<T = any, P = any>(args?: ProcessFindManyArgs<T, P>) {
        return this.repository.findMany({ orderBy: { order: 'ASC' }, ...args }).map(process => new Process(process))
    }

    findFirst<T = any, P = any>(args: ProcessFindFirstArgs<T, P>) {
        return this.repository.findFirst(args)
    }

    findIndex<T = any, P = any>(args: ProcessFindIndexArgs<T, P>) {
        return this.repository.findIndex(args)
    }

    findManyIndex<T = any, P = any>(args: ProcessFindManyIndexArgs<T, P>) {
        return this.repository.findManyIndex(args)
    }
}
