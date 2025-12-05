import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Upload, File, Loader2, ArrowRight, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { validateInvoice } from '@/components/invoices/validationUtils';
import { motion, AnimatePresence } from 'framer-motion';

export default function InvoiceUploader({ onProcessingComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, status: 'idle' });
  const { toast } = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processSingleFile = async (file) => {
    // 1. Upload File
    const uploadRes = await base44.integrations.Core.UploadFile({ file });
    const fileUrl = uploadRes.file_url;

    // 2. Extract Data
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
          description: "Extract all line items in the invoice table. Be precise with quantities and unit prices.",
          items: {
            type: "object",
            properties: {
              description: { type: "string", description: "Item name or description" },
              quantity: { type: "number", description: "Count of items" },
              unit_price: { type: "number", description: "Price per unit" },
              total: { type: "number", description: "Total price for this line item" },
              sku: { type: "string", description: "Product code/SKU if available" }
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

    // 3. Validate Data
    const validationResult = validateInvoice(extractedData);

    // 4. Merge and Return
    return {
      ...extractedData,
      fileName: file.name,
      file_url: fileUrl,
      validation_status: validationResult.status,
      validation_report: validationResult.report
    };
  };

  const processFiles = async (files) => {
    setIsProcessing(true);
    setProgress({ current: 0, total: files.length, status: 'starting' });
    
    const results = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress({ current: i + 1, total: files.length, status: `Processing ${file.name}...` });
      
      try {
        const result = await processSingleFile(file);
        results.push(result);
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        errors.push({ fileName: file.name, error: error.message });
        toast({
          variant: "destructive",
          title: "Error processing file",
          description: `Failed to process ${file.name}`,
        });
      }
    }

    setIsProcessing(false);
    setProgress({ current: 0, total: 0, status: 'idle' });
    
    if (results.length > 0) {
      onProcessingComplete(results);
      toast({
        title: "Batch Processing Complete",
        description: `Successfully processed ${results.length} invoice(s).`,
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) processFiles(files);
  };

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 border-2 border-dashed 
        ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-slate-50/50'}
        ${isProcessing ? 'pointer-events-none opacity-80' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
        <AnimatePresence mode="wait">
          {!isProcessing ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                <Upload className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload Invoice PDFs</h3>
              <p className="text-slate-500 max-w-sm mb-8">
                Drag and drop multiple invoices here, or click to browse. 
                Support for batch processing.
              </p>
              <label>
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer" asChild>
                  <span>
                    Select Files
                    <input type="file" className="hidden" multiple accept=".pdf,.png,.jpg" onChange={handleFileSelect} />
                  </span>
                </Button>
              </label>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full max-w-md"
            >
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-6" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Processing Batch...
              </h3>
              <p className="text-slate-500 mb-4">
                {progress.status} ({progress.current}/{progress.total})
              </p>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-500"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}