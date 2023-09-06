import { FindManyResponse } from '../../../lib/repository-memory/index.js'
import { Result } from '../../../lib/result/index.js'
import { HeaderController } from '../../header/header.controller.js'
import { HeaderModel, HeaderModelArgs, HeaderType } from '../../header/header.model.js'
import { PlantController } from '../../plant/plant.controller.js'
import { Plant, PlantType } from '../../plant/plant.model.js'
import { Process, ProcessChildrenCreate } from '../../process/process.model.js'
import { EnumProcess } from './constants.js'

export type PerformResult = { message: string; details: { message: string; plant: string }[] }

export type ProcessParams = {
    plantType: PlantType
    valueIncrement: number
}
export type PlantWhithHeaders = Plant & {
    headers: FindManyResponse<HeaderModelArgs>
}

export class IncrementDeadlineProcess extends Process<PerformResult> {
    static readonly ProcessName = 'Increment Deadline'
    private readonly plantController: PlantController
    private readonly headerController: HeaderController
    params: ProcessParams[]

    constructor(args: ProcessChildrenCreate<PerformResult, ProcessParams>) {
        super({ ...args, name: IncrementDeadlineProcess.ProcessName, type: EnumProcess.IncrementDeadline, order: 4 })

        this.params = args.params || []

        this.plantController = new PlantController()
        this.headerController = new HeaderController()
    }

    // # Use Case
    perform() {
        const results = this.incrementDeadlineInPlants()

        this.result = Result.success<PerformResult>({
            message: `${this.name} successfully`,
            details: results.map(result => result.getValue()),
        })
    }

    // # Logic
    private incrementDeadlineInPlants() {
        const results = this.params.map(({ plantType, valueIncrement }) => {
            const plant = this.getPlantByType(plantType)

            if (!plant) {
                return Result.failure<{ message: string; plant: string }>({
                    title: `${this.name} "${plantType}"`,
                    message: `Plant ${plantType} not defined`,
                })
            }

            try {
                return this.incrementDeadline(plant, valueIncrement)
            } catch (err) {
                if (err instanceof Result) {
                    return err as Result<{ message: string; plant: string }>
                }

                return Result.failure<{ message: string; plant: string }>({
                    title: `Process: ${this.name}`,
                    message: `Cannot ${this.name} in plant "${plant.name}"`,
                })
            }
        })

        return results
    }

    private incrementDeadline(plant: PlantWhithHeaders, valueDeadline: number) {
        const { table, headers } = plant

        const { headerDeadline } = this.getHeaderDeadline(headers)

        return Result.success<{ message: string; plant: string; warnings: Result[] }>({
            message: `Incremented deadline in Table ${plant.name} successfully`,
            plant: plant.name,
            warnings: [],
        })
    }

    private getHeaderDeadline(headers: HeaderModel[]) {
        const headerDeadline = this.headerController.filterHeadersByType(headers, HeaderType.Deadline)[0]

        if (!headerDeadline) {
            throw Result.failure({ title: `Process: ${this.name}`, message: 'Header "Deadline" not defined' })
        }

        return { headerDeadline }
    }

    // # Utils
    private getPlantByType(type: PlantType) {
        return this.plantController.findFirstIncludeHeaders({ where: { farmId: { equals: this.farmId }, type: { equals: type } } }) as PlantWhithHeaders
    }
}
