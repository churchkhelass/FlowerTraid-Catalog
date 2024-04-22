import { Autocomplete, Box, InputAdornment, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { SearchFilter } from './SearchFilter'
import { SearchButton } from './SearchButton';
import myAxios from '../../utility/myAxios';
const Search = ({ setNameFilter, startTransition, data, update, PartnerID }) => {
    const [options, setOptions] = useState({ typeOptions: [], gradeOptions: [], groupOptions: [], heightOptions: [], stockOptions: [] });
    const [selectedOptions, setSelectedOptions] = useState({ type: '', grade: '', group: '', height: '', stock: '' });
    const firstProps = {
        options: data.map((element, index) => ({ ...element, id: index })),
        getOptionLabel: (option) => option.Product.Name,
    };
    const change = (value) => {
        console.log(typeof (value))
        startTransition(() => { setNameFilter(value ? value : '') })
    }
    const SearchItemsBasedOnText = (options, text) => {
        let searchString = text.toLowerCase().trim();
        return options.filter(el => el.Product.Name.toLowerCase().trim().includes(searchString))

    };

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
                uchi.stockOptions = stockResponse.data.map(el => ({ ...el.Stock }))
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
          console.log(group ? group : allGroups?.data[0]?.ID)
          uchi.groupOptions = [...allGroups.data]
    
          const typeResponse = await myAxios('GetTypeProduct', "post", {
            GroupID: group ? group : allGroups?.data[0]?.ID
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
    return (
        <Box sx={{ margin: 1, display: 'flex', flexDirection: 'column' }}>
            <Autocomplete
                sx={{ width: '100%' }}
                disablePortal
                autoComplete
                id="combo-box-demo"
                onChange={(event, newValue) => newValue !== null && change(newValue.Product.Name)}
                onInputChange={(event, newInputValue) => {
                    change(newInputValue);
                }}
                filterOptions={(options, state) => {

                    return SearchItemsBasedOnText(options, state.inputValue)
                }}
                noOptionsText={'Нету таких продуктов'}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                {...firstProps}
                renderOption={(props, option) => {
                    return (
                        <li {...props} key={option.id} >
                            {option.Product.Name}
                        </li>
                    );
                }}
                renderInput={(params) => <TextField {...params} InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }} label="Имя Продукта" />}
            />
            {options.groupOptions.length ? 
            <SearchButton data={options.groupOptions} depenition={depenition} setData={setSelectedOptions} update={update} />
            : <></>}
            <SearchFilter options={options} depenition={depenition} setOptions={setOptions} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} update={update} PartnerID={PartnerID} />
        </Box>
    )
}

export default Search