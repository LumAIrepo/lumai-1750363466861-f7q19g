import React from "react"
```tsx
'use client'

import { useState, useEffect } from 'react'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { Inter } from 'next/font/google'
import { ChevronRightIcon, WalletIcon, CubeTransparentIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

const inter = Inter({ subsets: ['latin'] })

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
]

const network = WalletAdapterNetwork.Devnet
const endpoint = clusterApiUrl(network)

function WalletConnectionStatus() {
  const { connection } = useConnection()
  const { publicKey, connected } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance()
    } else {
      setBalance(null)
    }
  }, [connected, publicKey, connection])

  const fetchBalance = async () => {
    if (!publicKey) return
    
    try {
      setLoading(true)
      const balance = await connection.getBalance(publicKey)
      setBalance(balance / 1e9) // Convert lamports to SOL
    } catch (error) {
      console.error('Error fetching balance:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!connected) {
    return (
      <div className="bg-purple-100 border border-purple-200 rounded-lg p-4">
        <p className="text-purple-600 text-sm">Connect your wallet to get started</p>
      </div>
    )
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-800 font-medium">Wallet Connected</p>
          <p className="text-green-600 text-sm font-mono">
            {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-green-800 font-medium">
            {loading ? 'Loading...' : `${balance?.toFixed(4) || '0.0000'} SOL`}
          </p>
          <button
            onClick={fetchBalance}
            disabled={loading}
            className="text-green-600 text-sm hover:text-green-800 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  )
}

function MainContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const features = [
    {
      icon: WalletIcon,
      title: 'Wallet Integration',
      description: 'Connect your Solana wallet seamlessly with support for multiple wallet providers.'
    },
    {
      icon: CubeTransparentIcon,
      title: 'Blockchain Interaction',
      description: 'Interact with Solana programs and smart contracts with ease.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Fast',
      description: 'Built on Solana\'s high-performance blockchain for secure and fast transactions.'
    }
  ]

  const handleGetStarted = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulate some async operation
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Add your logic here
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 ${inter.className}`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">HelloSolana</h1>
            </div>
            <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-lg !transition-colors" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="text-purple-600">HelloSolana</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your gateway to the Solana blockchain. Connect your wallet, interact with programs, 
            and explore the fastest growing ecosystem in crypto.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? 'Loading...' : 'Get Started'}
              {!isLoading && <ChevronRightIcon className="ml-2 w-5 h-5" />}
            </button>
            <button className="border border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-lg font-medium transition-colors">
              Learn More
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Wallet Status */}
        <div className="mb-16 max-w-2xl mx-auto">
          <WalletConnectionStatus />
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose HelloSolana?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-purple-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">Fast</div>
              <div className="text-gray-600">65,000 TPS</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">Cheap</div>
              <div className="text-gray-600">$0.00025 per tx</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">Secure</div>
              <div className="text-gray-600">Proof of Stake</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">Growing</div>
              <div className="text-gray-600">Active Ecosystem</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-purple-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 HelloSolana. Built with Next.js and Solana Web3.js</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function Page() {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <MainContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
```