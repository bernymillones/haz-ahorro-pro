import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PlanWidgetProps {
  amount: number;
  level: string;
  return: string;
  color: string;
}

export default function PlanWidget({ amount, level, return: returnRate, color }: PlanWidgetProps) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    try {
      setLoading(true);
      
      const orderData = {
        amount: amount.toString(),
        currency: "USD",
        order_id: `hd-${amount}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      const response = await fetch('https://api.hazdinero.online/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}`);
      }

      if (data.success && data.payment_url) {
        toast({
          title: "Orden creada",
          description: "Redirigiendo a la pasarela de pago...",
        });
        
        setTimeout(() => {
          window.location.href = data.payment_url;
        }, 1000);
      } else {
        throw new Error('No se recibió URL de pago válida');
      }
    } catch (error) {
      console.error('Error en la compra:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo procesar el pago",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const colorMap: Record<string, string> = {
    "nivel-basico": "hsl(var(--nivel-basico))",
    "nivel-avanzado": "hsl(var(--nivel-avanzado))",
    "nivel-elite": "hsl(var(--nivel-elite))",
  };

  const bgColor = colorMap[color];

  return (
    <Card className="relative overflow-hidden border-2 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: bgColor }}
      />
      
      <CardContent className="pt-8 pb-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div 
            className="text-sm font-semibold tracking-wider uppercase inline-block px-3 py-1 rounded-full"
            style={{ 
              backgroundColor: `${bgColor}20`,
              color: bgColor 
            }}
          >
            💰 {level}
          </div>
          <h3 className="text-3xl font-bold text-foreground">
            ${amount.toLocaleString('en-US')} USD
          </h3>
          <div 
            className="text-sm font-medium"
            style={{ color: bgColor }}
          >
            Rendimiento: {returnRate}
          </div>
        </div>

        {/* Button */}
        <Button
          onClick={handlePurchase}
          disabled={loading}
          className="w-full text-base font-bold shadow-md hover:shadow-lg transition-all"
          style={{
            backgroundColor: bgColor,
            color: 'white',
          }}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              🚀 Ahorrar Plan - ${amount.toLocaleString('en-US')} USD
            </>
          )}
        </Button>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span className="text-xs">Pago seguro con Criptomonedas</span>
        </div>
      </CardContent>
    </Card>
  );
}
