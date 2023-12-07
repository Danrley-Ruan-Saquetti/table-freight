import { FarmController } from './modules/farm/farm.controller.js'
import { EnumProcess } from './modules/farm/process/constants.js'
import { FileController } from './modules/file/file.controller.js'
import { HeaderType } from './modules/header/header.model.js'
import { PlantType } from './modules/plant/plant.model.js'
import { TableController } from './modules/table/table.controller.js'
import { TABLE_CONTENT_DEADLINE, TABLE_CONTENT_FREIGHT, TABLE_CONTENT_TOTAL } from './test/table.js'

window.onload = App

async function App() {
    const tableController = new TableController()
    const farmController = new FarmController()
    const fileController = new FileController()

    const tableFarm = tableController.converterStringInTable(TABLE_CONTENT_TOTAL)
    const tableDeadline = tableController.converterStringInTable(TABLE_CONTENT_DEADLINE)
    const tableFreight = tableController.converterStringInTable(TABLE_CONTENT_FREIGHT)

    const { farmId } = farmController.createFarm({ name: 'Farm - Test' })

    const farmService = farmController.getFarm(farmId)

    if (!farmService) {
        return
    }

    farmService.insertProcess(
        // { type: EnumProcess.GenerateTemplateTable, params: [{ joinSelectionCriteria: ' ', zipCodeOriginInitial: '', zipCodeOriginFinal: '' }] },
        {
            type: EnumProcess.GenerateTemplateTable,
            params: [
                {
                    zipCodeOriginInitialValue: '95708200',
                    zipCodeOriginFinalValue: '95708200',
                    zipCodeOriginInitial: 'CEP ORIGEM INICIAL',
                    zipCodeOriginFinal: 'CEP ORIGEM FINAL',
                    zipCodeInitial: 'CEP INICIAL',
                    zipCodeFinal: 'CEP FINAL',
                    deadline: 'PRAZO',
                    excess: 'EXCEDENTE',
                    generatePlants: [PlantType.TemplateDeadline, PlantType.TemplateFreight, PlantType.Total],
                },
            ],
        }
    )
    farmService.insertPlant(
        {
            table: tableFarm,
            name: 'Plant Farm',
            type: PlantType.Total,
            headers: [
                { name: 'CEP INICIAL', column: 0, type: HeaderType.ZipCodeInitial },
                { name: 'CEP FINAL', column: 1, type: HeaderType.ZipCodeFinal },
                { name: 'D + 1', column: 8, type: HeaderType.DeadlineMoreD },
                { name: 'EXCEDENTE', column: 9, type: HeaderType.Excess },
                { name: '10', column: 10, type: HeaderType.Freight },
                { name: '20', column: 11, type: HeaderType.Freight },
                { name: '30', column: 12, type: HeaderType.Freight },
                { name: '40', column: 13, type: HeaderType.Freight },
                { name: '50', column: 14, type: HeaderType.Freight },
                { name: '70', column: 15, type: HeaderType.Freight },
                { name: '100', column: 16, type: HeaderType.Freight },
                { name: 'TDA', column: 17, type: HeaderType.Rate },
                { name: 'ADV', column: 18, type: HeaderType.Rate },
            ],
        },
        // {
        //     table: tableDeadline,
        //     name: 'Plant Deadline',
        //     type: PlantType.Deadline,
        //     headers: [
        //         { name: 'CEP INICIAL', column: 0, type: HeaderType.ZipCodeInitial },
        //         { name: 'CEP FINAL', column: 1, type: HeaderType.ZipCodeFinal },
        //         { name: 'PRAZO', column: 2, type: HeaderType.Deadline },
        //         { name: 'CS', column: 3, type: HeaderType.CriteriaSelection },
        //         { name: 'REGIAO', column: 4, type: HeaderType.CriteriaSelection },
        //         { name: 'GRIS', column: 5, type: HeaderType.Rate },
        //     ],
        // },
        // {
        //     table: tableFreight,
        //     name: 'Plant Freight',
        //     type: PlantType.Freight,
        //     headers: [
        //         { name: 'CS', column: 0, type: HeaderType.CriteriaSelection },
        //         { name: 'REGIAO', column: 1, type: HeaderType.CriteriaSelection },
        //         { name: 'ADV', column: 2, type: HeaderType.Rate },
        //         { name: 'EXCESS', column: 3, type: HeaderType.Excess },
        //         { name: '10', column: 4, type: HeaderType.Freight },
        //         { name: '20', column: 5, type: HeaderType.Freight },
        //         { name: '30', column: 6, type: HeaderType.Freight },
        //         { name: '40', column: 7, type: HeaderType.Freight },
        //         { name: '50', column: 8, type: HeaderType.Freight },
        //     ],
        // }
    )

    farmService.perform()

    console.log(farmService.getState())

    const files = farmService.getPlants().map(({ table, name }) => {
        const tableInString = tableController.converterTableInString(table)
        const file = fileController.createFile({ content: [tableInString] })

        return { file, name: `${name}.csv` }
    })

    const url = await fileController.createURLDownloadZip(files)

    const tagDownload = document.createElement('a')

    tagDownload.setAttribute('href', url)
    tagDownload.setAttribute('download', `${farmService.getFarm().name}.zip`)

    tagDownload.innerHTML = 'Download'

    document.body.appendChild(tagDownload)
}
