import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpRight, Download, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const exportToCSV = (invoices) => {
  const headers = ['Invoice #', 'Vendor', 'Buyer', 'Date', 'Due Date', 'Currency', 'Amount', 'Status', 'Score'];
  const rows = invoices.map(inv => [
    inv.invoice_number || '',
    inv.vendor_name || '',
    inv.buyer_name || '',
    inv.invoice_date || '',
    inv.due_date || '',
    inv.currency || '',
    inv.total_amount || '',
    inv.validation_status || '',
    inv.validation_report?.score || 0
  ]);
  
  const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoices_export_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const exportToJSON = (invoices) => {
  const data = invoices.map(({ id, created_date, updated_date, created_by, ...rest }) => rest);
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoices_export_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export default function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => base44.entities.Invoice.list('-created_date', 100),
  });

  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = statusFilter === "all" || inv.validation_status === statusFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      (inv.vendor_name && inv.vendor_name.toLowerCase().includes(searchLower)) ||
      (inv.invoice_number && inv.invoice_number.toLowerCase().includes(searchLower)) ||
      (inv.buyer_name && inv.buyer_name.toLowerCase().includes(searchLower));
    
    const invDate = new Date(inv.invoice_date);
    const matchesDate = (!dateRange.start || invDate >= new Date(dateRange.start)) && 
                        (!dateRange.end || invDate <= new Date(dateRange.end));

    return matchesStatus && matchesSearch && matchesDate;
  });

  const StatusBadge = ({ status }) => {
    const styles = {
      valid: "bg-green-100 text-green-700 hover:bg-green-100 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      warning: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
      invalid: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    };
    return (
      <Badge className={`${styles[status] || styles.warning} border uppercase text-xs shadow-none`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">All Invoices</h2>
      </div>

      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <CardTitle className="dark:text-white">Invoice List</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input 
                  placeholder="Search invoices..." 
                  className="pl-9 w-64 dark:bg-slate-900 dark:border-slate-600" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[40px] p-0 dark:border-slate-600">
                    <Calendar className="w-4 h-4 text-slate-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 space-y-4 dark:bg-slate-800" align="end">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none dark:text-white">Date Range</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Filter by invoice date</p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <label className="text-sm dark:text-slate-300">Start</label>
                      <Input 
                        type="date" 
                        className="col-span-2 dark:bg-slate-900 dark:border-slate-600"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <label className="text-sm dark:text-slate-300">End</label>
                      <Input 
                        type="date" 
                        className="col-span-2 dark:bg-slate-900 dark:border-slate-600"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 dark:bg-slate-900 dark:border-slate-600">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Filter className="w-4 h-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-800">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="valid">Valid</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="invalid">Invalid</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 dark:border-slate-600">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="dark:bg-slate-800">
                  <DropdownMenuItem onClick={() => exportToCSV(filteredInvoices)}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToJSON(filteredInvoices)}>
                    Export as JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-100 dark:border-slate-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 dark:bg-slate-900/50">
                  <TableHead className="dark:text-slate-300">Status</TableHead>
                  <TableHead className="dark:text-slate-300">Invoice #</TableHead>
                  <TableHead className="dark:text-slate-300">Vendor</TableHead>
                  <TableHead className="dark:text-slate-300">Buyer</TableHead>
                  <TableHead className="dark:text-slate-300">Date</TableHead>
                  <TableHead className="dark:text-slate-300">Amount</TableHead>
                  <TableHead className="dark:text-slate-300">Score</TableHead>
                  <TableHead className="text-right dark:text-slate-300">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 dark:text-slate-400">Loading...</TableCell>
                  </TableRow>
                ) : filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-slate-400">No invoices found</TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                      <TableCell>
                        <StatusBadge status={invoice.validation_status} />
                      </TableCell>
                      <TableCell className="font-medium dark:text-white">{invoice.invoice_number}</TableCell>
                      <TableCell className="dark:text-slate-300">{invoice.vendor_name}</TableCell>
                      <TableCell className="dark:text-slate-300">{invoice.buyer_name}</TableCell>
                      <TableCell className="dark:text-slate-300">{invoice.invoice_date}</TableCell>
                      <TableCell className="dark:text-slate-300">
                        {invoice.currency} {invoice.total_amount?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{invoice.validation_report?.score || 0}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ArrowUpRight className="w-4 h-4 text-slate-400" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}