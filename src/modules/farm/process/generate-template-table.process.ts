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
    zipCodeOriginInitial: string
    zipCodeOriginFinal: string
    zipCodeInitial: string
    zipCodeFinal: string
    deadline: string
    excess: string
    zipCodeOriginInitialValue: string
    zipCodeOriginFinalValue: string
    generatePlants: (PlantType.TemplateDeadline | PlantType.TemplateFreight | PlantType.TemplateRate)[]
}
export type PlantWhithHeaders = Plant & {
    headers: FindManyResponse<HeaderModelArgs>
}

export class GenerateTemplateTableProcess extends Process<PerformResult> {
    static readonly ProcessName = 'Generate Template'
    private readonly plantController: PlantController
    private readonly headerController: HeaderController
    params: ProcessParams[]

    constructor(args: ProcessChildrenCreate<PerformResult, ProcessParams>) {
        super({ ...args, name: GenerateTemplateTableProcess.ProcessName, type: EnumProcess.GenerateTemplateTable, order: 6 })

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

        const plantTemplateDeadline = this.generateTemplateDeadline(plantTotal)
        const plantTemplateFreight = this.generateTemplateFreight(plantTotal)
        // const templateRate = this.generateTemplateRate(plantTotal)
    }

    private generateTemplateDeadline(plantTotal: PlantWhithHeaders) {
        const plantTemplateDeadline = this.createBaseTemplate('Template Deadline', PlantType.TemplateDeadline)

        const headersPlantToDeadline = [
            ...this.getHeaderByTypes(plantTotal.headers, HeaderType.ZipCodeInitial, HeaderType.ZipCodeFinal, HeaderType.DeadlineMoreD),
        ]

        const headersTemplate: HeaderModel[] = [
            {
                name: this.params[0].zipCodeOriginInitial || '',
                column: 0,
                type: HeaderType.ZipCodeOriginInitial,
                tableId: plantTemplateDeadline.id,
                createAt: plantTemplateDeadline.createAt,
                updateAt: plantTemplateDeadline.updateAt,
                id: 0,
            },
            {
                name: this.params[0].zipCodeOriginFinal || '',
                column: 1,
                type: HeaderType.ZipCodeOriginFinal,
                tableId: plantTemplateDeadline.id,
                createAt: plantTemplateDeadline.createAt,
                updateAt: plantTemplateDeadline.updateAt,
                id: 0,
            },
        ]

        headersPlantToDeadline.map((headerDeadline, i) => {
            headersTemplate.push({ ...headerDeadline, column: i + 2 })
        })

        this.headerController.createMany({ data: headersTemplate.map(header => ({ ...header, tableId: plantTemplateDeadline.id })) })
    }

    private generateTemplateFreight(plantTotal: PlantWhithHeaders) {
        const plantTemplateFreight = this.createBaseTemplate('Template Freight', PlantType.TemplateFreight)
    }

    private generateTemplateRate(plantTotal: PlantWhithHeaders) {
        const plantTemplateRate = this.createBaseTemplate('Template Rate', PlantType.TemplateRate)
    }

    private createBaseTemplate(name: string, type: PlantType) {
        return this.plantController.create({
            data: {
                farmId: this.farmId,
                name,
                table: [],
                type,
            },
        })
    }

    private getHeaderByTypes(headers: HeaderModel[], ...types: HeaderType[]) {
        return types
            .map(type => this.headerController.filterHeadersByType(headers, type))
            .reduce(function (resultado, fila) {
                return resultado.concat(fila)
            }, [])
    }

    // # Utils
    private getPlantByType(type: PlantType) {
        return this.plantController.findFirstIncludeHeaders({ where: { farmId: { equals: this.farmId }, type: { equals: type } } }) as PlantWhithHeaders
    }
}
