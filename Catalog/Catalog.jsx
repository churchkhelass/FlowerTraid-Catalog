import React, { useCallback, useEffect, useState, useTransition } from "react";
import { getCookie } from "../../utility/cookie";
import myAxios from "../../utility/myAxios";
import { Product } from "./Product";
import { Box, IconButton } from "@mui/material";
import DialogDetail from "./DialogDetail";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import CartDialog from "../Dialog/CartDialog";
import Search from "./Search";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { Footer } from '../Footer/Footer';
import ChatButton from "../Chat/ChatButton";
import SkeletonCatalog from "./SkeletonCatalog"

export const Catalog = () => {
  const PartnerID = getCookie("PartnerID");
  const [data, setData] = useState([]);
  const [user, setUser] = useState({})
  const [dataLoad, setDataLoad] = useState([0, 14]);
  const [loading, setLoading] = useState(false);
  const [detailDialog, setDetailDialog] = useState({ status: false, data: {} })
  const [cartDialog, setCartDialog] = useState({ status: false, data: {} })
  const [nameFilter, setNameFilter] = useState('')
  const [isPending, startTransition] = useTransition()
  const [skeletData, setSkeletData] = useState(0)
  const linkBasket = () => {
    localStorage.setItem('linkBasket', true)
    navigate('/Profile')
  }
  const navigate = useNavigate()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const update = useCallback(async (start, finish, action = 'add', filterData = {}) => {
    const catalog = await (await myAxios("GetCatalog", "post", { PartnerID, ...filterData })).data;
    const products = await Promise.all(
      catalog
        ?.filter(
          (_element, index) => index >= start && index <= finish
        )
        ?.map(async (el) => {
          if (!el) return false;
          let Product = await (
            await myAxios("GetProduct", "post", { ProductID: el.ProductID })
          ).data;
          let Stock = await (
            await myAxios("GetStock", "post", { StockID: el.StockID })
          ).data;
          let result = {
            Product,
            Data: {
              Count: el.Count,
              DeadLine: el.DeadLine,
              Order: el.Order
            },
            Stock
          }
          return result;
        })
    );

    // if (!products.length) {
    //   setScrollStop(true)
    // };
    if (action === 'add') {
      setData((prev) => [...prev, ...products]);
    } else {
      setData((prev) => [...products]);
    }
  }, [PartnerID])
  const handleScroll = (data, dataLoad) => {
    if (
      window.innerHeight + window.scrollY + 800 >= document.body.scrollHeight &&
      data.length > dataLoad[0] + 1 && loading === false
    ) {
      setLoading((prev) => true);
      setDataLoad((prev) => [prev[1] + 1, prev[1] + 10]);
      setTimeout(() => {
        setLoading((prev) => false);
      }, 1000);

    }
  }
  useEffect(() => {
    update(dataLoad[0], dataLoad[1], 'add');
  }, [dataLoad]);
  useEffect(() => {
    (async () => {
      let res = await myAxios("GetProfilePartner", "post", {
        PartnerID: getCookie("PartnerID"),
      });
      switch (res.data?.Status) {
        case "Ожидание подтверждения регистрации":
          navigate("/Profile")
          break;
        case "Заблокирован":
          navigate("/Profile")
          break;
        case "Ожидание регистрации":
          navigate("/Registration");
          break;
      if(user?.ItsBuyer)navigate("/Profile");
      setUser(res?.data);
    }})();
  }, []);
  useEffect(() => {
    const scrollHandler = async (e) => handleScroll(data, dataLoad);
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [data, setData]);
  return (
    <>
      <Box sx={{ background: '#000', width: '100%', height: 50, marginBottom: 5 }}>
        <Box sx={{ maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', margin: '0 auto' }}>
          <Button sx={{ margin: 1, color: '#fff' }} onClick={() => navigate('/Profile')}>
            Главное меню
          </Button>
          <Box sx={{ color: '#fff', margin: 'auto' }}>FLOWERTRAID</Box>
          <IconButton onClick={() => linkBasket()}>
            <ShoppingBagOutlinedIcon sx={{ color: '#fff7f1', width: '1.5em', height: '1.5em' }}  />
          </IconButton >
        </Box>
      </Box>
      <Box sx={{
        display: "grid",
        flexDirection: "column",
        alignItems: "center",
        width: 1200,
        margin: 'auto',
      }}>
        <Search data={data} setNameFilter={setNameFilter} update={update} startTransition={startTransition} PartnerID={PartnerID} />
        
        <Box sx={{ display: "grid", gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', gridAutoRows: 'minmax(100px, auto)', margin: '20px 8px' }}>
          {data.length ?
            data.filter(e => e.Product.Name.toLowerCase().trim().includes(nameFilter.toLowerCase().trim())).map((element, index) =>
              <Product key={index} data={element} setCartDialog={setCartDialog} setDetailDialog={setDetailDialog} />
            ) : Array.from({ length: skeletData }).map((_, index) => <SkeletonCatalog key={index} />)
          }

          <DialogDetail status={detailDialog.status} setCartDialog={setCartDialog} setData={setDetailDialog} data={detailDialog.data} PartnerID={PartnerID} />
          <CartDialog status={cartDialog.status} update={() => update(0, dataLoad[1], 'update')} setData={setCartDialog} PartnerID={PartnerID} data={cartDialog.data} />
          <ChatButton user={user} />
        </Box>
      </Box>
      <Footer />
    </>
  );
};
