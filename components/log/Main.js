import { Box } from "@mui/material"
import LogTable from "./LogTable";
import Chip from '@mui/material/Chip';
import React from "react"

export default function Main (){

    const systems = ['MWS', 'SFC', 'UPC']
    const [system, setSystem] = React.useState(systems[0])
    return(
        <Box>   
            <h2>Dashboard</h2>
            <h3>Avaliable systems: {systems.map((item) => 
                <Chip key={item} label={item} variant="outlined" onClick={() => setSystem(item)} sx={{margin:'5px'}}/>
            )}</h3>
            <LogTable system={system}/>
            <h5>Recent 10 Logs</h5>
        </Box>
    )
}