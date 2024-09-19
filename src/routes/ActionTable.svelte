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

<table class="mx-auto table w-75">
    <thead>
        <tr>
            <th>
                Duration
            </th>
            <th>
                Time
            </th>
            <th>
                Keyword
            </th>
            <th>
                Description
            </th>
        </tr>
    </thead>
    <tbody>

        {#each formattedData as {time, duration, keyword, description}}
        <tr>
            <td>{duration}</td>
            <td>{time}</td>
            <td>{keyword}</td>
            <td>{description}</td>
        </tr>
        {/each}
    </tbody>
</table>
