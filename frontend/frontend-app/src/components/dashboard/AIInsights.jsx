import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, PieChart, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AIInsights({ invoices }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    try {
      // Prepare summary data for LLM to avoid token limits
      const summaryData = invoices.map(inv => ({
        vendor: inv.vendor_name,
        date: inv.invoice_date,
        amount: inv.total_amount,
        currency: inv.currency,
        status: inv.validation_status
      }));

      const prompt = `
        Analyze these invoice records and provide business insights.
        Data: ${JSON.stringify(summaryData)}
        
        Provide a JSON response with the following structure:
        {
          "trends": ["trend 1", "trend 2"],
          "top_spending_category": "category name",
          "anomalies": ["potential anomaly 1"],
          "savings_opportunity": "suggestion"
        }
        Focus on spending trends, vendor concentration, and potential issues.
      `;

      const res = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            trends: { type: "array", items: { type: "string" } },
            top_spending_category: { type: "string" },
            anomalies: { type: "array", items: { type: "string" } },
            savings_opportunity: { type: "string" }
          }
        }
      });

      if (typeof res === 'string') {
          setInsights(JSON.parse(res));
      } else {
          setInsights(res);
      }
    } catch (error) {
      console.error("Failed to generate insights:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100 mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-indigo-900">AI Financial Insights</CardTitle>
              <p className="text-sm text-indigo-600/80">Analyze spending patterns and detect anomalies</p>
            </div>
          </div>
          {!insights && (
            <Button 
              onClick={generateInsights} 
              disabled={loading || invoices.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Generate Analysis
            </Button>
          )}
        </div>
      </CardHeader>
      {insights && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-semibold text-slate-800">
                <TrendingUp className="w-4 h-4 text-blue-500" /> Key Trends
              </h4>
              <ul className="space-y-2">
                {insights.trends?.map((trend, i) => (
                  <li key={i} className="text-sm text-slate-600 bg-white/50 p-2 rounded border border-slate-100">
                    {trend}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-semibold text-slate-800">
                <AlertCircle className="w-4 h-4 text-orange-500" /> Anomalies & Alerts
              </h4>
              <ul className="space-y-2">
                {insights.anomalies?.map((item, i) => (
                  <li key={i} className="text-sm text-slate-600 bg-white/50 p-2 rounded border border-slate-100">
                    {item}
                  </li>
                ))}
                {(!insights.anomalies || insights.anomalies.length === 0) && (
                   <li className="text-sm text-slate-400 italic">No anomalies detected.</li>
                )}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-semibold text-slate-800">
                <PieChart className="w-4 h-4 text-green-500" /> Summary
              </h4>
              <div className="space-y-3">
                <div className="bg-white/50 p-3 rounded border border-slate-100">
                  <span className="text-xs font-medium text-slate-500 uppercase">Top Spending</span>
                  <p className="font-bold text-slate-800">{insights.top_spending_category}</p>
                </div>
                <div className="bg-white/50 p-3 rounded border border-slate-100">
                  <span className="text-xs font-medium text-slate-500 uppercase">Opportunity</span>
                  <p className="text-sm text-slate-700">{insights.savings_opportunity}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => setInsights(null)} className="text-slate-400">
              Clear Analysis
            </Button>
            <Button variant="outline" size="sm" onClick={generateInsights} className="ml-2">
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          </div>
        </CardContent>
      )}
      
      {!insights && !loading && invoices.length > 0 && (
        <CardContent>
            <div className="text-center py-4 text-slate-400 text-sm">
                Click generate to analyze {invoices.length} invoices currently in view.
            </div>
        </CardContent>
      )}
    </Card>
  );
}

// RefreshCw already imported above