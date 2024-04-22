import React, { useState, useEffect } from "react";
import myAxios from "../../utility/myAxios";
import Box from '@mui/material/Box';
import { Autocomplete, FormControl, TextField } from "@mui/material";

export const SearchFilter = ({ setSelectedOptions,depenition, selectedOptions, setOptions, options, PartnerID, update }) => {
  
  const handleButtonClick = () => {
    update(0, 14, 'update', {
      GroupID: selectedOptions.group,
      TypeID: selectedOptions.type,
      GradeID: selectedOptions.grade,
      Height: selectedOptions.height,
      StockID: selectedOptions.stock
    })
  }
  
  const haha = name => 
  ({ options: options[name].map((element, index) => 
    ({ ...element, id: index })),
    getOptionLabel: (option) =>option.Name })



  const handleGroupChange = (value) => {

    depenition(value)
  };
  const handleTypeChange = (value) => {
    depenition('', value)
  };
  const handleGradeChange = (value) => {
    setSelectedOptions(prev => ({ ...prev, grade: value }))

  }
  const handleHeightChange = (value) => {
    setSelectedOptions(prev => ({ ...prev, height: value }))
  }
  const handleStockChange = (value) => {
    setSelectedOptions(prev => ({ ...prev, stock: value }))
  }
  useEffect(() => {handleButtonClick()}, [selectedOptions])
  const SearchItemsBasedOnText = (options, text) => {
    let searchString = text.toLowerCase().trim();
    return options && options.filter(el => el?.Name.toLowerCase().trim().includes(searchString))

  };
  return (


      <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px'}}>

        {options.typeOptions?.find(el => el.ID !== '') ?
          <Box sx={{ display: 'flex' }}>
            <FormControl sx={{ width: '100%' }}>
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
            <FormControl sx={{ width: '100%' }}>
              <Autocomplete
                sx={{ width: '100%', borderRadius: '35px' }}
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
          <FormControl sx={{ width: '100%' }}>
            <Autocomplete
              sx={{ width: '100%' }}
              disablePortal
              autoComplete
              id="combo-box-demo"
              onChange={(event, newValue) => newValue !== null && handleHeightChange(newValue.value)}
              filterOptions={(options, state) => {

                return options.filter(el => el?.value.toLowerCase().trim().includes(state.inputValue.toLowerCase().trim()))
              }}
              noOptionsText={'Нет таких продуктов'}
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
          <FormControl sx={{ width: '100%' }}>
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