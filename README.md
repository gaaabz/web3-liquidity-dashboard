# Web3 Liquidity Dashboard

![Next.js](https://img.shields.io/badge/Next.js-15.5.7+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

Dashboard profesional de gestión de liquidez para **Uniswap V3**, diseñado para LPs (Liquidity Providers) avanzados. Proporciona análisis detallado de posiciones, métricas en tiempo real y simulaciones de estrategias.

## Características Principales

- **Multi-Chain Support**: Ethereum Sepolia y Avalanche Fuji
- **Wallet Integration**: RainbowKit + Wagmi v2 con soporte para MetaMask, WalletConnect y Coinbase
- **Demo Mode**: Explora todas las funcionalidades sin conectar una wallet
- **Dashboard Completo**: TVL, fees acumuladas, estado de rangos
- **Detalle de Posiciones**: Visualización de rango de precios, exposición de tokens, Impermanent Loss
- **Simulaciones**: Rebalanceo, aumento y disminución de liquidez sin transacciones reales
- **Dark Mode First**: Diseño profesional estilo DeFi

---

## Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| Framework | Next.js 15.5.7+ (App Router) |
| Lenguaje | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Web3 | Wagmi v2 + Viem + RainbowKit |
| State Management | Zustand (persist) |
| Data Fetching | TanStack Query v5 |
| Protocolos | Uniswap V3 SDK |
| Redes | Ethereum Sepolia, Avalanche Fuji |

---

## Flujo de la Aplicación

```mermaid
flowchart TD
    A[Landing Page] --> B{Wallet Conectada?}
    B -->|No| C[Demo Mode Automático]
    B -->|Sí| D[Datos en Vivo]
    C --> E[Dashboard]
    D --> E
    E --> F[Lista de Posiciones]
    F --> G[Detalle de Posición]
    G --> H{Simulaciones}
    H --> I[Rebalancear Rango]
    H --> J[Agregar Liquidez]
    H --> K[Remover Liquidez]

    subgraph Métricas
        E --> L[TVL Total]
        E --> M[Fees Acumuladas]
        E --> N[Posiciones en Rango]
        E --> O[Alertas Out of Range]
    end

    subgraph Análisis
        G --> P[Rango de Precios]
        G --> Q[Exposición de Tokens]
        G --> R[Impermanent Loss]
        G --> S[Net P&L]
    end
```

---

## Arquitectura del Proyecto

```mermaid
graph TB
    subgraph "App Layer"
        A1[layout.tsx]
        A2[page.tsx]
        A3[dashboard/]
        A4[positions/]
        A5[simulate/]
    end

    subgraph "Components"
        C1[providers/]
        C2[layout/]
        C3[positions/]
        C4[metrics/]
        C5[demo/]
        C6[wallet/]
        C7[ui/]
    end

    subgraph "Hooks"
        H1[wallet/]
        H2[demo/]
        H3[positions/]
        H4[pools/]
    end

    subgraph "Lib"
        L1[stores/]
        L2[uniswap/]
        L3[calculations/]
        L4[contracts/]
        L5[graph/]
    end

    subgraph "Data"
        D1[demo/positions]
        D2[demo/tokens]
    end

    A1 --> C1
    A3 --> C3
    A3 --> C4
    A5 --> C5
    C3 --> H3
    C4 --> H2
    H2 --> L1
    H3 --> L2
    L2 --> L3
```

---

## Estructura de Carpetas

```mermaid
graph LR
    subgraph root[web3-liquidity-dashboard]
        subgraph app[app/]
            app1[layout.tsx]
            app2[page.tsx]
            app3[error.tsx]
            app4[not-found.tsx]
            app5[globals.css]

            subgraph dashboard[dashboard/]
                d1[layout.tsx]
                d2[page.tsx]
                d3[loading.tsx]
            end

            subgraph positions[positions/]
                subgraph tokenId["[tokenId]/"]
                    p1[page.tsx]
                    p2[loading.tsx]
                end
            end

            subgraph simulate[simulate/]
                s1[page.tsx]
                subgraph rebalance[rebalance/]
                    r1[page.tsx]
                end
                subgraph increase[increase/]
                    i1[page.tsx]
                end
                subgraph decrease[decrease/]
                    dc1[page.tsx]
                end
            end
        end

        subgraph components[components/]
            comp1[providers/]
            comp2[layout/]
            comp3[positions/]
            comp4[metrics/]
            comp5[demo/]
            comp6[wallet/]
            comp7[ui/]
        end

        subgraph hooks[hooks/]
            h1[wallet/]
            h2[demo/]
            h3[positions/]
            h4[pools/]
        end

        subgraph lib[lib/]
            l1[stores/]
            l2[uniswap/]
            l3[calculations/]
            l4[contracts/]
            l5[graph/]
        end

        subgraph types[types/]
            t1[position.ts]
            t2[pool.ts]
            t3[token.ts]
        end

        subgraph data[data/]
            subgraph demo[demo/]
                dm1[positions.ts]
                dm2[tokens.ts]
            end
        end
    end
```

---

## Instalación

### Requisitos Previos

- Node.js 18.17+
- pnpm 8.0+

### Pasos

```bash
git clone <repository-url>
cd web3-liquidity-dashboard

pnpm install

pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

### Build de Producción

```bash
pnpm build
pnpm start
```

---

## Uso

### Demo Mode

El Demo Mode se activa automáticamente cuando no hay wallet conectada. También puedes activarlo manualmente desde el dashboard.

**Características del Demo Mode:**
- 5 posiciones de ejemplo con diferentes pools
- Datos realistas de TVL y fees
- Posiciones in-range y out-of-range
- Persistencia permanente del estado con Zustand

### Conectar Wallet

1. Click en "Connect Wallet" en el header
2. Selecciona tu wallet (MetaMask, WalletConnect, Coinbase)
3. Aprueba la conexión
4. Asegúrate de estar en una red soportada (Sepolia o Fuji)

### Dashboard

El dashboard muestra:
- **TVL Total**: Valor total de todas tus posiciones
- **Fees Acumuladas**: Fees pendientes de reclamar
- **Posiciones**: Número total de posiciones activas
- **Out of Range**: Alertas de posiciones fuera de rango

### Simulaciones

Las simulaciones te permiten probar estrategias sin realizar transacciones reales:

| Simulación | Descripción |
|------------|-------------|
| Rebalance | Ajustar el rango de precios de una posición |
| Add Liquidity | Agregar más tokens a una posición existente |
| Remove Liquidity | Retirar liquidez parcial o totalmente |

---

## Cálculos Uniswap V3

### Tick Math

```
price = 1.0001^tick
sqrtPriceX96 = sqrt(price) * 2^96
```

### Impermanent Loss

```
IL = 2 * sqrt(priceRatio) / (1 + priceRatio) - 1
```

### Position Health

Una posición está "in range" cuando:
```
tickLower <= currentTick < tickUpper
```

---

## Contratos Soportados

### Ethereum Sepolia

| Contrato | Dirección |
|----------|-----------|
| NonfungiblePositionManager | `0x1238536071E1c677A632429e3655c799b22cDA52` |
| Factory | `0x0227628f3F023bb0B980b67D528571c95c6DaC1c` |
| SwapRouter02 | `0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E` |
| QuoterV2 | `0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3` |

---

## State Management

El estado del Demo Mode se gestiona con **Zustand** y persiste automáticamente en localStorage:

```typescript
interface DemoState {
  isDemoMode: boolean
  enableDemoMode: () => void
  disableDemoMode: () => void
  toggleDemoMode: () => void
}
```

---

## Roadmap

- [ ] Soporte para Mainnet
- [ ] Histórico de transacciones
- [ ] Notificaciones de out-of-range
- [ ] Integración con más DEXs
- [ ] Gráficos de performance
- [ ] Export de datos a CSV

---

## Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.

---

## Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-feature`)
3. Commit tus cambios (`git commit -m 'Add nueva feature'`)
4. Push a la rama (`git push origin feature/nueva-feature`)
5. Abre un Pull Request
