import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Package, Archive } from "lucide-react";
import ActiveSavings from "@/components/savings/ActiveSavings";
import SavingsHistory from "@/components/savings/SavingsHistory";

export default function Home() {
  const [activeTab, setActiveTab] = useState("activos");

  // Datos de ejemplo - en producción vendrán del backend
  const stats = {
    totalBalance: 5000,
    totalEarnings: 250,
    activePlans: 3,
    completedPlans: 2,
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Mis Ahorros</h1>
          <p className="text-muted-foreground">Gestiona tus planes de ahorro capitalizable</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saldo Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${stats.totalBalance.toLocaleString()} USD
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Balance acumulado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ganancias
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                +${stats.totalEarnings.toLocaleString()} USD
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Rendimientos totales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Planes Activos
              </CardTitle>
              <Package className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.activePlans}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                En progreso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completados
              </CardTitle>
              <Archive className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.completedPlans}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Planes finalizados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="activos">Mis Ahorros Activos</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activos" className="mt-6">
            <ActiveSavings />
          </TabsContent>
          
          <TabsContent value="historial" className="mt-6">
            <SavingsHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
