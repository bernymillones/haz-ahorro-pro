import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Wallet, ExternalLink, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Profile() {
  const handleSaveWallet = () => {
    toast({
      title: "Wallet guardada",
      description: "Tu dirección de wallet ha sido actualizada correctamente.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Perfil y Wallet</h1>
          <p className="text-muted-foreground">
            Configura tu wallet de Cryptomus para recibir tus rendimientos
          </p>
        </div>

        {/* Wallet Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <CardTitle>Wallet de Cryptomus</CardTitle>
            </div>
            <CardDescription>
              Necesitas una wallet de Cryptomus para recibir tus ganancias de forma segura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet">Dirección de Wallet</Label>
              <Input
                id="wallet"
                placeholder="Ingresa tu dirección de wallet de Cryptomus"
                className="font-mono text-sm"
              />
            </div>
            <Button onClick={handleSaveWallet} className="w-full sm:w-auto">
              Guardar Wallet
            </Button>
          </CardContent>
        </Card>

        {/* Create Wallet */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-secondary" />
              <CardTitle>¿No tienes una wallet?</CardTitle>
            </div>
            <CardDescription>
              Crea tu wallet de Cryptomus en minutos - es gratis y segura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <p className="text-sm text-foreground">
                Cryptomus es una plataforma segura y confiable para gestionar criptomonedas.
                Sigue estos pasos para crear tu wallet:
              </p>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2 ml-2">
                <li>Visita el sitio web oficial de Cryptomus</li>
                <li>Crea tu cuenta de forma gratuita</li>
                <li>Verifica tu identidad (proceso rápido)</li>
                <li>Copia tu dirección de wallet</li>
                <li>Pégala en el campo de arriba</li>
              </ol>
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => window.open('https://cryptomus.com', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ir a Cryptomus
            </Button>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Seguridad de tu Wallet</h4>
                <p className="text-sm text-muted-foreground">
                  Nunca compartas tu clave privada con nadie. Solo necesitamos tu dirección pública
                  de wallet para enviarte tus rendimientos. HazDinero.Online nunca te pedirá tu
                  clave privada.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
