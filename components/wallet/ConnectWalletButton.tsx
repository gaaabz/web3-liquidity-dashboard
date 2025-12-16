'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

interface ConnectWalletButtonProps {
  showBalance?: boolean
  chainStatus?: 'full' | 'icon' | 'name' | 'none'
  accountStatus?: 'full' | 'avatar' | 'address'
}

export function ConnectWalletButton({
  showBalance = true,
  chainStatus = 'icon',
  accountStatus = 'full',
}: ConnectWalletButtonProps) {
  return (
    <ConnectButton
      showBalance={showBalance}
      chainStatus={chainStatus}
      accountStatus={accountStatus}
    />
  )
}
