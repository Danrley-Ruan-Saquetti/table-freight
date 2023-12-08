import { FindManyResponse } from '../../../lib/repository-memory/index.js'
import { Result } from '../../../lib/result/index.js'
import { HeaderController } from '../../header/header.controller.js'
import { HeaderModel, HeaderModelArgs, HeaderType } from '../../header/header.model.js'
import { PlantController } from '../../plant/plant.controller.js'
import { Plant, PlantType } from '../../plant/plant.model.js'
import { Process, ProcessChildrenCreate } from '../../process/process.model.js'
import { FarmController } from '../farm.controller.js'
import { EnumProcess } from './constants.js'

export type PerformResult = { message: string; details: Result<{ message: string }>[] }

export type ProcessParams = {}

export type PlantWhithHeaders = Plant & {
    headers: FindManyResponse<HeaderModelArgs>
}

export class CreatePlantTotalProcess extends Process<PerformResult> {
    static readonly ProcessName = 'Create Plant Total'
    private readonly farmController: FarmController
    private readonly plantController: PlantController
    private readonly headerController: HeaderController

    constructor(args: ProcessChildrenCreate<PerformResult, ProcessParams>) {
        super({ ...args, type: EnumProcess.CreatePlantTotal, order: 1, name: CreatePlantTotalProcess.ProcessName })

        this.farmController = new FarmController()
        this.plantController = new PlantController()
        this.headerController = new HeaderController()
    }

    // # Use Case
    perform() {
        const result = this.createPlantTotal()
        const results = this.insertColunsInTotal()

        this.result = Result.inherit({
            ok: result.isSuccess(),
            error: result.getError(),
            status: result.getStatus(),
            value: {
                ...result.getValue(),
                details: results,
            },
        })
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
            details: [],
        })
    }

    private insertColunsInTotal() {
        const results: Result<{ message: string }>[] = []

        const plantTotal = this.getPlantByType(PlantType.Total)
        const plantDeadline = this.getPlantByType(PlantType.Deadline)

        const headersDeadelineInTotal = [
            ...this.headerController.filterHeadersByType(plantDeadline.headers, HeaderType.ZipCodeInitial),
            ...this.headerController.filterHeadersByType(plantDeadline.headers, HeaderType.ZipCodeFinal),
            ...this.headerController.filterHeadersByType(plantDeadline.headers, HeaderType.Deadline),
            ...this.headerController.filterHeadersByType(plantDeadline.headers, HeaderType.Rate),
            ...this.headerController.filterHeadersByType(plantDeadline.headers, HeaderType.CriteriaSelection),
        ]

        const headersTotal: HeaderModel[] = []

        let columnIndex = 0
        headersDeadelineInTotal.map((headerDeadline, j) => {
            for (let i = 0; i < plantDeadline.table.length; i++) {
                if (typeof plantTotal.table[i] == 'undefined') {
                    plantTotal.table.push([])
                }

                plantTotal.table[i][columnIndex] = plantDeadline.table[i][headerDeadline.column]
            }

            columnIndex++
            headersTotal.push({ ...headerDeadline, column: j })
        })

        this.headerController.createMany({
            data: headersTotal.map(header => ({
                ...header,
                tableId: plantTotal.id,
            })),
        })

        this.plantController.update({
            where: {
                id: { equals: plantTotal.id },
            },
            data: {
                table: plantTotal.table,
            },
        })

        return results
    }

    // # Utils
    private getPlantByType(type: PlantType) {
        return this.plantController.findFirstIncludeHeaders({ where: { farmId: { equals: this.farmId }, type: { equals: type } } }) as PlantWhithHeaders
    }
}
