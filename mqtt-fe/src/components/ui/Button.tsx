import { Button as AntButton } from 'antd'
import React from 'react'

type Props = React.ComponentProps<typeof AntButton>

const Button: React.FC<Props> = ({ className = '', children, ...rest }) => {
  return (
    <AntButton className={`${className}`} {...rest}>
      {children}
    </AntButton>
  )
}

export default Button
