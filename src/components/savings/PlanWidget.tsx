import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Plan {
  id: string;
  name: string;
  amount: string;
  yield: string;
  color: string;
  features: string[];
}

const plans: Plan[] = [
  // Planes Básicos - 2%
  {
    id: 'basic-100',
    name: 'Plan Básico',
    amount: '$100 USD',
    yield: '2% mensual',
    color: 'bg-green-500',
    features: ['Rendimiento estable', 'Dashboard personalizado']
  },
  {
    id: 'basic-300',
    name: 'Plan Básico',
    amount: '$300 USD',
    yield: '2% mensual',
    color: 'bg-green-500',
    features: ['Rendimiento estable', 'Dashboard personalizado']
  },
  {
    id: 'basic-500',
    name: 'Plan Básico',
    amount: '$500 USD',
    yield: '2% mensual',
    color: 'bg-green-500',
    features: ['Rendimiento estable', 'Dashboard personalizado']
  },
  {
    id: 'basic-800',
    name: 'Plan Básico',
    amount: '$800 USD',
    yield: '2% mensual',
    color: 'bg-green-500',
    features: ['Rendimiento estable', 'Dashboard personalizado']
  },

  // Planes Avanzado - 4%
  {
    id: 'advanced-1000',
    name: 'Plan Avanzado',
    amount: '$1,000 USD',
    yield: '4% mensual',
    color: 'bg-blue-500',
    features: ['Mayor rendimiento', 'Soporte prioritario', 'Retiros semanales']
  },
  {
    id: 'advanced-3000',
    name: 'Plan Avanzado',
    amount: '$3,000 USD',
    yield: '4% mensual',
    color: 'bg-blue-500',
    features: ['Mayor rendimiento', 'Soporte prioritario', 'Retiros semanales']
  },
  {
    id: 'advanced-5000',
    name: 'Plan Avanzado',
    amount: '$5,000 USD',
    yield: '4% mensual',
    color: 'bg-blue-500',
    features: ['Mayor rendimiento', 'Soporte prioritario', 'Retiros semanales']
  },
  {
    id: 'advanced-8000',
    name: 'Plan Avanzado',
    amount: '$8,000 USD',
    yield: '4% mensual',
    color: 'bg-blue-500',
    features: ['Mayor rendimiento', 'Soporte prioritario', 'Retiros semanales']
  },

  // Planes Élite - 6%
  {
    id: 'elite-10000',
    name: 'Plan Élite',
    amount: '$10,000 USD',
    yield: '6% mensual',
    color: 'bg-purple-500',
    features: ['Máximo rendimiento', 'Soporte 24/7', 'Retiros diarios', 'Asesor personal']
  },
  {
    id: 'elite-30000',
    name: 'Plan Élite',
    amount: '$30,000 USD',
    yield: '6% mensual',
    color: 'bg-purple-500',
    features: ['Máximo rendimiento', 'Soporte 24/7', 'Retiros diarios', 'Asesor personal']
  },
  {
    id: 'elite-50000',
    name: 'Plan Élite',
    amount: '$50,000 USD',
    yield: '6% mensual',
    color: 'bg-purple-500',
    features: ['Máximo rendimiento', 'Soporte 24/7', 'Retiros diarios', 'Asesor personal']
  },
  {
    id: 'elite-80000',
    name: 'Plan Élite',
    amount: '$80,000 USD',
    yield: '6% mensual',
    color: 'bg-purple-500',
    features: ['Máximo rendimiento', 'Soporte 24/7', 'Retiros diarios', 'Asesor personal']
  }
];

const PlanWidget: React.FC = () => {
  const handlePlanSelect = (plan: Plan) => {
    console.log('Plan seleccionado:', plan);
    // Aquí iría la lógica para redirigir al pago
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {plans.map((plan) => (
        <Card key={plan.id} className="border-2 hover:border-primary transition-all">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <Badge className={plan.color}>
                {plan.yield}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold text-primary">
              {plan.amount}
            </div>
            
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>

            <Button 
              className="w-full"
              onClick={() => handlePlanSelect(plan)}
            >
              Ahorrar Plan
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PlanWidget;
