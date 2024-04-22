import { React, useState, useEffect, useCallback } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from '@mui/material';
import SkeletonCatalog from "./SkeletonCatalog"
import myAxios from "../../utility/myAxios";

export const Product = ({ data, setCartDialog, setDetailDialog }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [img, setImg] = useState(require("../../images/netu.jpeg"))
  useEffect(() => {
    setIsLoading(false);
  }, [data]);

  const uploadPhoto = useCallback(async () => {
    let mainPhoto = await data?.Product.Photos.find(
      (el) => el.PhotoType === "Medium"
    );
    let bin = mainPhoto
      ? await (
        await myAxios("GetPhoto", "post", { PhotoID: mainPhoto.Photo })
      ).data
      : "";
    setImg("data:image/jpg;base64," + bin?.replace(/(?:\\[rn]|[\r\n]+)+/g, ""))
  }, [data])
  useEffect(() => {
    uploadPhoto()
  }, [uploadPhoto])
  if (isLoading) {
    return <SkeletonCatalog />;
  }
  return (
    <>
      <Card sx={{ borderRadius: 0, boxShadow: 0, marginBottom: 2 }}>
        <CardActionArea onClick={() => setDetailDialog({ status: true, data })}>
          <CardMedia
            sx={{ height: '250px' }}
            component="img"
            alt={data?.Product?.Name}
            image={img}
            loading="lazy"
          />
          <CardContent sx={{ padding: '8px 0 0 0', background: '#fff7f1' }}>
            <Typography sx={{ fontWeight: 700 }} component="span">{data?.Product?.Name}</Typography>
            <Typography gutterBottom variant="h5" component="div" sx={{ margin: 0 }}>
              {data?.Data?.Order?.reduce((prev, curr) => prev.Quant < curr.Quant ? prev : curr).Price + ' ₽'}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};