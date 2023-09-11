import { Result } from '../../../lib/result/index.js'
import { PlantController } from '../../plant/plant.controller.js'
import { Plant, PlantType } from '../../plant/plant.model.js'
import { TableController } from '../../table/table.controller.js'

export class OrderTableUtil {
    private readonly plantController: PlantController
    private readonly tableController: TableController

    constructor(private readonly farmId: number) {
        this.plantController = new PlantController()
        this.tableController = new TableController()
    }

    // # Use Case
    perform(column: number, plantType: PlantType) {
        return this.orderPlants(column, plantType)
    }

    // # Logic
    private orderPlants(column: number, plantType: PlantType) {
        const plant = this.getPlantByType(plantType)

        if (!plant) {
            return Result.failure<{ message: string; plant: string }>({ title: `Util: Order Table "${plantType}"`, message: `Plant ${plantType} not defined` })
        }

        if (!plant.table[0][column]) {
            return Result.failure<{ message: string; plant: string }>({
                title: `Util: Order Table "${plantType}"`,
                message: `Column not found in plant ${plantType}`,
            })
        }

        const tableOrdered = this.tableController.orderTableByColumn(plant.table, column)

        this.plantController.update({
            where: { id: { equals: plant.id } },
            data: { table: tableOrdered },
        })

        return Result.success<{ message: string; plant: string }>({
            message: `Column not found in plant ${plantType}`,
            plant: plant.name,
        })
    }

    // # Utils
    private getPlantByType(type: PlantType) {
        return this.plantController.findFirst({ where: { farmId: { equals: this.farmId }, type: { equals: type } } }) as Plant
    }
}
