import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlanWidget from "@/components/savings/PlanWidget";

const plans = {
  basico: [
    { amount: 100, level: "Básico", return: "2% mensual", color: "nivel-basico" },
    { amount: 300, level: "Básico", return: "2% mensual", color: "nivel-basico" },
    { amount: 500, level: "Básico", return: "2% mensual", color: "nivel-basico" },
    { amount: 800, level: "Básico", return: "2% mensual", color: "nivel-basico" },
  ],
  avanzado: [
    { amount: 1000, level: "Avanzado", return: "3% mensual", color: "nivel-avanzado" },
    { amount: 1500, level: "Avanzado", return: "3% mensual", color: "nivel-avanzado" },
    { amount: 2000, level: "Avanzado", return: "3% mensual", color: "nivel-avanzado" },
    { amount: 3000, level: "Avanzado", return: "3% mensual", color: "nivel-avanzado" },
  ],
  elite: [
    { amount: 5000, level: "Élite", return: "4% mensual", color: "nivel-elite" },
    { amount: 8000, level: "Élite", return: "4% mensual", color: "nivel-elite" },
    { amount: 10000, level: "Élite", return: "4% mensual", color: "nivel-elite" },
    { amount: 15000, level: "Élite", return: "4% mensual", color: "nivel-elite" },
  ],
};

export default function NewSaving() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Nuevo Ahorro</h1>
          <p className="text-muted-foreground">
            Selecciona el plan que mejor se adapte a tus objetivos financieros
          </p>
        </div>

        {/* Plans by Level */}
        <Tabs defaultValue="basico" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="basico" className="data-[state=active]:bg-[hsl(var(--nivel-basico))] data-[state=active]:text-white">
              💰 Básico
            </TabsTrigger>
            <TabsTrigger value="avanzado" className="data-[state=active]:bg-[hsl(var(--nivel-avanzado))] data-[state=active]:text-white">
              🚀 Avanzado
            </TabsTrigger>
            <TabsTrigger value="elite" className="data-[state=active]:bg-[hsl(var(--nivel-elite))] data-[state=active]:text-white">
              👑 Élite
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basico" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {plans.basico.map((plan) => (
                <PlanWidget key={plan.amount} {...plan} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="avanzado" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {plans.avanzado.map((plan) => (
                <PlanWidget key={plan.amount} {...plan} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="elite" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {plans.elite.map((plan) => (
                <PlanWidget key={plan.amount} {...plan} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
