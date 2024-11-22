# Acceptance Criteria

## User Story 1
Als gebruiker wil ik input kunnen vertalen naar een andere (dieren)taal zodat er tussen
verschillende soorten gecommuniceerd kan worden

| **Requirement** | **Description**                       | **Status** |
|-----------------------|---------------------------------------|------------|
| AC-1.1 | Er moet een select komen om de originele taal te selecteren.| ✔ |
| AC-1.2 | De pagina bevat een textarea inputfield waar de te translaten string ingezet kan worden, deze moet minimaal 1 karakter bevatten | ✖ |
| AC-1.3 | De pagina bevat een select om de taal te selecteren waar naar de input vertaald moet worden. | ✔ |
| AC-1.4 | Indien er op de knop ‘Vertaal’ geklikt wordt dient de tekst vertaald te worden volgens bijgevoegde vertaal algoritme en weergegeven in het output-veld. | ✔ |
| AC-1.5 | Het moet visueel duidelijk zijn om welke vertaling het gaat. | ✖ |
| AC-1.6 | Indien de geselecteerde originele taal niet overeenkomt met de ingevoerde tekst dient er een error weergegeven te worden met de tekst ‘Input komt niet overeen met geselecteerde taal’. | ✔ |

## User Story 2
Als gebruiker wil ik dat mijn input taal automatisch herkend wordt, zodat ik deze niet
hoef te selecteren

| **Requirement** | **Description**                       | **Status** |
|-----------------------|---------------------------------------|------------|
| AC-2.1 | In de select om de originele taal te selecteren moet een optie ‘Taal herkennen’ komen, dit moet de standaard geselecteerde waarde zijn.| ✔ |
| AC-2.2 | Zodra ik op de knop ‘Vertalen’ klik moet de taal vertaald worden vanaf de gedetecteerde taal naar de aangegeven taal. | ✔ |
| AC-2.3 | De optie ‘Taal herkennen’ verandert in ‘{taal} gedetecteerd’. | ✔ |
| AC-2.4 | Indien er geen taal herkend kan worden moet er een foutmelding getoond worden ‘Taal kon niet automatisch worden herkend’. | ✔ |

## User Story 3
Als gebruiker wil ik aangeven dat mijn vertaling wordt gedaan door een dronken vertaler zodat ik in het weekend ook de vertaling begrijp.

| **Requirement** | **Description**                       | **Status** |
|-----------------------|---------------------------------------|------------|
| AC-3.1 | Er is een checkbox bij de ‘bestemmings’ taal selector, ‘Ik ben zo dronken!!!’ indien deze geselecteerd is wordt het dronken algoritme toegepast. | ✖ |



