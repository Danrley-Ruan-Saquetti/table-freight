import { FarmController } from './modules/farm/farm.controller.js'
import { FarmService } from './modules/farm/farm.service.js'
import { EnumProcess } from './modules/farm/process/constants.js'
import { FileController } from './modules/file/file.controller.js'
import { HeaderType } from './modules/header/header.model.js'
import { PlantType } from './modules/plant/plant.model.js'
import { TableController } from './modules/table/table.controller.js'
import { TABLE_CONTENT_DEADLINE, TABLE_CONTENT_FREIGHT, TABLE_CONTENT_TOTAL } from './test/table.js'

window.onload = () => {
    const tableController = new TableController()
    const farmController = new FarmController()
    const fileController = new FileController()

    async function App() {
        initComponents()

        document.querySelector('[button-action="confirm"')?.addEventListener('click', ev => {
            submitForm()
        })

        document.querySelector('[button-action="cancel"')?.addEventListener('click', ev => {
            const listProcess = document.querySelector('[data-form="form-farm"] .list-plants')
            if (listProcess) {
                listProcess.innerHTML = ''
            }

            const listPlants = document.querySelector('[data-form="form-farm"] .list-process')
            if (listPlants) {
                listPlants.innerHTML = ''
            }
        })

        return

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
            }
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
    }

    function initComponents() {
        newGroupInputPlant()
        newGroupInputProcess()
    }

    function submitForm() {
        const plantsFiles = []

        document.querySelectorAll('.list-plants .group-input.plant').forEach(plant => {
            const file = (plant.querySelector('[name="input-file"]') as HTMLInputElement).files[0]

            if (!file) {
                return
            }

            plantsFiles.push(file)
        })
    }

    async function generateDownloadFarm(farmService: FarmService) {
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

    function newGroupInputPlant() {
        const div = document.createElement('div')

        div.classList.add('group-input-wrapper')
        div.setAttribute('style', 'margin-bottom: 20px;')

        div.innerHTML = TEMPLATE_GROUP_INPUT_PLANT

        div.querySelector('[data-input="new-plant"]')?.addEventListener('click', ev => {
            newGroupInputPlant()
        })

        div.querySelector('[data-input="remove-plant"]')?.addEventListener('click', ev => {
            div.remove()
        })

        document.querySelector('[data-form="form-farm"] .list-plants')?.appendChild(div)

        newGroupInputHeaders(div)
    }

    function newGroupInputHeaders(parent: HTMLElement) {
        const div = document.createElement('div')

        div.classList.add('group-input')

        div.innerHTML = TEMPLATE_GROUP_INPUT_HEADERS

        div.querySelector('[data-input="new-header"]')?.addEventListener('click', ev => {
            newGroupInputHeaders(parent)
        })

        div.querySelector('[data-input="remove-header"]')?.addEventListener('click', ev => {
            div.remove()
        })

        parent.appendChild(div)
    }

    function newGroupInputProcess() {
        const div = document.createElement('div')

        div.classList.add('group-input-wrapper')
        div.setAttribute('style', 'margin-bottom: 20px;')

        div.innerHTML = TEMPLATE_GROUP_INPUT_PROCESS

        div.querySelector('[data-input="new-process"]')?.addEventListener('click', ev => {
            newGroupInputProcess()
        })

        div.querySelector('[data-input="remove-process"]')?.addEventListener('click', ev => {
            div.remove()
        })

        document.querySelector('[data-form="form-farm"] .list-process')?.appendChild(div)
    }

    const TEMPLATE_GROUP_INPUT_PLANT = `
<div class="group-input plant">
    <label for="input-name">Arquivo: </label>
    <input type="file" name="input-file">
    <button type="button" data-input="new-plant" style="margin-left: 10px;">ADD</button>
    <button type="button" data-input="remove-plant" style="margin-left: 10px;">REMOVE</button>
</div>
<div class="group-input name">
    <label for="input-name">Nome: </label>
    <input type="text" name="input-name">
</div>
<div class="group-input type">
    <label for="input-plant-type">Tipo: </label>
    <select name="input-plant-type" id="input-plant-type">
        <option value="Deadline">Prazo</option>
        <option value="Freight">Frete</option>
        <option value="Total">Total</option>
    </select>
</div>
`

    const TEMPLATE_GROUP_INPUT_HEADERS = `
<div class="group-input header">
    <label for="input-header-name">Cabeçalho: </label>
    <input type="text" name="input-header-name">
    <select name="input-header-type" id="input-header-type">
        <option value="CriteriaSelection">Critério de Seleção</option>                               
        <option value="Deadline">Prazo</option>
        <option value="DeadlineMoreD">Prazo + D</option>
        <option value="Excess">Excedente</option>
        <option value="Freight">Frete</option>
        <option value="Rate">Taxa</option>
        <option value="ZipCodeInitial">CEP Inicial</option>
        <option value="ZipCodeFinal">CEP Final</option>
        <option value="CEP Origem Inicial">CEP Origem Inicial</option>
        <option value="CEP Origem Final">CEP Origem Final</option>
    </select>
    <button type="button" data-input="new-header" style="margin-left: 10px;">ADD</button>
    <button type="button" data-input="remove-header" style="margin-left: 10px;">REMOVE</button>
</div>
`

    const TEMPLATE_GROUP_INPUT_PROCESS = `
<div class="group-input process">
    <label for="input-process-type">Processo: </label>
    <select name="input-process-type" id="input-process-type">
        <option value="CreatePlantTotal">Criar Planta Total</option>
        <option value="ValidZipCodeContained">Validar CEP contido</option>
        <option value="IncrementDeadline">Acrescentar Prazo (D+1)</option>
        <option value="ProcvFreightToTotal">Fazer PROCV</option>
        <option value="GenerateTemplateTable">Gerar Templates</option>
    </select>
    <button type="button" data-input="new-process" style="margin-left: 10px;">ADD</button>
    <button type="button" data-input="remove-process" style="margin-left: 10px;">REMOVE</button>
</div>
`

    App()
}
