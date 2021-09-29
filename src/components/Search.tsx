import React, { useEffect, useState } from 'react';
import { Box, Input, InputAdornment } from '@material-ui/core';
import { alpha, styled } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';

type SearchProps<T> = {
  originalData: Array<T>;
  searchColumnNames: Array<string>;
  filterData: (values: Array<T>) => void;
};

const SearchStyle = styled('div')(({ theme }) => ({
  backgroundColor: `${alpha(theme.palette.background.default, 0.72)}`
}));

function Search<T extends object>({
  originalData,
  searchColumnNames,
  filterData
}: SearchProps<T>) {
  const [searchInput, setSearchInput] = useState('');
  const [searchParam] = useState(searchColumnNames);

  useEffect(() => {
    function searchItem() {
      return originalData.filter((item: any) =>
        searchParam.some(
          (newItem: string) =>
            item[newItem]
              .toString()
              .toLowerCase()
              .indexOf(searchInput.toLowerCase()) > -1
        )
      );
    }
    const filteredData = searchItem();
    filterData(filteredData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, originalData]);

  return (
    <SearchStyle>
      <Input
        type="search"
        name="search-form"
        id="search-form"
        placeholder="Search for..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <Box
              component={Icon}
              icon={searchFill}
              sx={{ color: 'text.disabled', width: 20, height: 20 }}
            />
          </InputAdornment>
        }
      />
    </SearchStyle>
  );
}

export default Search;
