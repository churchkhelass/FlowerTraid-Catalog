import React, { useState, useEffect } from "react";
import myAxios from "../../utility/myAxios";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import { Autocomplete, FormControl, InputLabel, Modal, TextField, Typography } from "@mui/material";
import "../MyProduct/FlexColumn.css";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import CloseIcon from '@mui/icons-material/Close';

//модальное окно добавления товара
// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };


export const SearchFilter = ({ PartnerID, update }) => {
  const [options, setOptions] = useState({ typeOptions: [], gradeOptions: [], groupOptions: [], heightOptions: [], stockOptions: [] });
  const [selectedOptions, setSelectedOptions] = useState({ type: '', grade: '', group: '', height: '', stock: '' });
  const handleButtonClick = () => {
    update(0, 14, 'update', {
      Group: selectedOptions.group,
      TypeID: selectedOptions.type,
      GradeID: selectedOptions.grade,
      Height: selectedOptions.height,
      StockID: selectedOptions.stock
    })
  }


  useEffect(() => {
    //Сорт, Вид, Плантация     /--section/optin--/

    const fetchData = async () => {
      try {
        const uchi = {}
        const allGroups = await myAxios('GetGroupProduct', "post", {});
        uchi.groupOptions = [...allGroups.data]

        const heightResponse = await myAxios('GetCatalogHeight', "post", {
          PartnerID
        });
        uchi.heightOptions = [...heightResponse.data]

        const stockResponse = await myAxios('GetAllStocks', "post", {
          PartnerID, status: 'active'
        });
        uchi.stockOptions = stockResponse.data.map(el => ({...el.Stock}))
        setOptions((prev) => ({ ...uchi }));
        setSelectedOptions({
          group: '',
          type: '',
          grade: '',
          height: '',
          stock: '',
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      };
    };
    fetchData();
  }, []);

  const depenition = async (group = '', type = '') => {

    const uchi = {}
    if (group) {
      const allGroups = await myAxios('GetGroupProduct', "post", {});
      uchi.groupOptions = [...allGroups.data]

      const typeResponse = await myAxios('GetTypeProduct', "post", {
        Group: group ? group : allGroups?.data[0]?.ID
      });
      uchi.typeOptions = [...typeResponse.data]
    }

    let gradeResponse = type ? await myAxios('GetGradeProduct', "post", {
      TypeID: type
    }) : []
    uchi.gradeOptions = gradeResponse?.data ? gradeResponse?.data : []
    setOptions((prev) => ({ ...prev, ...uchi }));
    setSelectedOptions((
      prev => ({
        ...prev,
        type: type ? type : '',
        group: group ? group : selectedOptions.group,
        grade: gradeResponse?.data ? gradeResponse?.data[0]?.ID : ''
      })
    ))
  }
  const haha = name => ({ options: options[name].map((element, index) => ({ ...element, id: index })), getOptionLabel: (option) => option.Name })

  const handleGroupChange = (value) => {
    depenition(value)
    handleButtonClick()
  };
  const handleTypeChange = (value) => {
    depenition('', value)
    handleButtonClick()
  };
  const handleGradeChange = (value) => {
    setSelectedOptions(prev => ({ ...prev, grade: value }))
    handleButtonClick()
  };
  const handleHeightChange = (value) => {
    setSelectedOptions(prev => ({ ...prev, height: value }))
    handleButtonClick()
  }
  const handleStockChange = (value) => {
    setSelectedOptions(prev => ({ ...prev, stock: value }))
    handleButtonClick()
  }
  const SearchItemsBasedOnText = (options, text) => {
    // console.log(options)
    // console.log(text)
    let searchString = text.toLowerCase().trim();
    return options && options.filter(el => el?.Name.toLowerCase().trim().includes(searchString))

  };
  // console.log(options)
  return (


      <Box  className="column">
        <Box sx={{ display: 'flex' }}>

          <FormControl sx={{ margin: 1, width: '100%' }}>

            <Autocomplete
              sx={{ width: '100%' }}
              disablePortal
              autoComplete
              id="combo-box-demo"
              onChange={(event, newValue) => newValue !== null && handleGroupChange(newValue.ID)}
              filterOptions={(options, state) => {

                return SearchItemsBasedOnText(options, state.inputValue)
              }}
              noOptionsText={'Нету таких продуктов'}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              {...haha('groupOptions')}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id} >
                    {option.Name}
                  </li>
                );
              }}
              renderInput={(params) => <TextField {...params} InputProps={{
                ...params.InputProps,
              }} label="Вид" />}
            />
          </FormControl>
        </Box>

        {options.typeOptions?.find(el => el.ID !== '') ?
          <Box sx={{ display: 'flex' }}>
            <FormControl sx={{ margin: 1, width: '100%' }}>
              <Autocomplete
                sx={{ width: '100%' }}
                disablePortal
                autoComplete
                id="combo-box-demo"
                onChange={(event, newValue) => newValue !== null && handleTypeChange(newValue.ID)}
                filterOptions={(options, state) => {

                  return SearchItemsBasedOnText(options, state.inputValue)
                }}
                noOptionsText={'Нету таких продуктов'}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                {...haha('typeOptions')}
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.id} >
                      {option.Name}
                    </li>
                  );
                }}
                renderInput={(params) => <TextField {...params} InputProps={{
                  ...params.InputProps,
                }} label="Сорт" />}
              />
            </FormControl>
          </Box> : null}

        {options.gradeOptions?.find(el => el.ID !== '') ?
          <Box sx={{ display: 'flex' }}>
            <FormControl sx={{ margin: 1, width: '100%' }}>
              <Autocomplete
                sx={{ width: '100%' }}
                disablePortal
                autoComplete
                id="combo-box-demo"
                onChange={(event, newValue) => newValue !== null && handleGradeChange(newValue.ID)}
                filterOptions={(options, state) => {

                  return SearchItemsBasedOnText(options, state.inputValue)
                }}
                noOptionsText={'Нету таких продуктов'}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                {...haha('gradeOptions')}
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.id} >
                      {option.Name}
                    </li>
                  );
                }}
                renderInput={(params) => <TextField {...params} InputProps={{
                  ...params.InputProps,
                }} label="Вид" />}
              />
            </FormControl>

          </Box> : null}
        <Box sx={{ display: 'flex' }}>
          <FormControl sx={{ margin: 1, width: '100%' }}>
            <Autocomplete
              sx={{ width: '100%' }}
              disablePortal
              autoComplete
              id="combo-box-demo"
              onChange={(event, newValue) => newValue !== null && handleHeightChange(newValue.value)}
              filterOptions={(options, state) => {

                return options.filter(el => el?.value.toLowerCase().trim().includes(state.inputValue.toLowerCase().trim()))
              }}
              noOptionsText={'Нет ИДИ НАХУЙ'}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              // {...haha('heightOptions')}
              options={options.heightOptions.map((element, index) => ({ value :element, id: index }))}
              getOptionLabel={(option) => option.value}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id} >
                    {option.value}
                  </li>
                );
              }}
              renderInput={(params) => <TextField {...params} InputProps={{
                ...params.InputProps,
              }} label="Рост" />}
            />
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <FormControl sx={{ margin: 1, width: '100%' }}>
            <Autocomplete
              sx={{ width: '100%' }}
              disablePortal
              autoComplete
              id="combo-box-demo"
              onChange={(event, newValue) => newValue !== null && handleStockChange(newValue.ID)}
              filterOptions={(options, state) => {

                return SearchItemsBasedOnText(options, state.inputValue)
              }}
              noOptionsText={'Нету таких складов'}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              {...haha('stockOptions')}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id} >
                    {option.Name}
                  </li>
                );
              }}
              renderInput={(params) => <TextField {...params} InputProps={{
                ...params.InputProps,
              }} label="Склад" />}
            />
          </FormControl>
        </Box>
      </Box>
  )
}