import { forwardRef, memo, useCallback, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from "@mui/material/styles";
import myAxios from "../../utility/myAxios";
import Typography from "@mui/material/Typography";
import { LazyLoadImage } from "react-lazy-load-image-component";


const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const DialogDetail = ({ status, setData, data, setCartDialog }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0);
  const [photos, setPhotos] = useState([])
  const [maxSteps, setMaxSteps] = useState(0)
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleAddBasket = () => {
    setCartDialog({ status: true, data })
  }
  const updatePhotos = useCallback(async () => {
    const largePhotos = data?.Product?.Photos?.filter(el => el.PhotoType === 'Large')
    setLoading(false)
    let newData = await Promise.all(
      largePhotos?.map(
        async (el) => "data:image/jpg;base64," + (
          await (
            await myAxios('GetPhoto', 'post', { PhotoID: el.Photo })
          ).data)?.replace(/(?:\\[rn]|[\r\n]+)+/g, "")))

    setPhotos([...newData])
  }, [data, status])


  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleClose = () => {
    setActiveStep(0)
    setMaxSteps(0)
    setData((prev) => ({ ...prev, status: false }))
  }
  useEffect(() => {
    if (data?.Data) {
      let newSteps = data?.Product?.Photos.filter(el => el.PhotoType === 'Large').length
      if (newSteps) {
        setMaxSteps(newSteps)
        updatePhotos()
      }
    }
    return () => setLoading(true)
  }, [updatePhotos])
  if (loading || !data?.Data) {
    return null
  }
  
  return (
    <Dialog
      open={status}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >

      <DialogContent sx={{ display: 'flex', gap: 1 }}>
        <Box sx={{
          height: '450px',
          width: '300px'
        }}>
          <Box sx={{
            maxWidth: 300,
            flexGrow: 1,
            position: 'fixed',
          }}>
            <LazyLoadImage
              width={'100%'}
              height={'auto'}
              sx={{ position: 'fixed' }}
              src={photos[activeStep] ? photos[activeStep] : require("../../images/netu.jpeg")}
              alt={data?.Product?.Name ? data?.Product?.Name : 'Красивые цветы'}
            />

          </Box>
        </Box>
        <Box sx={{ height: '200px', width: '200px' }}>
          <Typography fontSize="large" sx={{ color: '#000', fontFamily: 'fantasy' }}>{data.Product.Name}</Typography>
          <Typography>{data?.Product?.Group?.Name}</Typography>
          <Box sx={{my: 3}}>
            {data?.Data?.Order?.sort((a, b) => a.Quant - b.Quant).map((object, index) => (
              <Box key={index} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderBottom: '1px solid grey' }}>
                <Typography fontSize="large" sx={{ color: '#000' }}>{object?.Price + ' ₽'}</Typography>
                <Typography>за {object?.Quant} шт</Typography>
              </Box>
            ))}
          </Box>
          <Button variant="contained" sx={{ color: '#fff', background: '#000', width: '100%' }} onClick={(e) => handleAddBasket(e)}>Добавить в корзину</Button>
          <Typography sx={{ padding: '8px' }}>Количество на складе: <span style={{ color: '#000' }}>{data?.Data?.Count + ' шт'}</span></Typography>
          <Typography fontSize="large" sx={{ color: '#000', margin: '30px 8px 0' }}>О товаре</Typography>
          <Box sx={{ margin: '20px 8px', paddingBottom: '70px' }}>
            <Typography sx={{ color: '#000' }}>{data.Product.Definition}</Typography><br />
            <Typography>Тип: <span style={{ color: '#000' }}>{data.Product.Type.Name}</span></Typography>
            <Typography>Сорт: <span style={{ color: '#000' }}>{data.Product.Grade.Name}</span></Typography>
            <Typography>Диаметр: <span style={{ color: '#000' }}>{data.Product.Diameter}</span></Typography>
            <Typography>Высота: <span style={{ color: '#000' }}>{data.Product.Height}</span></Typography>
            <Typography>Продовец: <span style={{ color: '#000' }}>{data.Product.Partner.Name}</span></Typography>
            <Typography>Склад: <span style={{ color: '#000' }}>{data.Stock.Name}</span></Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', position: 'absolute', bottom: '0', padding: '0', width: '100%', background: '#fff' }}>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{ justifyContent: 'space-around', width: '300px', padding: '20px' }}
          nextButton={
            <Button
              sx={{ color: '#000' }}
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              {theme.direction === 'rtl' ? (
                <ArrowBackIcon />
              ) : (
                <ArrowForwardIcon />
              )}
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0} sx={{ color: '#000' }}>
              {theme.direction === 'rtl' ? (
                <ArrowForwardIcon sx={{ color: '#000' }} />
              ) : (
                <ArrowBackIcon />
              )}
            </Button>
          }
        />
        <Button sx={{ color: '#000', padding: '20px' }} onClick={handleClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogDetail