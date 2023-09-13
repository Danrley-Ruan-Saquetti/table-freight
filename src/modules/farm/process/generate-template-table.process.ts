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
}
export type PlantWhithHeaders = Plant & {
    headers: FindManyResponse<HeaderModelArgs>
}

export class GenerateTemplateTableProcess extends Process<PerformResult> {
    static readonly ProcessName = 'Valid Zip Code Contained'
    private readonly plantController: PlantController
    private readonly headerController: HeaderController
    params: ProcessParams[]

    constructor(args: ProcessChildrenCreate<PerformResult, ProcessParams>) {
        super({ ...args, name: GenerateTemplateTableProcess.ProcessName, type: EnumProcess.GenerateTemplateTable, order: 3 })

        this.params = args.params || []

        this.plantController = new PlantController()
        this.headerController = new HeaderController()
    }

    // # Use Case
    perform() {
        const results = this.performGenerateTemplateTable()

        this.result = Result.success<PerformResult>({
            message: `${this.name} successfully`,
            details: [],
        })
    }

    // # Logic
    private performGenerateTemplateTable() {
        const plantTotal = this.getPlantByType(PlantType.Total)

        console.log(plantTotal)

        const templateDeadline = this.generateTemplateDeadline(plantTotal)
        const templateFreight = this.generateTemplateFreight(plantTotal)
    }

    private generateTemplateDeadline(plantTotal: PlantWhithHeaders) {
        const headers = this.getHeaderByTypes(plantTotal.headers, HeaderType.ZipCodeInitial, HeaderType.ZipCodeFinal, HeaderType.Deadline)

        console.log(plantTotal.headers, headers)
    }

    private generateTemplateFreight(plantTotal: PlantWhithHeaders) {

    }

    private getHeaderByTypes(headers: HeaderModel[], ...types: HeaderType[]) {
        return types.map(type => this.headerController.filterHeadersByType(headers, type)).reduce(function (resultado, fila) {
            return resultado.concat(fila)
          }, [])
    }

    // # Utils
    private getPlantByType(type: PlantType) {
        return this.plantController.findFirstIncludeHeaders({ where: { farmId: { equals: this.farmId }, type: { equals: type } } }) as PlantWhithHeaders
    }
}
