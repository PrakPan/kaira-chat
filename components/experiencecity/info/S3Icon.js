import React, {useState} from 'react';
import ImageLoader from '../../ImageLoader';

const  Icon= (props) => {
    const [extension, setExtension] = useState('svg');
    const _handlePNG = () => {
         setExtension('png');
    }
    return(
        <ImageLoader onfail={_handlePNG} url={props.location+props.icon+"/default."+extension} widthmobile="2rem" width="3rem" dimensions={{width: 100, height: 100}}></ImageLoader>
    )
}

export default Icon;