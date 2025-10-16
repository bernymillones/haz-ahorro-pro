# Backend API - Haz Ahorro Pro

## Variables de Entorno Requeridas

Configura estas variables en tu plataforma de deployment (Render):

```env
# Supabase Configuration
SUPABASE_URL=https://pgfeahwvbhbcuulfriur.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# Cryptomus Configuration
CRYPTOMUS_API_KEY=tu_api_key_cryptomus
CRYPTOMUS_MERCHANT_ID=tu_merchant_id_cryptomus
CRYPTOMUS_WEBHOOK_SECRET=tu_webhook_secret_cryptomus

# API Configuration
API_BASE_URL=https://api.hazdinero.online
PORT=3000
```

## Endpoints Disponibles

### 1. POST `/create-payment`
Crea una orden de pago en Cryptomus.

**Request Body:**
```json
{
  "amount": "10000",
  "currency": "USD",
  "order_id": "hd-test-10000"
}
```

**Response:**
```json
{
  "success": true,
  "payment_url": "https://pay.cryptomus.com/...",
  "payment_id": "uuid-cryptomus"
}
```

### 2. POST `/create-subscription`
Crea usuario, plan de ahorro y transacción inicial.

**Request Body:**
```json
{
  "user_email": "usuario@ejemplo.com",
  "user_name": "Juan Pérez",
  "plan_type": "basico",
  "amount": "10000",
  "months_duration": 12,
  "monthly_yield": "0.08"
}
```

**Response:**
```json
{
  "success": true,
  "user_id": "uuid",
  "plan_id": "uuid",
  "transaction_id": "uuid",
  "order_id": "hd-plan-uuid-timestamp"
}
```

### 3. POST `/webhook/cryptomus`
Recibe notificaciones de pago de Cryptomus.

- Valida firma MD5
- Actualiza estado de transacciones
- Activa planes de ahorro
- Registra wallet del usuario

### 4. GET `/health`
Health check del servidor.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "env_check": {
    "supabase_url": true,
    "supabase_key": true,
    "cryptomus_api_key": true,
    "cryptomus_merchant_id": true,
    "cryptomus_webhook_secret": true,
    "api_base_url": "https://api.hazdinero.online"
  }
}
```

## Prueba Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar servidor
npm start

# Probar endpoint
curl -X POST http://localhost:3000/create-payment \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "10000",
    "currency": "USD",
    "order_id": "hd-test-10000"
  }'
```

## Notas de Seguridad

- Usa siempre HTTPS en producción
- El `SUPABASE_SERVICE_ROLE_KEY` solo debe estar en el backend
- Configura CORS apropiadamente para tu frontend
- Valida todas las entradas del usuario
- Los webhooks validan firma MD5 antes de procesar
