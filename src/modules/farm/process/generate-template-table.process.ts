import { FindManyResponse } from '../../../lib/repository-memory/index.js'
import { Result } from '../../../lib/result/index.js'
import { HeaderController } from '../../header/header.controller.js'
import { HeaderModel, HeaderModelArgs, HeaderType } from '../../header/header.model.js'
import { PlantController } from '../../plant/plant.controller.js'
import { Plant, PlantType } from '../../plant/plant.model.js'
import { Process, ProcessChildrenCreate } from '../../process/process.model.js'
import { TableController } from '../../table/table.controller.js'
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
    private readonly tableController: TableController
    params: ProcessParams[]

    constructor(args: ProcessChildrenCreate<PerformResult, ProcessParams>) {
        super({ ...args, name: GenerateTemplateTableProcess.ProcessName, type: EnumProcess.GenerateTemplateTable, order: 6 })

        this.params = args.params || []

        this.plantController = new PlantController()
        this.headerController = new HeaderController()
        this.tableController = new TableController()
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

        this.generateTemplateDeadline(plantTotal)
        this.generateTemplateFreight(plantTotal)
        this.generateTemplatesRate(plantTotal)
    }

    private generateTemplateDeadline(plantTotal: PlantWhithHeaders) {
        const plantTemplateDeadline = this.createBaseTemplate('Template Deadline', PlantType.TemplateDeadline)

        const headersPlantToTemplate = [
            ...this.getHeadersByTypes(plantTotal.headers, HeaderType.ZipCodeInitial, HeaderType.ZipCodeFinal, HeaderType.DeadlineMoreD),
        ]

        const headersTemplate: (HeaderModel & { value?: string; columnOriginTotal?: number })[] = [
            {
                name: this.getNameHeaderByType(HeaderType.ZipCodeOriginInitial),
                column: 0,
                type: HeaderType.ZipCodeOriginInitial,
                tableId: plantTemplateDeadline.id,
                createAt: plantTemplateDeadline.createAt,
                updateAt: plantTemplateDeadline.updateAt,
                id: 0,
                value: this.params[0].zipCodeOriginInitialValue,
            },
            {
                name: this.getNameHeaderByType(HeaderType.ZipCodeOriginFinal),
                column: 1,
                type: HeaderType.ZipCodeOriginFinal,
                tableId: plantTemplateDeadline.id,
                createAt: plantTemplateDeadline.createAt,
                updateAt: plantTemplateDeadline.updateAt,
                id: 0,
                value: this.params[0].zipCodeOriginFinalValue,
            },
        ]

        headersPlantToTemplate.map((headerDeadline, i) => {
            const header: HeaderModel & { columnOriginTotal?: number } = {
                name: this.getNameHeaderByType(headerDeadline.type),
                column: i + 2,
                type: headerDeadline.type,
                tableId: headerDeadline.tableId,
                id: headerDeadline.id,
                createAt: headerDeadline.createAt,
                updateAt: headerDeadline.updateAt,
                columnOriginTotal: headerDeadline.column,
            }

            headersTemplate.push(header)
        })

        this.generateTemplate(headersTemplate, plantTemplateDeadline, plantTotal)
    }

    private generateTemplateFreight(plantTotal: PlantWhithHeaders) {
        const plantTemplateFreight = this.createBaseTemplate('Template Freight', PlantType.TemplateFreight)

        const headersPlantToTemplate = [
            ...this.getHeadersByTypes(plantTotal.headers, HeaderType.ZipCodeInitial, HeaderType.ZipCodeFinal, HeaderType.Excess, HeaderType.Freight),
        ]

        const headersTemplate: (HeaderModel & { value?: string; columnOriginTotal?: number })[] = [
            {
                name: this.getNameHeaderByType(HeaderType.ZipCodeOriginInitial),
                column: 0,
                type: HeaderType.ZipCodeOriginInitial,
                tableId: plantTemplateFreight.id,
                createAt: plantTemplateFreight.createAt,
                updateAt: plantTemplateFreight.updateAt,
                id: 0,
                value: this.params[0].zipCodeOriginInitialValue,
            },
            {
                name: this.getNameHeaderByType(HeaderType.ZipCodeOriginFinal),
                column: 1,
                type: HeaderType.ZipCodeOriginFinal,
                tableId: plantTemplateFreight.id - 1,
                createAt: plantTemplateFreight.createAt,
                updateAt: plantTemplateFreight.updateAt,
                id: 0,
                value: this.params[0].zipCodeOriginFinalValue,
            },
        ]

        headersPlantToTemplate.map((headerDeadline, i) => {
            const header: HeaderModel & { columnOriginTotal?: number } = {
                name: headerDeadline.type == HeaderType.Freight ? headerDeadline.name : this.getNameHeaderByType(headerDeadline.type),
                column: i + 2,
                type: headerDeadline.type,
                tableId: headerDeadline.tableId,
                id: headerDeadline.id,
                createAt: headerDeadline.createAt,
                updateAt: headerDeadline.updateAt,
                columnOriginTotal: headerDeadline.column,
            }

            headersTemplate.push(header)
        })

        this.generateTemplate(headersTemplate, plantTemplateFreight, plantTotal)
    }

    private generateTemplatesRate(plantTotal: PlantWhithHeaders) {
        const headersRate = this.getHeadersByTypes(plantTotal.headers, HeaderType.Rate)

        const valuesRate = headersRate.map(header => ({
            name: header.name,
            column: header.column,
            values: this.tableController.getDistinctColumnValues(plantTotal.table, header.column, [0]),
        }))

        valuesRate
            .filter(({ values }) => values)
            .map(({ name, values, column }) => values.map(value => value && this.generateTemplateRate(plantTotal, name, value, column)))
    }

    private generateTemplateRate(plantTotal: PlantWhithHeaders, name: string, value: string, column: number) {
        const plantTemplateRate = this.createBaseTemplate(`Template Rate - ${name}: ${value}`, PlantType.TemplateRate)

        const headersPlantToTemplate = [...this.getHeadersByTypes(plantTotal.headers, HeaderType.ZipCodeInitial, HeaderType.ZipCodeFinal)]

        const headersTemplate: (HeaderModel & { value?: string; columnOriginTotal?: number })[] = [
            {
                name: this.getNameHeaderByType(HeaderType.ZipCodeOriginInitial),
                column: 0,
                type: HeaderType.ZipCodeOriginInitial,
                tableId: plantTemplateRate.id,
                createAt: plantTemplateRate.createAt,
                updateAt: plantTemplateRate.updateAt,
                id: 0,
                value: this.params[0].zipCodeOriginInitialValue,
            },
            {
                name: this.getNameHeaderByType(HeaderType.ZipCodeOriginFinal),
                column: 1,
                type: HeaderType.ZipCodeOriginFinal,
                tableId: plantTemplateRate.id - 1,
                createAt: plantTemplateRate.createAt,
                updateAt: plantTemplateRate.updateAt,
                id: 0,
                value: this.params[0].zipCodeOriginFinalValue,
            },
        ]

        headersPlantToTemplate.map((headerDeadline, i) => {
            const header: HeaderModel & { columnOriginTotal?: number } = {
                name: this.getNameHeaderByType(headerDeadline.type),
                column: i + 2,
                type: headerDeadline.type,
                tableId: headerDeadline.tableId,
                id: headerDeadline.id,
                createAt: headerDeadline.createAt,
                updateAt: headerDeadline.updateAt,
                columnOriginTotal: headerDeadline.column,
            }

            headersTemplate.push(header)
        })

        this.generateTemplate(headersTemplate, plantTemplateRate, plantTotal, { value, column })
    }

    private generateTemplate(
        headersTemplate: (HeaderModel & { value?: string; columnOriginTotal?: number })[],
        plantTemplate: Plant,
        plantBase: Plant,
        valueAccept?: { column: number; value: string }
    ) {
        headersTemplate.map(header => {
            if (typeof plantTemplate.table[0] == 'undefined') {
                plantTemplate.table.push([])
            }

            plantTemplate.table[0][header.column] = header.name || ''
        })

        for (let i = 1; i < plantBase.table.length; i++) {
            if (typeof valueAccept != 'undefined') {
                if (valueAccept.value != plantBase.table[i][valueAccept.column]) {
                    continue
                }
            }

            if (typeof plantTemplate.table[i] == 'undefined') {
                plantTemplate.table.push([])
            }

            headersTemplate.map(header => {
                if (typeof header.value == 'undefined') {
                    plantTemplate.table[plantTemplate.table.length - 1][header.column] =
                        typeof header.columnOriginTotal != 'undefined' ? plantBase.table[i][header.columnOriginTotal] || '' : ''
                } else {
                    plantTemplate.table[plantTemplate.table.length - 1][header.column] = header.value || ''
                }
            })
        }

        this.headerController.createMany({
            data: headersTemplate.map(header => ({
                name: header.name,
                column: header.column,
                type: header.type,
                tableId: plantTemplate.id,
            })),
        })
        this.plantController.update({
            where: {
                id: { equals: plantTemplate.id },
            },
            data: {
                table: plantTemplate.table,
            },
        })
    }

    private getNameHeaderByType(type: HeaderType) {
        const NAMES: { [x in keyof typeof HeaderType]?: string } = {
            ZipCodeOriginInitial: this.params[0].zipCodeOriginInitial,
            ZipCodeOriginFinal: this.params[0].zipCodeOriginFinal,
            ZipCodeFinal: this.params[0].zipCodeFinal,
            ZipCodeInitial: this.params[0].zipCodeInitial,
            DeadlineMoreD: this.params[0].deadline,
            Excess: this.params[0].excess,
        }

        const name = NAMES[type] || ''

        return name
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

    private getHeadersByTypes(headers: HeaderModel[], ...types: HeaderType[]) {
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
