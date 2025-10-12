import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, TrendingUp, DollarSign } from "lucide-react";

// Datos de ejemplo - en producción vendrán del backend API
const activeSavings = [
  {
    id: 1,
    plan: "Plan Básico",
    amount: 300, // CORREGIDO: 500 → 300 (ejemplo de plan básico)
    level: "Básico",
    returnRate: "2%",
    startDate: "2025-09-15",
    currentReturn: 6, // CORREGIDO: 10 → 6 (2% de 300)
    progress: 20,
    color: "hsl(var(--nivel-basico))",
  },
  {
    id: 2,
    plan: "Plan Avanzado",
    amount: 3000,
    level: "Avanzado",
    returnRate: "4%",
    startDate: "2025-08-20",
    currentReturn: 120,
    progress: 40,
    color: "hsl(var(--nivel-avanzado))",
  },
  {
    id: 3,
    plan: "Plan Élite",
    amount: 30000,
    level: "Élite",
    returnRate: "6%",
    startDate: "2025-07-10",
    currentReturn: 1800,
    progress: 10,
    color: "hsl(var(--nivel-elite))",
  },
];

export default function ActiveSavings() {
  if (activeSavings.length === 0) {
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
      {activeSavings.map((saving) => (
        <Card key={saving.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <span>{saving.plan}</span>
                  <Badge 
                    style={{ 
                      backgroundColor: `${saving.color}20`,
                      color: saving.color,
                      borderColor: saving.color 
                    }}
                    className="border"
                  >
                    {saving.level}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Iniciado el {new Date(saving.startDate).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">
                  ${saving.amount.toLocaleString('en-US')}
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
                <span className="font-medium text-foreground">{saving.progress}%</span>
              </div>
              <Progress value={saving.progress} className="h-2" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Rendimiento</div>
                  <div className="font-semibold text-foreground">{saving.returnRate} mensual</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Ganancia Actual</div>
                  <div className="font-semibold text-primary">
                    +${saving.currentReturn}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Días Activo</div>
                  <div className="font-semibold text-foreground">
                    {Math.floor((Date.now() - new Date(saving.startDate).getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
