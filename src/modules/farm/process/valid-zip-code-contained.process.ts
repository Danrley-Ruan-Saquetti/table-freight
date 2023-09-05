import { Result } from '../../../lib/result/index.js'
import { PlantController } from '../../plant/plant.controller.js'
import { Plant, PlantType } from '../../plant/plant.model.js'
import { ProcessController } from '../../process/process.controller.js'
import { Process, ProcessChildrenCreate } from '../../process/process.model.js'
import { TableController } from '../../table/table.controller.js'

export type PerformResult = { message: string; details: { message: string; plant: string }[] }

export type ProcessParams = {
    plantType: PlantType
}

export class ValidZipCodeContainedProcess extends Process<PerformResult> {
    private readonly plantController: PlantController
    private readonly tableController: TableController
    private readonly processController: ProcessController
    params: ProcessParams[]

    constructor(args: ProcessChildrenCreate) {
        super({ ...args, order: 2 })

        this.params = args.params || []

        this.plantController = new PlantController()
        this.tableController = new TableController()
        this.processController = new ProcessController()
    }

    // # Use Case
    perform() {
        try {
            const results = this.privateValidZipCodeContained()

            this.result = Result.success<PerformResult>({
                message: 'Valid zip code contained successfully',
                details: results.map(result => result.getValue()),
            })
        } catch (err) {
            if (err instanceof Result) {
                this.result = err as Result<PerformResult>
            }

            this.result = Result.failure({ title: 'Process: Valid Zip Code Contained', message: 'Cannot validate zip code contained' })
        } finally {
            this.processController.update({
                where: { id: { equals: this.id } },
                data: { result: this.result },
            })
        }
    }

    // # Logic
    private privateValidZipCodeContained() {
        const results = this.params.map(({ plantType }) => {
            const plant = this.getPlantByType(plantType)

            if (!plant) {
                return Result.failure<{ message: string; plant: string }>({
                    title: `Valid Zip Code Contained "${plantType}"`,
                    message: `Plant ${plantType} not defined`,
                })
            }

            return Result.success<{ message: string; plant: string }>({ message: `Table ${plant.name} validated successfully`, plant: plant.name })
        })

        return results
    }

    // # Utils
    private getPlantByType(type: PlantType) {
        return this.plantController.findFirst({ where: { farmId: { equals: this.farmId }, type: { equals: type } } }) as Plant
    }
}
