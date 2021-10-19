import React from 'react'
import styled from 'styled-components'
import { Flex } from '@soy-libs/uikit2'
// import { useTranslation } from 'contexts/Localization'LinkExternal,, Svg, Image, Button

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 30px;
  ${({ theme }) => theme.mediaQueries.md} {
    justify-content: space-between;
    flex-direction: row;
  }
`
const ButtonMenuItem = styled.div`
  background-color: rgba(165, 196, 55, .65);;
  border-radius: 20px;
  padding: 15px 30px;
  color: white;
`;
const Footer = () => {
  return (
    <Wrapper>
      <Flex flexDirection={['column', 'column', 'row']} alignItems="center">
        <ButtonMenuItem>V2</ButtonMenuItem>
      </Flex>
    </Wrapper>
  )
}

export default Footer
