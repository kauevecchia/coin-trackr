'use client'

import { useLoading } from '@/contexts/LoadingContext'
import { useLoadingStop } from '@/hooks/useLoadingStop'
import { motion, AnimatePresence } from 'framer-motion'
import { Bitcoin } from 'lucide-react'

export function ContentLoadingOverlay() {
  const { isLoading } = useLoading()
  
  useLoadingStop()

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center rounded-lg"
        >
          <motion.div 
            className="text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="bg-gradient-to-br from-gradient-amber via-gradient-sky to-gradient-indigo rounded-lg p-3 mb-3 mx-auto w-fit shadow-lg"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Bitcoin className="h-7 w-7 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-base font-semibold bg-gradient-to-br from-gradient-amber via-gradient-sky to-gradient-indigo text-transparent bg-clip-text mb-1">
                CoinTrackr
              </h3>
              <p className="text-xs text-muted-foreground">Loading page...</p>
            </motion.div>

            {/* Progress bar */}
            <motion.div 
              className="w-24 h-0.5 bg-muted rounded-full overflow-hidden mt-3 mx-auto"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-gradient-sky to-gradient-indigo rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, ease: "easeInOut", repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}