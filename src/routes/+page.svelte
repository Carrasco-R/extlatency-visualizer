<script>
  import ActionTable from './ActionTable.svelte';

    let log = "ExtLatency: TS=0,HR=0,BR=0,PS=0,RT=2,COR=2,CI=3,RL=59,SE=59,XS=60,SV=62,SV=63,JTG=68,JTV=75,GS=77,IV=80,PAR=82,XSL=85,X2J=86,SW=86,XC=86,RES=87,rPC=87,TC=87," 
    let logType = ""
    let actions = [""]
    function update({target}) {
        const log = target.value
        const datapowerLogRegex = /(?:ExtLatency: )(.*)(?: == )(.*)/
        const apiGatewayLogRegex = /(?:ExtLatency: )(.*)/
        if(datapowerLogRegex.test(log)){
            const regexMatch = log.match(datapowerLogRegex) ?? ["","",""]
            const requestProcessing = regexMatch[1].trim().split(",").filter(i => i != "")
            const responseProcessing = regexMatch[2].trim().split(",").filter(i => i != "")
            actions = [...requestProcessing, ...responseProcessing ]
            logType = "datapower"
            // console.log({requestProcessing});
            // console.log({responseProcessing});
        }else if(apiGatewayLogRegex.test(log)){
            const regexMatch = log.match(apiGatewayLogRegex) ?? [""]
            actions = regexMatch[1].trim().split(",").filter(i => i != "")
            logType = "apigw"
            // console.log({actions});              
        }   

    }
    update({target: {value: log}})
    // TODO: Add "==" in action table
</script>

<h1 class="text-center my-4">ExtLatency Log Viewer for IBM DataPower Gateway</h1>

<textarea class="w-75 h-25 d-block px-5 py-3 mx-auto my-5" rows="3" name="logInput" id="logInput" bind:value={log} on:change={update} />
<ActionTable {actions}/>