'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useLoading } from '@/contexts/LoadingContext'

export function useLoadingStop() {
  const pathname = usePathname()
  const { setPageReady, isLoading } = useLoading()
  const previousPathnameRef = useRef<string | undefined>(undefined)
  const isInitializedRef = useRef(false)

  // initialize the ref on first render
  useEffect(() => {
    if (!isInitializedRef.current) {
      previousPathnameRef.current = pathname
      isInitializedRef.current = true
    }
  }, [pathname])

  useEffect(() => {
    // if not loading, just update the ref
    if (!isLoading) {
      previousPathnameRef.current = pathname
      return
    }

    // if pathname changed OR this is the first time loading is true, set up loading stop
    const hasPathnameChanged = previousPathnameRef.current !== pathname
    const shouldSetupTimeout = hasPathnameChanged || !isInitializedRef.current

    if (shouldSetupTimeout) {
      previousPathnameRef.current = pathname

      // primary timeout - most common case
      const primaryTimeout = setTimeout(() => {
        if (isLoading) {
          setPageReady()
        }
      }, 400)

      // backup timeout - in case primary fails
      const backupTimeout = setTimeout(() => {
        if (isLoading) {
          setPageReady()
        }
      }, 1200)

      // final safety timeout - this should not happen often
      const safetyTimeout = setTimeout(() => {
        if (isLoading) {
          setPageReady()
        }
      }, 3000)

      return () => {
        clearTimeout(primaryTimeout)
        clearTimeout(backupTimeout)
        clearTimeout(safetyTimeout)
      }
    }
  }, [pathname, isLoading, setPageReady])
}