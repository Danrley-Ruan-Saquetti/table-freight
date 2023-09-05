import { Result } from '../../lib/result/index.js'
import { ProcessController } from './process.controller.js'

export interface ProcessServiceModel {
    processId: number
}

export class ProcessService<ResultType = any, ParamsType = any> {
    protected readonly processController: ProcessController
    protected readonly processId: number

    constructor({ processId }: ProcessServiceModel) {
        this.processId = processId

        this.processController = new ProcessController()
    }

    perform() {
        let result: Result<ResultType>

        try {
            result = this.action()
        } catch (err) {
            if (err instanceof Result) {
                result = err as Result<ResultType>
            } else {
                result = Result.failure<ResultType>({ title: 'Process: Order Tables', message: 'Cannot order tables' })
            }
        }

        this.processController.update({
            where: { id: { equals: this.processId } },
            data: { result: result },
        })
    }

    protected action(): Result<ResultType> {
        throw new Error('Method not implemented')
    }
}
