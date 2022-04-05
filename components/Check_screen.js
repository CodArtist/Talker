import React, {useEffect, useState} from "react";
import { isMobile, browserName } from "react-device-detect";


const useCheckMobileScreen = () => {
    const [width, setWidth] = useState(isMobile?766:799);
    const handleWindowSizeChange = () => {
            setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    return (width <= 768);
}

export default useCheckMobileScreen