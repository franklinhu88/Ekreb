import React from "react"

/* Button component */

interface Props {
    children: string
    onClick: () => void;
    color?: string;
    size?: string;
}

const Button = ({children, onClick, color = 'primary', size = 'large'}: Props) => {
    return (
        <button className={"btn btn-" + color + " btn-" + size} onClick={onClick}>{children}</button>
    )
}

export default Button 