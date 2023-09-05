import { Result } from '../../../lib/result/index.js'
import { PlantController } from '../../plant/plant.controller.js'
import { Plant, PlantType } from '../../plant/plant.model.js'
import { ProcessController } from '../../process/process.controller.js'
import { Process, ProcessChildrenCreate } from '../../process/process.model.js'
import { TableController } from '../../table/table.controller.js'

export type PerformResult = { message: string; details: { message: string; plant: string }[] }

export type ProcessParams = {
    plantType: PlantType
    column: number
}

export class OrderTableProcess extends Process<PerformResult> {
    private readonly plantController: PlantController
    private readonly tableController: TableController
    params: ProcessParams[]

    constructor(args: ProcessChildrenCreate) {
        super({ ...args, order: 1 })

        this.params = args.params || []

        this.plantController = new PlantController()
        this.tableController = new TableController()
    }

    // # Use Case
    perform() {
        try {
            const results = this.orderPlants()

            this.result = Result.success<PerformResult>({
                message: 'Tables Ordered successfully',
                details: results.map(result => result.getValue()),
            })
        } catch (err) {
            if (err instanceof Result) {
                this.result = err as Result<PerformResult>
            }

            this.result = Result.failure({ title: 'Process: Order Tables', message: 'Cannot order tables' })
        }
    }

    // # Logic
    private orderPlants() {
        const results = this.params.map(({ column, plantType }) => {
            const plant = this.getPlantByType(plantType)

            if (!plant) {
                return Result.failure<{ message: string; plant: string }>({ title: `Order table "${plantType}"`, message: `Plant ${plantType} not defined` })
            }

            if (!plant.table[0][column]) {
                return Result.failure<{ message: string; plant: string }>({
                    title: `Order table "${plantType}"`,
                    message: `Column not found in plant ${plantType}`,
                })
            }

            const tableOrdered = this.tableController.orderTableByColumn(plant.table, column)

            this.plantController.update({
                where: { id: { equals: plant.id } },
                data: { table: tableOrdered },
            })

            return Result.success<{ message: string; plant: string }>({ message: `Table ${plant.name} ordered successfully`, plant: plant.name })
        })

        return results
    }

    // # Utils
    private getPlantByType(type: PlantType) {
        return this.plantController.findFirst({ where: { farmId: { equals: this.farmId }, type: { equals: type } } }) as Plant
    }
}
