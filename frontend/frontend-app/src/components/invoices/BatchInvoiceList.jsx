import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, XCircle, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function BatchInvoiceList({ results, onSelect, onDelete }) {
  const StatusIcon = ({ status }) => {
    if (status === 'valid') return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === 'warning') return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-10"></TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Invoice #</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-center">Score</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((item, index) => (
            <TableRow key={index} className="hover:bg-slate-50/50">
              <TableCell>
                <StatusIcon status={item.validation_status} />
              </TableCell>
              <TableCell className="max-w-[150px] truncate" title={item.fileName}>
                {item.fileName}
              </TableCell>
              <TableCell className="font-medium">
                {item.invoice_number || <span className="text-slate-400 italic">Missing</span>}
              </TableCell>
              <TableCell>
                {item.vendor_name || <span className="text-slate-400 italic">Unknown</span>}
              </TableCell>
              <TableCell>
                {item.invoice_date || '-'}
              </TableCell>
              <TableCell className="text-right font-mono">
                {item.total_amount ? item.total_amount.toFixed(2) : '-'}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className={
                  item.validation_report?.score > 80 ? "text-green-600 border-green-200" :
                  item.validation_report?.score > 50 ? "text-yellow-600 border-yellow-200" :
                  "text-red-600 border-red-200"
                }>
                  {item.validation_report?.score || 0}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onSelect(index)}>
                    <Eye className="w-4 h-4 text-slate-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(index)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}