import { Result } from '../../lib/result/index.js'
import { EnumProcess, ProcessInstance } from '../farm/process/index.js'
import { ProcessController } from './process.controller.js'
import { ProcessModel } from './process.model.js'

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
            const process = this.getProcess()

            const Instace = this.getProcessInstanceByType(process.type)

            const processInstance = new Instace(process)

            processInstance.perform()

            result = processInstance.result
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

    protected getProcess() {
        return this.processController.findFirst<ResultType, ParamsType>({ where: { id: { equals: this.processId } } }) as ProcessModel<ResultType, ParamsType>
    }

    protected getProcessInstanceByType(type: EnumProcess) {
        return ProcessInstance[type]
    }
}
