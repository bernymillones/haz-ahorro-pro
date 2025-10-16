import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Package, Archive } from "lucide-react";
import ActiveSavings from "@/components/savings/ActiveSavings";
import SavingsHistory from "@/components/savings/SavingsHistory";
import { useParentUser } from "@/hooks/useParentUser";
import { supabase } from "@/integrations/supabase/client";

export default function Home() {
  const [activeTab, setActiveTab] = useState("activos");
  const parentUser = useParentUser();
  const [userId, setUserId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalEarnings: 0,
    activePlans: 0,
    completedPlans: 0,
  });
  const [loading, setLoading] = useState(true);

  // Resolver o crear usuario desde Supabase
  useEffect(() => {
    if (!parentUser?.email) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // Buscar usuario por email
        const { data: existingUser, error: searchError } = await (supabase as any)
          .from('users')
          .select('id')
          .eq('email', parentUser.email)
          .maybeSingle();

        if (searchError) {
          console.error('Error buscando usuario:', searchError);
          setLoading(false);
          return;
        }

        if (existingUser) {
          setUserId(existingUser.id);
        } else {
          // Crear usuario si no existe
          const { data: newUser, error: createError } = await (supabase as any)
            .from('users')
            .insert([{ 
              email: parentUser.email, 
              name: (parentUser as any).name || parentUser.email.split('@')[0] 
            }])
            .select()
            .single();

          if (createError) {
            console.error('Error creando usuario:', createError);
            setLoading(false);
            return;
          }

          if (newUser) {
            setUserId(newUser.id);
          }
        }
      } catch (err) {
        console.error('Error en useEffect:', err);
        setLoading(false);
      }
    })();
  }, [parentUser]);

  // Cargar estadísticas cuando tengamos userId
  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        // Obtener planes del usuario
        const { data: plans, error: plansError } = await (supabase as any)
          .from('savings_plans')
          .select('*')
          .eq('user_id', userId);

        if (plansError) {
          console.error('Error cargando planes:', plansError);
          setLoading(false);
          return;
        }

        // Calcular estadísticas
        const activePlans = plans?.filter((p: any) => p.status === 'activo') || [];
        const completedPlans = plans?.filter((p: any) => p.status === 'completado') || [];
        
        const totalBalance = activePlans.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
        const totalEarnings = activePlans.reduce((sum: number, p: any) => {
          const monthsActive = Math.max(0, 
            Math.floor((Date.now() - new Date(p.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30))
          );
          return sum + (Number(p.amount) * Number(p.monthly_yield) * monthsActive);
        }, 0);

        setStats({
          totalBalance,
          totalEarnings,
          activePlans: activePlans.length,
          completedPlans: completedPlans.length,
        });

        setLoading(false);
      } catch (err) {
        console.error('Error calculando estadísticas:', err);
        setLoading(false);
      }
    })();
  }, [userId]);

  if (!parentUser?.email) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Conectando con el sistema principal...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Mis Ahorros</h1>
          <p className="text-muted-foreground">
            Gestiona tus planes de ahorro capitalizable - {parentUser.email}
          </p>
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
                {loading ? '...' : `$${stats.totalBalance.toLocaleString('en-US')} USD`}
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
                {loading ? '...' : `+$${stats.totalEarnings.toLocaleString('en-US', { maximumFractionDigits: 2 })} USD`}
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
                {loading ? '...' : stats.activePlans}
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
                {loading ? '...' : stats.completedPlans}
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
            <ActiveSavings userId={userId} loading={loading} />
          </TabsContent>
          
          <TabsContent value="historial" className="mt-6">
            <SavingsHistory userId={userId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
