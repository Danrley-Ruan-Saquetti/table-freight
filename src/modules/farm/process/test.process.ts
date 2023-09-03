import { Result } from '../../../lib/result/index.js'
import { Process } from './../../process/process.model.js'

export class TestProcess implements Process {
    readonly farmId: number

    constructor(farmId: number) {
        this.farmId = farmId
    }

    perform() {
        return Result.success<{ message: string }>({ message: 'Hello World' })
    }
}