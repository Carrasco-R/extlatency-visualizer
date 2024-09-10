<script>
    export let actions
    import {dictionary} from "$lib/dictionary"
    
    let formattedData = [{}]
    $: if(actions){
        let totalTime = 0
        formattedData = []
        actions.forEach(action => {
            let [keyword, duration] = action.split("=")
            duration = parseInt(duration)
            totalTime += duration
            formattedData = [ 
                ...formattedData, 
                {
                    time: totalTime,
                    keyword,
                    duration, 
                    description: dictionary[keyword] ?? "Unknown keyword"
                }
            ]
        });
        console.log({formattedData});
        
    }
        
</script>

<table>
    <tr>
        <th>
            Time
        </th>
        <th>
            Duration
        </th>
        <th>
            Keyword
        </th>
        <th>
            Description
        </th>
    </tr>
    {#each formattedData as {time, duration, keyword, description}}
         <tr>
            <td>{time}</td>
            <td>{duration}</td>
            <td>{keyword}</td>
            <td>{description}</td>
         </tr>
    {/each}
</table>
