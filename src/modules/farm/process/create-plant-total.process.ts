import { Result } from '../../../lib/result/index.js'
import { PlantController } from '../../plant/plant.controller.js'
import { Process, ProcessChildrenCreate } from '../../process/process.model.js'
import { FarmController } from '../farm.controller.js'
import { EnumProcess } from './constants.js'

export type PerformResult = { message: string; details: { message: string; plant: string }[] }

export type ProcessParams = {}

export class CreatePlantTotalProcess extends Process<PerformResult> {
    private readonly farmController: FarmController
    private readonly plantController: PlantController
    params: ProcessParams[]

    constructor(args: ProcessChildrenCreate<PerformResult, ProcessParams>) {
        super({ ...args, type: EnumProcess.CreatePlantTotal, order: 1 })

        this.params = args.params || []

        this.farmController = new FarmController()
        this.plantController = new PlantController()
    }

    // # Use Case
    perform() {
        try {
            this.result = Result.success<PerformResult>({
                message: 'Create Plant Total successfully',
                details: [],
            })
        } catch (err) {
            if (err instanceof Result) {
                this.result = err as Result<PerformResult>
            }

            this.result = Result.failure({ title: 'Process: Create Plant Total', message: 'Cannot Create Plant Total' })
        }
    }

    // # Logic
}
