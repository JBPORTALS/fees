import { Grid, Heading } from '@chakra-ui/react'
import React from 'react'

interface ActionCardProps{
  heading:string,
  Icon:React.ReactNode;
  onClick?:()=>void
}

export default function ActionCard({heading,Icon,onClick}:ActionCardProps) {
  return (
    <Grid onClick={onClick} alignItems={"center"} justifyItems={"center"} className='border w-[200px] h-[130px] bg-secondary border-brand rounded-md justify-center items-center flex flex-col p-5 space-y-3 hover:cursor-pointer hover:shadow-xl active:scale-95 hover:scale-105 hover:shadow-lightBrand transition-all duration-200'>
      <Heading fontSize={"md"} textAlign={"center"} className={"text-dark"}>{heading}</Heading>
      <span className='text-4xl text-brand'>
      {
        (Icon)
      }
      </span>
    </Grid>
  )
}
