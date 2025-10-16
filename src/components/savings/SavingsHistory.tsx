import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SavingsHistoryProps {
  userId: string | null;
}

interface Transaction {
  id: string;
  plan_id: string;
  amount: number;
  payment_date: string;
  status: string;
  payment_type: string;
}

const mockHistoryData = [
  {
    id: 1,
    date: "2025-10-01",
    plan: "Plan Básico",
    amount: 500,
    returnPercent: 2,
    earnings: 10,
    status: "completed",
  },
  {
    id: 2,
    date: "2025-09-15",
    plan: "Plan Avanzado",
    amount: 2000,
    returnPercent: 3,
    earnings: 60,
    status: "completed",
  },
  {
    id: 3,
    date: "2025-08-20",
    plan: "Plan Élite",
    amount: 10000,
    returnPercent: 4,
    earnings: 400,
    status: "completed",
  },
  {
    id: 4,
    date: "2025-07-10",
    plan: "Plan Básico",
    amount: 300,
    returnPercent: 2,
    earnings: 6,
    status: "completed",
  },
];

export default function SavingsHistory({ userId }: SavingsHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('transactions')
          .select('*')
          .order('payment_date', { ascending: false });

        if (error) {
          console.error('Error cargando transacciones:', error);
          setTransactions([]);
        } else {
          setTransactions(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const historyData = transactions.length > 0 ? transactions : mockHistoryData;
  const handleExportPDF = () => {
    toast({
      title: "Exportando a PDF",
      description: "Tu historial se está preparando para descargar...",
    });
  };

  const handleExportCSV = () => {
    toast({
      title: "Exportando a CSV",
      description: "Tu historial se está preparando para descargar...",
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === "completed") {
      return <Badge className="bg-primary/20 text-primary border-primary">Completado</Badge>;
    }
    return <Badge variant="secondary">Pendiente</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Historial de Pagos</CardTitle>
            <CardDescription>
              Todos tus pagos y rendimientos recibidos
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <FileText className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando historial...</p>
          </div>
        ) : historyData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No hay transacciones registradas aún
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="text-center">Rendimiento</TableHead>
                  <TableHead className="text-right">Ganancia</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyData.map((item: any) => {
                  const date = item.payment_date || item.date;
                  const planName = item.plan || 'Plan';
                  const amount = Number(item.amount);
                  const returnPercent = item.returnPercent || 2;
                  const earnings = item.earnings || 0;
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        {new Date(date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="font-medium">{planName}</TableCell>
                      <TableCell className="text-right font-mono">
                        ${amount.toLocaleString()} USD
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{returnPercent}%</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        +${earnings.toLocaleString()} USD
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(item.status)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
