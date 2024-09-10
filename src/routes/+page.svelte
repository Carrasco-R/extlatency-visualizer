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
</script>

<h1>ExtLatency Log</h1>

<label for="logInput">Log: </label>
<input type="text" name="logInput" id="logInput" bind:value={log} on:change={update}>

<div>
    <ActionTable {actions}/>
</div>

<!-- <div>
    <div class="row">
        <div class="col">Request Processing</div>
        <div class="col">
            {#each requestProcessing as requestKeyword}
                <div>
                    {requestKeyword}
                </div>
            {/each}
        </div>
    </div>
    <div class="row">
        <div class="col">Response Processing</div>
        <div class="col">
            {#each responseProcessing as responseKeyword}
                <div>
                    {responseKeyword}
                </div>
            {/each}
        </div>
    </div>
</div> -->


<style>
    .row{
        display: flex;
        flex-direction: row;
    }
    .row > div{
        margin-inline: 1em;
    }
    #logInput{
        display: block;
        width: 50%;
        padding: 0.5rem;
    }
</style>