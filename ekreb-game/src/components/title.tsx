/* Title component */

import React from "react";

interface Props{
    children: string
}

const Title = ({children}: Props) => {
    return <h1 className="display-1">{children}</h1>;
}

export default Title;