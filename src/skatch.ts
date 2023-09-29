import { FarmController } from './modules/farm/farm.controller.js'
import { EnumProcess } from './modules/farm/process/constants.js'
import { FileController } from './modules/file/file.controller.js'
import { HeaderType } from './modules/header/header.model.js'
import { PlantType } from './modules/plant/plant.model.js'
import { TableController } from './modules/table/table.controller.js'
import { TABLE_CONTENT_DEADLINE, TABLE_CONTENT_FREIGHT } from './test/table.js'

async function App() {
    const tableController = new TableController()
    const farmController = new FarmController()
    const fileController = new FileController()

    const tableDeadline = tableController.converterStringInTable(TABLE_CONTENT_DEADLINE)
    const tableFreight = tableController.converterStringInTable(TABLE_CONTENT_FREIGHT)

    const { farmId } = farmController.createFarm({ name: 'Farm - Test' })

    const farmService = farmController.getFarm(farmId)

    if (!farmService) {
        return
    }

    farmService.insertProcess(
        { type: EnumProcess.ValidZipCodeContained, params: [{ plantType: PlantType.Total }] },
        { type: EnumProcess.IncrementDeadline, params: [{ plantType: PlantType.Total, valueIncrement: 1 }] },
        { type: EnumProcess.ProcvFreightToTotal, params: [{ joinSelectionCriteria: ' ' }] },
        {
            type: EnumProcess.GenerateTemplateTable,
            params: [
                {
                    zipCodeOriginInitialValue: '0',
                    zipCodeOriginFinalValue: '0',
                    zipCodeOriginInitial: 'CEP ORIGEM INICIAL',
                    zipCodeOriginFinal: 'CEP ORIGEM FINAL',
                    zipCodeInitial: 'CEP INICIAL',
                    zipCodeFinal: 'CEP FINAL',
                    deadline: 'PRAZO',
                    excess: 'EXCEDENTE',
                    generatePlants: [PlantType.TemplateDeadline, PlantType.TemplateFreight],
                },
            ],
        }
    )
    farmService.insertPlant(
        {
            table: tableDeadline,
            name: 'Plant Deadline',
            type: PlantType.Deadline,
            headers: [
                { name: 'CEP INICIAL', column: 0, type: HeaderType.ZipCodeInitial },
                { name: 'CEP FINAL', column: 1, type: HeaderType.ZipCodeFinal },
                { name: 'PRAZO', column: 2, type: HeaderType.Deadline },
                { name: 'CS', column: 3, type: HeaderType.CriteriaSelection },
                { name: 'REGIAO', column: 4, type: HeaderType.CriteriaSelection },
                { name: 'GRIS', column: 5, type: HeaderType.Rate },
            ],
        },
        {
            table: tableFreight,
            name: 'Plant Freight',
            type: PlantType.Freight,
            headers: [
                { name: 'CS', column: 0, type: HeaderType.CriteriaSelection },
                { name: 'REGIAO', column: 1, type: HeaderType.CriteriaSelection },
                { name: 'ADV', column: 2, type: HeaderType.Rate },
                { name: 'EXCESS', column: 3, type: HeaderType.Excess },
                { name: '10', column: 4, type: HeaderType.Freight },
                { name: '20', column: 5, type: HeaderType.Freight },
                { name: '30', column: 6, type: HeaderType.Freight },
                { name: '40', column: 7, type: HeaderType.Freight },
                { name: '50', column: 8, type: HeaderType.Freight },
            ],
        }
    )

    farmService.perform()

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
