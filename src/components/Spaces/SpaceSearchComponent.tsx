import { Input } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { SpaceContext } from './SpaceContextUtils';

import './SpaceSearchComponent.css'

type Props = Readonly<{
    onSearchChange: (searchStr: string) => void
}>;

function SpaceSearchComponent(props: Props) {
    const spaceContext = useContext(SpaceContext);

    return <Input
        id='space-search-tab'
        color={spaceContext.spaceData?.themeColor}
        variant="filled"
        placeholder='Search tabs' onChange={(event) => {
            props.onSearchChange(event.target.value);
        }} />
}

export default SpaceSearchComponent;