'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode, MouseEvent } from 'react'
import { useLoading } from '@/contexts/LoadingContext'

interface LoadingLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
  onNavigate?: () => void
}

export function LoadingLink({ href, children, className, onClick, onNavigate }: LoadingLinkProps) {
  const router = useRouter()
  const { startLoading, isLoading } = useLoading()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    if (isLoading) {
      return
    }
    
    if (onClick) {
      onClick()
    }
    
    if (onNavigate) {
      onNavigate()
    }
    
    startLoading()
    
    router.push(href)
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}