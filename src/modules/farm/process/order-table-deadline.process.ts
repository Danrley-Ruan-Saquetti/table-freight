import { Table } from '../../../@types/index.js'
import { Document, FindManyResponse } from '../../../lib/repository-memory/index.js'
import { Result } from '../../../lib/result/index.js'
import { HeaderController } from '../../header/header.controller.js'
import { HeaderModelArgs, HeaderType } from '../../header/header.model.js'
import { PlantController } from '../../plant/plant.controller.js'
import { PlantType } from '../../plant/plant.model.js'
import { Process } from '../../process/process.model.js'
import { TableController } from '../../table/table.controller.js'
import { EnumProcess } from './index.js'

export type PerformResult = { message: string }
type TableModel = {
    headers: FindManyResponse<HeaderModelArgs>;
    name: string;
    type: PlantType;
    table: Table;
    farmId: number;
    id: number;
    createAt: Date;
    updateAt: Date;
}

export class OrderTableDeadlineProcess extends Process<PerformResult> {
    private readonly plantController: PlantController
    private readonly tableController: TableController
    private readonly headerController: HeaderController

    constructor(farmId: number) {
        super({ farmId, type: EnumProcess.OrderTableDeadline, order: 1 })

        this.plantController = new PlantController()
        this.tableController = new TableController()
        this.headerController = new HeaderController()
    }

    // # Use Case
    perform() {
        try {
            this.validPerform()
            this.orderPlantsByZipCodeInitial()

            return Result.success<PerformResult>({ message: 'Table Deadline Ordered' })
        } catch (err) {
            if (err instanceof Result) {
                return err as Result<PerformResult>
            }

            return Result.failure({ title: 'Process: Order Table Deadline', message: 'Cannot order table deadline' })
        }
    }

    private validPerform() {
        if (!this.getPlantDeadline()) {
            throw Result.failure<PerformResult>({ title: 'Process: Validate Zip Code', message: 'Cannot validate zip code in plant deadline', causes: [{ message: '"Plant Deadline" not defined', origin: 'Plant Deadline' }] })
        }
        if (!this.getHeaderZipCodeInitialOfPlantDeadline()) {
            throw Result.failure<PerformResult>({ title: 'Process: Validate Zip Code', message: 'Cannot order table deadline', causes: [{ message: '"Header Zip Code Initial" in plant Deadline not defined', origin: 'Header Zip Code Initial' }] })
        }
    }

    // # Logic
    private orderPlantsByZipCodeInitial() {
        const tableDeadline = this.getPlantDeadline()
        const headerZipCodeInitial = this.getHeaderZipCodeInitialOfPlantDeadline()

        this.tableController.orderTableByColumn(tableDeadline.table, headerZipCodeInitial.column)

        console.log(tableDeadline, headerZipCodeInitial)
    }

    // # Utils
    private getPlantDeadline() {
        return this.plantController.findFirstIncludeHeaders({ where: { farmId: { equals: this.farmId }, type: { equals: PlantType.Deadline } } }) as TableModel
    }

    private getHeaderZipCodeInitialOfPlantDeadline() {
        const tableDeadline = this.getPlantDeadline()

        return this.headerController.findFirst({ where: { tableId: { equals: tableDeadline.id }, type: { equals: HeaderType.ZipCodeInitial } } }) as Document<HeaderModelArgs>

    }
}