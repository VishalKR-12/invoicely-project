import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ValidationReport({ report, status }) {
  if (!report) return null;

  const { errors = [], warnings = [], score = 100 } = report;

  const StatusIcon = {
    valid: CheckCircle,
    invalid: XCircle,
    warning: AlertTriangle
  }[status] || FileText;

  const statusColor = {
    valid: "text-green-600",
    invalid: "text-red-600",
    warning: "text-yellow-600"
  }[status] || "text-gray-600";

  const progressColor = score > 80 ? "bg-green-600" : score > 50 ? "bg-yellow-500" : "bg-red-600";

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Quality Control Report</CardTitle>
          <Badge variant={status === 'valid' ? 'default' : status === 'invalid' ? 'destructive' : 'secondary'} className="uppercase tracking-wider">
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <StatusIcon className={`w-10 h-10 ${statusColor}`} />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-slate-500">Quality Score</span>
              <span className="text-sm font-bold text-slate-700">{score}/100</span>
            </div>
            <Progress value={score} className="h-2" indicatorClassName={progressColor} />
          </div>
        </div>

        <div className="space-y-4">
          {errors.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Critical Errors ({errors.length})
              </h4>
              <ul className="space-y-2">
                {errors.map((err, i) => (
                  <li key={i} className="text-sm text-slate-600 bg-red-50 p-2 rounded-md border border-red-100">
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {warnings.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-yellow-600 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Warnings ({warnings.length})
              </h4>
              <ul className="space-y-2">
                {warnings.map((warn, i) => (
                  <li key={i} className="text-sm text-slate-600 bg-yellow-50 p-2 rounded-md border border-yellow-100">
                    {warn}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {errors.length === 0 && warnings.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No issues detected.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}