export const TEMPLATE_IMPORT = `{
    "plants": [
        {
            "name": "Planta - Prazo",
            "type": "Deadline",
            "headers": [
                {
                    "name": "CEP INICIAL",
                    "type": "ZipCodeInitial",
                    "index": 0
                },
                {
                    "name": "CEP FINAL",
                    "type": "ZipCodeFinal",
                    "index": 1
                },
                {
                    "name": "Prazo",
                    "type": "Deadline",
                    "index": 2
                },
                {
                    "name": "TAXA",
                    "type": "Rate",
                    "index": 3
                },
                {
                    "name": "SIGLA TARIFÁRIA",
                    "type": "CriteriaSelection",
                    "index": 4
                }
            ]
        },
        {
            "name": "Planta - Frete",
            "type": "Freight",
            "headers": [
                {
                    "name": "SIGLA TARIFÁRIA",
                    "type": "CriteriaSelection",
                    "index": 0
                },
                {
                    "name": "TAXA",
                    "type": "Rate",
                    "index": 1
                },
                {
                    "name": "EXCEDENTE",
                    "type": "Excess",
                    "index": 2
                },
                {
                    "name": "1",
                    "type": "Freight",
                    "index": 3
                }
            ]
        }
    ],
    "process": ["ValidZipCodeContained", "IncrementDeadline", "ProcvFreightToTotal", "GenerateTemplateTable"]
}
`
