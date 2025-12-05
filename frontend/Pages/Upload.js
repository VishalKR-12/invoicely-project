import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, RefreshCw, Upload, Loader2, Download, FileText, CheckCircle, AlertTriangle,  Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { validateInvoice } from '@/components/invoices/validationUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import ValidationReport from "@/components/invoices/ValidationReport";

export default function UploadPage() {
  const [processedResults, setProcessedResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [viewMode, setViewMode] = useState('refined');
  const { toast } = useToast();
  const navigate = useNavigate();

  const createInvoicesMutation = useMutation({
    mutationFn: (data) => base44.entities.Invoice.bulkCreate(data),
    onSuccess: (data) => {
      toast({ title: "Batch Saved", description: `Successfully saved ${data.length} invoices.` });
      navigate('/invoices');
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  });

  const getFileExtension = (file) => {
    const name = file.name.toLowerCase();
    if (name.endsWith('.pdf')) return 'pdf';
    if (name.endsWith('.png')) return 'png';
    if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'jpg';
    if (name.endsWith('.docx')) return 'docx';
    if (name.endsWith('.doc')) return 'doc';
    
    // Fallback to mime type
    const mimeType = file.type;
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType === 'image/png') return 'png';
    if (mimeType === 'image/jpeg') return 'jpg';
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx';
    if (mimeType === 'application/msword') return 'doc';
    
    return 'unknown';
  };

  const processSingleFile = async (file) => {
    const fileExtension = getFileExtension(file);
    const uploadRes = await base44.integrations.Core.UploadFile({ file });
    const fileUrl = uploadRes.file_url;

    const extractionSchema = {
      type: "object",
      properties: {
        invoice_number: { type: "string" },
        vendor_name: { type: "string" },
        buyer_name: { type: "string" },
        invoice_date: { type: "string", description: "YYYY-MM-DD" },
        due_date: { type: "string", description: "YYYY-MM-DD" },
        currency: { type: "string" },
        total_amount: { type: "number" },
        line_items: {
          type: "array",
          description: "Extract all line items in the invoice table.",
          items: {
            type: "object",
            properties: {
              description: { type: "string" },
              quantity: { type: "number" },
              unit_price: { type: "number" },
              total: { type: "number" }
            }
          }
        }
      }
    };

    const extractRes = await base44.integrations.Core.ExtractDataFromUploadedFile({
      file_url: fileUrl,
      json_schema: extractionSchema
    });

    if (extractRes.status !== 'success') throw new Error("Failed to extract data");
    
    const extractedData = extractRes.output;
    const validationResult = validateInvoice(extractedData);

    return {
      ...extractedData,
      fileName: file.name,
      fileType: fileExtension,
      file_url: fileUrl,
      validation_status: validationResult.status,
      validation_report: validationResult.report
    };
  };

  const processFiles = async (files) => {
    setIsProcessing(true);
    setProgress({ current: 0, total: files.length });
    setUploadedFiles(files.map(f => ({ name: f.name, file: f })));
    
    const results = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress({ current: i + 1, total: files.length });
      
      try {
        const result = await processSingleFile(file);
        results.push(result);
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        toast({
          variant: "destructive",
          title: "Error processing file",
          description: `Failed to process ${file.name}`,
        });
      }
    }

    setIsProcessing(false);
    
    if (results.length > 0) {
      setProcessedResults(results);
      setSelectedIndex(0);
      setPreviewUrl(results[0].file_url);
      toast({
        title: "Processing Complete",
        description: `Successfully processed ${results.length} invoice(s).`,
      });
    }
  };

  const handleFileSelect = (e) => {
    if (isProcessing) return;
    if (e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleBatchSave = () => {
    if (!processedResults.length || createInvoicesMutation.isPending) {
      toast({
        variant: "destructive",
        title: "Nothing to save",
        description: "Process at least one invoice before saving."
      });
      return;
    }
    const toSave = processedResults.map(({ fileName, ...rest }) => rest);
    createInvoicesMutation.mutate(toSave);
  };

  const exportData = (format) => {
    if (!selectedData) {
      toast({ variant: "destructive", title: "No data selected", description: "Choose an invoice first." });
      return;
    }
    
    const data = { ...selectedData };
    delete data.fileName;
    
    if (format === 'json') {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice_${selectedData.invoice_number || 'extracted'}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = Object.keys(data).filter(k => k !== 'line_items' && k !== 'validation_report');
      const values = headers.map(h => data[h] || '');
      let csvContent = headers.join(',') + '\n' + values.map(v => `"${v}"`).join(',');
      
      if (data.line_items?.length) {
        csvContent += '\n\nLine Items\n';
        csvContent += 'Description,Quantity,Unit Price,Total\n';
        data.line_items.forEach(item => {
          csvContent += `"${item.description}",${item.quantity},${item.unit_price},${item.total}\n`;
        });
      }
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice_${selectedData.invoice_number || 'extracted'}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const selectedData = selectedIndex !== null ? processedResults[selectedIndex] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Test-drive Document AI
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Upload your own set of documents or use our samples to see how our data extraction works.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          [Supports up to 5 pages & 35MB]
        </p>
      </div>

      {/* Main Content */}
      {!processedResults.length && !isProcessing ? (
        <Card className="max-w-2xl mx-auto border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <CardContent className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6">
              <Upload className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Upload Invoice PDFs</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
              Drag and drop files here, or click to browse. 
              Supports PDF, DOCX, PNG, and JPG formats.
            </p>
            <label className="cursor-pointer">
              <div className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md font-medium transition-colors">
                <Upload className="w-5 h-5" />
                UPLOAD NOW
              </div>
              <input type="file" className="hidden" multiple accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" onChange={handleFileSelect} />
            </label>
          </CardContent>
        </Card>
      ) : isProcessing ? (
        <Card className="max-w-2xl mx-auto dark:bg-slate-800">
          <CardContent className="p-16 flex flex-col items-center justify-center text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 border-4 border-indigo-100 dark:border-indigo-900 rounded-full"></div>
              <div className="absolute inset-0 w-24 h-24 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Document AI wizardry in progress
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Processing {progress.current} of {progress.total} files...
            </p>
            <div className="w-full max-w-xs mt-4 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Document Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="cursor-pointer">
                <div className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  <Upload className="w-4 h-4" />
                  UPLOAD NOW
                </div>
                <input type="file" className="hidden" multiple accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" onChange={handleFileSelect} />
              </label>
            </div>
            
            <Card className="overflow-hidden dark:bg-slate-800 dark:border-slate-700">
              <div className="bg-slate-100 dark:bg-slate-900 p-2 flex items-center justify-between border-b dark:border-slate-700">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedData?.fileName || 'Document Preview'}
                </span>
                <span className="text-xs text-slate-400">
                  Page 1 of 1
                </span>
              </div>
              <div className="h-[500px] bg-white dark:bg-slate-900 flex items-center justify-center">
                {previewUrl ? (
                  selectedData?.fileType === 'pdf' ? (
                    <iframe 
                      src={previewUrl + '#toolbar=1'} 
                      className="w-full h-full border-0"
                      title="Document Preview"
                    />
                  ) : selectedData?.fileType === 'docx' || selectedData?.fileType === 'doc' ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-slate-500">
                      <FileText className="w-16 h-16" />
                      <span className="text-sm">Word document preview not available</span>
                      <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm">
                        Download to view
                      </a>
                    </div>
                  ) : (
                    <img 
                      src={previewUrl} 
                      alt="Document Preview" 
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="text-slate-400 flex flex-col items-center gap-2"><span>Image failed to load</span></div>';
                      }}
                    />
                  )
                ) : (
                  <div className="text-slate-400 flex flex-col items-center gap-2">
                    <Eye className="w-12 h-12" />
                    <span>Select a document to preview</span>
                  </div>
                )}
              </div>
            </Card>

            {/* File List */}
            {processedResults.length > 1 && (
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {processedResults.map((result, index) => (
                    <div 
                      key={index}
                      onClick={() => {
                        setSelectedIndex(index);
                        setPreviewUrl(result.file_url);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-colors
                        ${selectedIndex === index 
                          ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-700' 
                          : 'bg-white border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                          {result.fileName}
                        </span>
                      </div>
                      {result.validation_status === 'valid' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Right: Extracted Data */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Tabs value={viewMode} onValueChange={setViewMode}>
                <TabsList className="dark:bg-slate-800">
                  <TabsTrigger value="refined" className="dark:data-[state=active]:bg-slate-700">Refined view</TabsTrigger>
                  <TabsTrigger value="json" className="dark:data-[state=active]:bg-slate-700">JSON view</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => exportData('csv')} 
                  disabled={!selectedData}
                  className="gap-2 dark:border-slate-600"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => exportData('json')} 
                  disabled={!selectedData}
                  className="gap-2 dark:border-slate-600"
                >
                  <Download className="w-4 h-4" />
                  Download JSON
                </Button>
              </div>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-0">
                {viewMode === 'refined' ? (
                  <div className="divide-y dark:divide-slate-700">
                    {/* Status Header */}
                    <div className="p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Validation Status</span>
                      <Badge className={
                        selectedData?.validation_status === 'valid' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }>
                        Score: {selectedData?.validation_report?.score || 0}
                      </Badge>
                    </div>

                    {/* Fields */}
                    <div className="p-4 space-y-4">
                      <DataField label="Invoice Number" value={selectedData?.invoice_number} />
                      <DataField label="Vendor Name" value={selectedData?.vendor_name} />
                      <DataField label="Buyer Name" value={selectedData?.buyer_name} />
                      <DataField label="Invoice Date" value={selectedData?.invoice_date} />
                      <DataField label="Due Date" value={selectedData?.due_date} />
                      <DataField label="Currency" value={selectedData?.currency} />
                      <DataField label="Total Amount" value={selectedData?.total_amount?.toLocaleString()} />
                    </div>

                    {/* Line Items */}
                    {selectedData?.line_items?.length > 0 && (
                      <div className="p-4">
                        <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Line Items</h4>
                        <div className="border rounded-md overflow-hidden dark:border-slate-700">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-slate-50 dark:bg-slate-900">
                                <TableHead className="dark:text-slate-400">Description</TableHead>
                                <TableHead className="text-right dark:text-slate-400">Qty</TableHead>
                                <TableHead className="text-right dark:text-slate-400">Price</TableHead>
                                <TableHead className="text-right dark:text-slate-400">Total</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedData.line_items.map((item, i) => (
                                <TableRow key={i} className="dark:border-slate-700">
                                  <TableCell className="dark:text-slate-300">{item.description}</TableCell>
                                  <TableCell className="text-right dark:text-slate-300">{item.quantity}</TableCell>
                                  <TableCell className="text-right dark:text-slate-300">{item.unit_price}</TableCell>
                                  <TableCell className="text-right font-medium dark:text-white">{item.total}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}

                    {/* Validation Report */}
                    {selectedData?.validation_report && (
                      <div className="p-4">
                        <ValidationReport 
                          report={selectedData.validation_report} 
                          status={selectedData.validation_status} 
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <pre className="p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {JSON.stringify(selectedData, null, 2)}
                    </pre>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => { setProcessedResults([]); setPreviewUrl(null); }} className="dark:border-slate-600">
                <RefreshCw className="w-4 h-4 mr-2" /> Start Over
              </Button>
              <Button 
                onClick={handleBatchSave} 
                disabled={!processedResults.length || createInvoicesMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {createInvoicesMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save All ({processedResults.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DataField({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-900 dark:text-white">
        {value || <span className="text-slate-400 italic">Not found</span>}
      </span>
    </div>
  );
}