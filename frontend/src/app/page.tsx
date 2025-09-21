'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Bitcoin, TrendingUp, Shield, BarChart3, Wallet, ArrowRight, ChevronDown, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'

export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const [cryptoImages, setCryptoImages] = useState<Array<{ symbol: string; image_url: string | null }>>([])

  useEffect(() => {
    const fetchCryptoImages = async () => {
      try {
        const response = await fetch('http://localhost:3333/cryptos')
        const data = await response.json()
        setCryptoImages(data.slice(0, 8))
      } catch (error) {
        console.error('Failed to fetch crypto images:', error)
        setCryptoImages([
          { symbol: 'BTC', image_url: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
          { symbol: 'ETH', image_url: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
          { symbol: 'ADA', image_url: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
          { symbol: 'SOL', image_url: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
        ])
      }
    }

    fetchCryptoImages()
  }, [])

  const features = [
    {
      icon: <Wallet className="h-8 w-8" />,
      title: "Portfolio Management",
      description: "Track all your cryptocurrency holdings in one secure, intuitive dashboard."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Performance Analytics",
      description: "Comprehensive profit and loss tracking with detailed performance metrics for each asset."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Interactive Charts",
      description: "Beautiful visualizations of your portfolio distribution and performance."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security and encryption."
    }
  ]


    return (
    <div className="min-h-screen bg-background">
      <Header showAuthButtons={true} />

      <section className="relative pt-32 pb-20 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-gradient-amber/5 via-gradient-sky/10 to-gradient-indigo/5"
          style={{ y }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Your{' '}
                <span className="bg-gradient-to-r from-gradient-amber via-gradient-sky to-gradient-indigo text-transparent bg-clip-text">
                  Crypto Portfolio
                </span>{' '}
                Simplified
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Track, analyze, and optimize your cryptocurrency investments with real-time data, 
              comprehensive analytics, and intuitive portfolio management tools.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-gradient-sky to-gradient-indigo hover:from-gradient-sky/90 hover:to-gradient-indigo/90 text-white text-lg px-8 py-6">
                  Start Tracking Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            {cryptoImages.length > 0 && (
              <motion.div 
                className="absolute inset-0 pointer-events-none overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1.5 }}
              >
                {cryptoImages.map((crypto, index) => {
                  const positions = [
                    { left: '10%', top: '20%' },
                    { right: '15%', top: '15%' },
                    { left: '5%', top: '60%' },
                    { right: '8%', top: '70%' },
                    { left: '25%', top: '80%' },
                    { right: '30%', top: '25%' },
                    { left: '70%', top: '85%' },
                    { right: '60%', top: '40%' },
                  ]
                  
                  const position = positions[index] || positions[index % positions.length]
                  
                  return (
                    <motion.div
                      key={crypto.symbol}
                      className="absolute opacity-20 hover:opacity-40 transition-opacity duration-300"
                      style={position}
                      animate={{
                        y: [0, -15, 0],
                        rotate: [0, 8, -8, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 4 + index * 0.7,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2
                      }}
                    >
                      {crypto.image_url && (
                        <Image 
                          src={crypto.image_url} 
                          alt={crypto.symbol}
                          width={60}
                          height={60}
                          className="w-12 h-12 sm:w-15 sm:h-15 md:w-16 md:h-16 rounded-full shadow-lg filter blur-[0.5px]"
                        />
                      )}
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </div>
        </div>
        
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-8 w-8 text-muted-foreground" />
        </motion.div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-gradient-amber to-gradient-sky text-transparent bg-clip-text">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools and insights to help you make informed investment decisions
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <motion.div 
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gradient-sky/20 to-gradient-indigo/20 mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-gradient-sky">
                        {feature.icon}
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Beautiful{' '}
              <span className="bg-gradient-to-r from-gradient-amber to-gradient-indigo text-transparent bg-clip-text">
                Dashboard
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get a complete overview of your portfolio with our intuitive and modern interface
            </p>
          </motion.div>
          
          {/* Desktop Version */}
          <motion.div 
            className="max-w-7xl mx-auto hidden md:block"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-gradient-amber/20 via-gradient-sky/20 to-gradient-indigo/20 rounded-3xl blur-xl"></div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gradient-sky/30 bg-card/50 backdrop-blur-sm">
                <div className="bg-muted/80 px-6 py-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="bg-background/80 rounded-md px-4 py-1 text-sm text-muted-foreground max-w-xs mx-auto">
                        cointrackr.com/dashboard
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background rounded-lg">
                  <div className="p-4">
                    <div className="relative overflow-hidden rounded-lg">
                      <Image 
                        src="/images/dashboard-screenshot.png"
                        alt="CoinTrackr Dashboard Screenshot"
                        width={1920}
                        height={1080}
                        className="w-full h-auto object-contain"
                        priority
                      />
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-transparent pointer-events-none rounded-lg"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Version */}
          <motion.div 
            className="max-w-sm mx-auto md:hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-gradient-amber/20 via-gradient-sky/20 to-gradient-indigo/20 rounded-2xl blur-lg"></div>
              
              <div className="relative rounded-xl overflow-hidden shadow-xl border border-gradient-sky/30 bg-card/50 backdrop-blur-sm">
                <div className="bg-muted/80 px-3 py-2 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="bg-background/80 rounded px-2 py-0.5 text-xs text-muted-foreground">
                        cointrackr.com
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background">
                  <div className="p-2">
                    <div className="relative overflow-hidden rounded-lg h-48">
                      <Image 
                        src="/images/dashboard-screenshot.png"
                        alt="CoinTrackr Dashboard Screenshot"
                        width={1920}
                        height={1080}
                        className="w-full h-full object-cover object-top scale-125"
                        priority
                      />
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          </motion.div>
      </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center bg-gradient-to-br from-gradient-amber/10 via-gradient-sky/10 to-gradient-indigo/10 rounded-3xl p-8 md:p-12 border border-gradient-sky/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gradient-sky to-gradient-indigo rounded-full px-4 py-2 text-sm text-white mb-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="h-4 w-4" />
              Join thousands of smart investors
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Take Control of Your{' '}
              <span className="bg-gradient-to-r from-gradient-amber to-gradient-sky text-transparent bg-clip-text">
                Crypto Journey?
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Start tracking your cryptocurrency portfolio today and make informed investment decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-gradient-sky to-gradient-indigo hover:from-gradient-sky/90 hover:to-gradient-indigo/90 text-white text-lg px-8 py-6">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
                  Login
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-muted/30 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-gradient-amber via-gradient-sky to-gradient-indigo rounded-lg p-2">
                <Bitcoin className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-br from-gradient-amber via-gradient-sky to-gradient-indigo text-transparent bg-clip-text">
                CoinTrackr
              </span>
            </div>
            
            <div className="text-muted-foreground text-center md:text-right">
              <p>&copy; 2025 CoinTrackr. All rights reserved.</p>
              <p className="text-sm mt-1">Your crypto portfolio, simplified.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}