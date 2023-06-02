import { redirect } from 'next/navigation'
import React from 'react'

export default function WithoutUSNPage() {
  redirect("/generate-reciept/without-usn/FEE")
}
