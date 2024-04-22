import {React} from "react";
import { Box, Button } from "@mui/material";
import cutFlower from '../../images/iconSearch/cutFlower.png';
import butterFlower from '../../images/iconSearch/butterFlower.png';
import toy from '../../images/iconSearch/toy.png';
import wrapping from '../../images/iconSearch/wrapping.png';
import soil from '../../images/iconSearch/soil.png';

const imgSize = {
    width: '100px',
    height: 'auto',
    borderRadius: '50%',
    padding: '10px'
}
const link = {
    textTransform: 'uppercase',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '12px',
    color: '#000',
}
const line ={
    position: 'absolute',
    zIndex: '-1',
    backgroundColor: 'black',
    width: '100%',
    height: '170px',
    top: '190px',
    left: 0,
    // backgroundImage: `url(${iconBack})`,
    opacity: '0.1',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'repeat'
}

export const SearchButton = ({update ,data,setData,depenition}) => {

    const handleButtonClick = (value) => {
        depenition(value)
        update(0, 14, 'update', {
          GroupID: value
        })
      }
    return (
        <>
            <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', margin: '30px 0'}}>
                {data?.map(el => 
                    <Button onClick={()=>handleButtonClick(el.ID)} underline="none" key={el.ID} style={link}>
                        <img style={imgSize} src={"data:image/jpg;base64," + el.PhotoBase64.replace(/(?:\\[rn]|[\r\n]+)+/g, "")} alt="tether" />
                        {el.Name}
                    </Button>
                )}
            </Box>
            <Box style={line} />
        </>
    )
}