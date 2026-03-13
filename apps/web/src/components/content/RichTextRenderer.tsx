import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Props = {
  data: any
  className?: string
}

export function RichTextRenderer({ data, className = 'prose prose-stone max-w-none' }: Props) {
  if (!data) return null
  return (
    <div className={className}>
      <RichText data={data} />
    </div>
  )
}
