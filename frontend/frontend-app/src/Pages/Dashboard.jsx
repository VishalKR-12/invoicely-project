import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpRight, FileText, AlertTriangle, CheckCircle, XCircle, Sparkles, Calendar, Download, Play, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AIInsights from "@/components/dashboard/AIInsights";

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

export default function Dashboard() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showInsights, setShowInsights] = useState(false);
  
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

  const stats = {
    total: invoices.length,
    valid: invoices.filter(i => i.validation_status === 'valid').length,
    warning: invoices.filter(i => i.validation_status === 'warning').length,
    invalid: invoices.filter(i => i.validation_status === 'invalid').length,
  };

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
    <div className="space-y-8">
      {/* Hero Section - Matching Docsumo Design */}
      <div className="bg-[#FDF8F3] dark:bg-slate-800 rounded-none -mx-8 -mt-8 px-8 py-12 md:py-16 mb-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
              Automate data<br />
              extraction from your<br />
              invoices with <span className="text-slate-900 dark:text-white">95%+</span><br />
              <span className="text-slate-900 dark:text-white">accuracy</span>
            </h1>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-slate-400 dark:border-slate-500 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm">Varying templates of invoices processed in seconds.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-slate-400 dark:border-slate-500 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm">Get your extracted data across two levels of accuracy checks - automated validations and manual reviews for unsure extractions.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-slate-400 dark:border-slate-500 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm">Save as much as 80% on costs and manual review time with our self-learning AI.</p>
              </div>
            </div>

            <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-lg mt-4">
              <Link to="/upload">Get Started</Link>
            </Button>
          </div>

          <div className="relative hidden md:flex justify-center items-center">
            {/* Main card with invoice preview */}
            <div className="relative">
              {/* Background decorative elements */}
              <div className="absolute -top-4 -right-4 w-48 h-32 bg-[#F5EBE0] dark:bg-slate-700 rounded-lg"></div>
              <div className="absolute top-8 -right-8 w-40 h-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 p-3">
                <div className="text-xs text-slate-400 mb-2">DOCSUMO</div>
                <div className="space-y-2">
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded w-full"></div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
              
              {/* Main orange card */}
              <div className="relative bg-[#F5A855] dark:bg-orange-600 rounded-xl p-8 shadow-xl z-10 w-72">
                <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  Invoice<br />Extraction
                </h3>
                <p className="text-white/90 mt-3 text-sm">Using Document AI</p>
                
                {/* Play button */}
                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
                  <div className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Bottom decorative invoice */}
              <div className="absolute -bottom-6 -left-6 w-44 h-32 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 p-3 z-0">
                <div className="text-[10px] text-slate-400 mb-1">TAX INVOICE</div>
                <div className="space-y-1.5">
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded w-full"></div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded w-2/3"></div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded w-4/5"></div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h2>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className={`gap-2 ${showInsights ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400' : ''}`}
            onClick={() => setShowInsights(!showInsights)}
          >
            <Sparkles className="w-4 h-4" />
            AI Insights
          </Button>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
            <Link to="/upload">Process New Invoice</Link>
          </Button>
        </div>
      </div>

      {showInsights && (
        <AIInsights invoices={filteredInvoices} />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Processed" value={stats.total} icon={FileText} color="text-slate-600 dark:text-slate-400" bg="bg-slate-100 dark:bg-slate-800" />
        <StatCard title="Valid Invoices" value={stats.valid} icon={CheckCircle} color="text-green-600 dark:text-green-400" bg="bg-green-100 dark:bg-green-900/30" />
        <StatCard title="Warnings" value={stats.warning} icon={AlertTriangle} color="text-yellow-600 dark:text-yellow-400" bg="bg-yellow-100 dark:bg-yellow-900/30" />
        <StatCard title="Critical Errors" value={stats.invalid} icon={XCircle} color="text-red-600 dark:text-red-400" bg="bg-red-100 dark:bg-red-900/30" />
      </div>

      {/* Recent Invoices Table */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <CardTitle className="dark:text-white">Recent Invoices</CardTitle>
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
                  <TableHead className="dark:text-slate-300">Date</TableHead>
                  <TableHead className="dark:text-slate-300">Amount</TableHead>
                  <TableHead className="dark:text-slate-300">Score</TableHead>
                  <TableHead className="text-right dark:text-slate-300">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 dark:text-slate-400">Loading...</TableCell>
                  </TableRow>
                ) : filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-slate-400">No invoices found</TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                      <TableCell>
                        <StatusBadge status={invoice.validation_status} />
                      </TableCell>
                      <TableCell className="font-medium dark:text-white">{invoice.invoice_number}</TableCell>
                      <TableCell className="dark:text-slate-300">{invoice.vendor_name}</TableCell>
                      <TableCell className="dark:text-slate-300">{invoice.invoice_date}</TableCell>
                      <TableCell className="dark:text-slate-300">
                        {invoice.currency} {invoice.total_amount?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{invoice.validation_report?.score || 0}</span>
                        </div>
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

function StatCard({ title, value, icon: Icon, color, bg }) {
  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${bg}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );
}