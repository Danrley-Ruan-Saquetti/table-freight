import { Result } from '../../../lib/result/index.js'
import { PlantController } from '../../plant/plant.controller.js'
import { PlantType } from '../../plant/plant.model.js'
import { Process, ProcessChildrenCreate } from '../../process/process.model.js'
import { FarmController } from '../farm.controller.js'
import { EnumProcess } from './constants.js'

export type PerformResult = { message: string }

export type ProcessParams = {}

export class CreatePlantTotalProcess extends Process<PerformResult> {
    static readonly ProcessName = 'Create Plant Total'
    private readonly farmController: FarmController
    params: ProcessParams[]

    constructor(args: ProcessChildrenCreate<PerformResult, ProcessParams>) {
        super({ ...args, type: EnumProcess.CreatePlantTotal, order: 1, name: CreatePlantTotalProcess.ProcessName })

        this.params = args.params || []

        this.farmController = new FarmController()
    }

    // # Use Case
    perform() {
        this.result = this.createPlantTotal()
    }

    // # Logic
    private createPlantTotal() {
        const farm = this.farmController.getFarm(this.farmId)

        farm.insertPlant({
            headers: [],
            table: [],
            name: 'Plant Total',
            type: PlantType.Total,
        })

        return Result.success<PerformResult>({
            message: `${this.name} successfully`,
        })
    }
}
