import { ModelSchema } from './common/repository.js'
import { FarmController } from './modules/farm/farm.controller.js'
import { EnumProcess } from './modules/farm/process/constants.js'
import { HeaderType } from './modules/header/header.model.js'
import { Plant, PlantType } from './modules/plant/plant.model.js'
import { TableController } from './modules/table/table.controller.js'
import { TABLE_CONTENT_DEADLINE, TABLE_CONTENT_FREIGHT } from './test/table.js'

window.onload = () => {
    function App() {
        const tableController = new TableController()
        const farmController = new FarmController()

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
    }

    document.querySelector('button[data-button="get-data"]')?.addEventListener('click', getDataRepository)

    function getDataRepository() {
        // @ts-expect-error
        console.log(Object.keys(ModelSchema.repository.models).map(key => ({ model: key, documents: ModelSchema.repository.models[key].documents })))
    }

    App()
}
