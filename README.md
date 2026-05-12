## Expected project structure

/
├── public/
│   ├── manifest.json         # Configuración de PWA
│   └── icons/                # Iconos para "Añadir a pantalla de inicio"
├── src/
│   ├── app/
│   │   ├── (auth)/           # Grupo: Login, Registro, Recuperación
│   │   │   ├── login/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (client)/         # Grupo: El Cliente Final (PWA)
│   │   │   ├── join/[slug]/page.tsx   # Landing de registro por negocio
│   │   │   ├── card/page.tsx          # Vista de la tarjeta y puntos
│   │   │   └── layout.tsx             # Layout minimalista (sin barras de navegación)
│   │   ├── (merchant)/       # Grupo: El Barista/Empleado
│   │   │   ├── scan/page.tsx          # El escáner de QR
│   │   │   └── layout.tsx             # Layout optimizado para móvil en caja
│   │   ├── (admin)/          # Grupo: El Dueño del Negocio
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── settings/page.tsx      # Configuración de premios y logo
│   │   │   └── layout.tsx             # Sidebar y navegación administrativa
│   │   ├── api/              # Endpoints del Backend
│   │   │   ├── loyalty/increment/route.ts
│   │   │   ├── wallet/generate/route.ts
│   │   │   └── webhooks/route.ts
│   │   ├── layout.tsx        # Root Layout (Fuentes, Analytics)
│   │   └── page.tsx          # Landing page global del SaaS (Venta del software)
│   ├── components/           # UI Atoms & Molecules
│   │   ├── ui/               # Componentes base (Botones, Inputs - Shadcn/ui)
│   │   ├── shared/           # QrCode, Logo, ThemeToggle
│   │   ├── scanner/          # Lógica de la cámara (Html5Qrcode)
│   │   └── wallet/           # Botón de "Add to Google Wallet"
│   ├── hooks/                # Hooks personalizados
│   │   ├── usePoints.ts      # Fetch y suscripción Realtime a puntos
│   │   └── useScanner.ts     # Lógica de procesamiento de escaneo
│   ├── lib/                  # Clientes de terceros
│   │   ├── supabase.ts       # Cliente de Supabase
│   │   └── google-wallet.ts  # Configuración de Service Account
│   ├── services/             # Lógica de Negocio (Pura)
│   │   ├── loyaltyService.ts # Funciones de suma/canje de puntos
│   │   └── fraudService.ts   # Validaciones de tiempo y seguridad
│   ├── types/                # Definiciones de TypeScript
│   │   └── database.ts       # Tipos generados de Supabase
│   └── middleware.ts         # Protección de rutas por rol
├── tailwind.config.js
└── next.config.js