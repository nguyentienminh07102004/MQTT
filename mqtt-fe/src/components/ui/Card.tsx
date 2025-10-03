import { Card as AntCard } from 'antd'
import React from 'react'

type Props = React.ComponentProps<typeof AntCard>

const Card: React.FC<Props> = ({ children, className = '', ...rest }) => {
  return (
    <AntCard className={`card ${className}`} bodyStyle={{ padding: 16 }} {...rest}>
      {children}
    </AntCard>
  )
}

export default Card
