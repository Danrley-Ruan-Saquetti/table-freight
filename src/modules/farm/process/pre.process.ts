import { HeaderController } from '../../header/header.controller.js'
import { HeaderType } from '../../header/header.model.js'
import { PlantController } from '../../plant/plant.controller.js'
import { PlantType } from '../../plant/plant.model.js'
import { ProcessController } from '../../process/process.controller.js'
import { FarmController } from '../farm.controller.js'
import { EnumProcess } from './constants.js'
import { ProcessRelations } from './index.js'

export interface PreProcessModel {
    farmId: number
}

export class PreProcess implements PreProcessModel {
    private readonly farmController: FarmController
    private readonly processController: ProcessController
    private readonly plantController: PlantController
    private readonly headerController: HeaderController
    readonly farmId: number

    constructor({ farmId }: PreProcessModel) {
        this.farmId = farmId

        this.farmController = new FarmController()
        this.processController = new ProcessController()
        this.plantController = new PlantController()
        this.headerController = new HeaderController()
    }

    // # Use Case
    perform() {
        const getPerformPreProcess = (type: EnumProcess) => {
            switch (type) {
                case EnumProcess.OrderTable:
                    return this.OrderTable
                case EnumProcess.CreatePlantTotal:
                    return this.CreatePlantTotal
            }

            return () => {}
        }

        this.getProcess().map(process => {
            const preProcess = this.getPreProcess(process.type)

            preProcess.map(pre => this.performPreProcess(pre, process.type))
        })
    }

    private performPreProcess(type: EnumProcess, parent: EnumProcess) {
        switch (type) {
            case EnumProcess.CreatePlantTotal:
                return this.CreatePlantTotal(parent)
            case EnumProcess.OrderTable:
                return this.OrderTable(parent)
        }
    }

    // # Logic
    private CreatePlantTotal(parentType: EnumProcess) {
        if (this.verifyIfAlreadyExistsProcess(EnumProcess.CreatePlantTotal)) {
            return
        }

        const plant = this.plantController.findFirst({ where: { farmId: { equals: this.farmId }, type: { equals: PlantType.Deadline } } })

        if (!plant) {
            return
        }

        this.getFarmService().insertProcess({ type: EnumProcess.CreatePlantTotal })
    }

    private OrderTable(parentType: EnumProcess) {
        if (this.verifyIfAlreadyExistsProcess(EnumProcess.OrderTable)) {
            return
        }

        const plant = this.plantController.findFirst({ where: { farmId: { equals: this.farmId }, type: { equals: PlantType.Deadline } } })

        if (!plant) {
            return
        }

        const headers = this.headerController.findMany({ where: { tableId: { equals: plant.id } } })

        const header = this.headerController.filterHeadersByType(headers, HeaderType.ZipCodeInitial)[0]

        if (!header) {
            return
        }

        this.getFarmService().insertProcess({ type: EnumProcess.OrderTable, params: [{ plantType: PlantType.Deadline, column: header.column }] })
    }

    // # Utils
    private verifyIfAlreadyExistsProcess(type: EnumProcess) {
        return !!this.processController.findFirst({ where: { farmId: { equals: this.farmId }, type: { equals: type } } })
    }

    // # Repository
    private getPreProcess(typeProcess: EnumProcess) {
        return ProcessRelations[typeProcess].preProcess || []
    }

    private getProcess() {
        return this.processController.findMany({ where: { farmId: { equals: this.farmId } } })
    }

    private getFarmService() {
        return this.farmController.getFarm(this.farmId)
    }
}
