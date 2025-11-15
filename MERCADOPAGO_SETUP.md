# Configuración de MercadoPago

## 📋 Pasos para configurar MercadoPago

### 1. Crear cuenta en MercadoPago

1. Ir a https://www.mercadopago.com.ar/developers
2. Crear una cuenta o iniciar sesión
3. Ir a "Tus aplicaciones" → "Crear aplicación"
4. Seleccionar "Checkout Pro" como producto
5. Darle un nombre a tu aplicación (ej: "Gym App")

### 2. Obtener credenciales

#### Para Testing (Sandbox):
1. En el dashboard de tu aplicación, ir a "Credenciales de prueba"
2. Copiar el **Access Token** de prueba
3. Copiar la **Public Key** de prueba

#### Para Producción:
1. En el dashboard de tu aplicación, ir a "Credenciales de producción"
2. **Activar las credenciales de producción** (requiere verificación de cuenta)
3. Copiar el **Access Token** de producción
4. Copiar la **Public Key** de producción

### 3. Configurar variables de entorno

#### Backend (`backend/.env`):
```bash
# MercadoPago - Testing
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-123456-abcdef1234567890-123456789
MERCADOPAGO_PUBLIC_KEY=TEST-abcdef12-3456-7890-abcd-ef1234567890

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
```

#### Frontend (`frontend/.env`):
```bash
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-abcdef12-3456-7890-abcd-ef1234567890
```

### 4. Crear planes de membresía

Usar los endpoints de admin para crear planes:

```bash
# Ejemplo: Crear plan mensual
POST http://localhost:3000/api/mercadopago/plans
Authorization: Bearer {admin_token}

{
  "nombre": "Plan Mensual",
  "descripcion": "Acceso ilimitado por 30 días",
  "tipo": "MENSUAL",
  "precio": 15000,
  "duracionDias": 30,
  "beneficios": [
    "Acceso ilimitado al gimnasio",
    "Clases grupales incluidas",
    "Reserva de clases online",
    "App móvil"
  ],
  "destacado": false,
  "orden": 1
}
```

### 5. Testing

#### Tarjetas de prueba de MercadoPago:

| Tarjeta | Número | Código | Vencimiento |
|---------|--------|--------|-------------|
| Mastercard | 5031 7557 3453 0604 | 123 | 11/25 |
| Visa | 4509 9535 6623 3704 | 123 | 11/25 |

**Datos del titular (testing):**
- Nombre: APRO (para aprobar)
- Nombre: OTHE (para rechazar)
- DNI: 12345678

### 6. Webhooks (Producción)

Para producción, configurar webhook URL en MercadoPago:

1. Ir a tu aplicación en MercadoPago
2. Configurar "Notifications" → "Webhooks"
3. URL: `https://tu-dominio.com/api/mercadopago/webhook`
4. Eventos: `payment`

### 7. URLs de retorno

Las URLs de retorno ya están configuradas en el código:
- Success: `{FRONTEND_URL}/payment/success`
- Failure: `{FRONTEND_URL}/payment/failure`
- Pending: `{FRONTEND_URL}/payment/pending`

## 🧪 Flujo de prueba

1. Usuario hace login
2. Va a `/plans`
3. Selecciona un plan
4. Es redirigido a MercadoPago Checkout
5. Completa el pago con tarjeta de prueba
6. Es redirigido a `/payment/success`
7. La membresía se crea automáticamente

## 📚 Documentación oficial

- [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
- [Checkout Pro](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/landing)
- [Testing](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/test-integration)

## ⚠️ Notas importantes

1. **NUNCA** subir las credenciales de producción a git
2. Usar **siempre** variables de entorno
3. En producción, usar HTTPS para el webhook
4. Validar los pagos en el webhook antes de activar membresías
5. Guardar logs de todos los pagos para auditoría
