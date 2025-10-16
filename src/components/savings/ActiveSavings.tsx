import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, TrendingUp, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ActiveSavingsProps {
  userId: string | null;
  loading: boolean;
}

interface SavingPlan {
  id: string;
  plan_type: string;
  amount: number;
  monthly_yield: number;
  start_date: string;
  months_duration: number;
  status: string;
}

const levelConfig: Record<string, { color: string; label: string }> = {
  basico: { color: "hsl(var(--nivel-basico))", label: "Básico" },
  avanzado: { color: "hsl(var(--nivel-avanzado))", label: "Avanzado" },
  elite: { color: "hsl(var(--nivel-elite))", label: "Élite" },
};

export default function ActiveSavings({ userId, loading: parentLoading }: ActiveSavingsProps) {
  const [plans, setPlans] = useState<SavingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('savings_plans')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'activo')
          .order('start_date', { ascending: false });

        if (error) {
          console.error('Error cargando planes:', error);
          setPlans([]);
        } else {
          setPlans(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const calculateProgress = (startDate: string, monthsDuration: number) => {
    const start = new Date(startDate).getTime();
    const now = Date.now();
    const end = start + (monthsDuration * 30 * 24 * 60 * 60 * 1000);
    const elapsed = now - start;
    const total = end - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const calculateCurrentReturn = (amount: number, monthlyYield: number, startDate: string) => {
    const monthsActive = Math.max(0, 
      Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))
    );
    return amount * monthlyYield * monthsActive;
  };

  const calculateDaysActive = (startDate: string) => {
    return Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  };

  if (parentLoading || loading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center py-12">
          <p className="text-muted-foreground">Cargando planes activos...</p>
        </CardContent>
      </Card>
    );
  }

  if (plans.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center py-12">
          <p className="text-muted-foreground">
            No tienes planes activos. ¡Comienza a ahorrar hoy!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {plans.map((plan) => {
        const levelInfo = levelConfig[plan.plan_type] || levelConfig.basico;
        const progress = calculateProgress(plan.start_date, plan.months_duration);
        const currentReturn = calculateCurrentReturn(plan.amount, plan.monthly_yield, plan.start_date);
        const daysActive = calculateDaysActive(plan.start_date);

        return (
          <Card key={plan.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span>Plan {levelInfo.label}</span>
                    <Badge 
                      style={{ 
                        backgroundColor: `${levelInfo.color}20`,
                        color: levelInfo.color,
                        borderColor: levelInfo.color 
                      }}
                      className="border"
                    >
                      {levelInfo.label}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Iniciado el {new Date(plan.start_date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    ${plan.amount.toLocaleString('en-US')}
                  </div>
                  <div className="text-sm text-muted-foreground">USD</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="font-medium text-foreground">{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Rendimiento</div>
                    <div className="font-semibold text-foreground">
                      {(plan.monthly_yield * 100).toFixed(0)}% mensual
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Ganancia Actual</div>
                    <div className="font-semibold text-primary">
                      +${currentReturn.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Días Activo</div>
                    <div className="font-semibold text-foreground">{daysActive}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
