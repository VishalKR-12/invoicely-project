import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Documentation() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">System Documentation</h2>
        <p className="text-slate-500 mt-2">Overview of the Invoice Extraction & Quality Control Service.</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabTrigger value="overview">Overview</TabTrigger>
          <TabTrigger value="schema">Schema Design</TabTrigger>
          <TabTrigger value="validation">Validation Rules</TabTrigger>
          <TabTrigger value="architecture">Architecture</TabTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="prose text-slate-600">
              <p>
                This application serves as a robust Invoice Extraction & Quality Control Service. 
                It automates the process of ingesting PDF invoices, extracting structured data using AI, 
                and running comprehensive validation rules to ensure data integrity.
              </p>
              <h4 className="font-semibold text-slate-900 mt-4">Key Features:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>PDF Extraction:</strong> Uses advanced AI models to parse PDF documents into structured JSON.</li>
                <li><strong>Automated Validation:</strong> Applies a rigorous set of rules to detect errors, missing fields, and anomalies.</li>
                <li><strong>Quality Scoring:</strong> Assigns a quality score (0-100) to each invoice based on the validation results.</li>
                <li><strong>Dashboard & Management:</strong> Provides a user-friendly interface to manage invoices and view analytics.</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Schema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SchemaField name="invoice_number" type="string" desc="Unique identifier of the invoice." />
                <SchemaField name="vendor_name" type="string" desc="Name of the service provider or seller." />
                <SchemaField name="buyer_name" type="string" desc="Name of the client or buyer." />
                <SchemaField name="invoice_date" type="date" desc="Date of issuance (YYYY-MM-DD)." />
                <SchemaField name="due_date" type="date" desc="Payment due date." />
                <SchemaField name="total_amount" type="number" desc="Final total amount to be paid." />
                <SchemaField name="currency" type="string" desc="3-letter currency code (e.g., USD)." />
                <SchemaField name="line_items" type="array" desc="List of individual items, qty, and prices." />
                <SchemaField name="validation_status" type="enum" desc="valid | invalid | warning" />
                <SchemaField name="validation_report" type="object" desc="JSON object containing error details and score." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="mt-6 space-y-6">
           <Card>
            <CardHeader>
              <CardTitle>Validation Logic</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ValidationRule 
                title="Completeness Checks" 
                rules={[
                  "Must have Invoice Number",
                  "Must have Vendor Name",
                  "Must have Invoice Date",
                  "Must have Total Amount"
                ]}
              />
              <ValidationRule 
                title="Format & Types" 
                rules={[
                  "Date must match YYYY-MM-DD format",
                  "Currency must be a valid 3-letter code",
                  "Numeric fields must be valid numbers"
                ]}
              />
              <ValidationRule 
                title="Business Logic" 
                rules={[
                  "Total Amount must be > 0",
                  "Due Date cannot be earlier than Invoice Date",
                  "Sum of Line Items must match Total Amount (with 1.0 tolerance)"
                ]}
              />
              <ValidationRule 
                title="Anomaly Detection" 
                rules={[
                  "Invoice Date year should be within reasonable range (past 5 years)",
                  "Duplicate Invoice Numbers (checked against database)"
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architecture" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Architecture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                The application is built on the <strong>Base44 Platform</strong>, leveraging a serverless architecture.
              </p>
              <div className="bg-slate-50 p-4 rounded-lg border">
                <pre className="text-sm overflow-x-auto">
{`[ Client / React App ]
       |
       v
[ Base44 SDK ]  ---->  [ Integration: AI Extraction ]
       |
       v
[ Database / Entities ]`}
                </pre>
              </div>
              <p>
                <strong>Frontend:</strong> React, Tailwind CSS, Shadcn UI.<br/>
                <strong>Backend:</strong> Base44 BaaS (Managed PostgreSQL, Auth, Integrations).<br/>
                <strong>AI/ML:</strong> Base44 Core Integrations for document understanding.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TabTrigger({ value, children }) {
  return (
    <TabsTrigger 
      value={value}
      className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none bg-transparent"
    >
      {children}
    </TabsTrigger>
  );
}

function SchemaField({ name, type, desc }) {
  return (
    <div className="p-3 bg-slate-50 rounded border border-slate-100">
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-mono text-sm font-bold text-slate-800">{name}</span>
        <span className="text-xs uppercase font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{type}</span>
      </div>
      <p className="text-sm text-slate-500 leading-tight">{desc}</p>
    </div>
  );
}

function ValidationRule({ title, rules }) {
  return (
    <div>
      <h4 className="font-semibold text-slate-900 mb-2">{title}</h4>
      <ul className="list-disc pl-5 space-y-1">
        {rules.map((rule, i) => (
          <li key={i} className="text-sm text-slate-600">{rule}</li>
        ))}
      </ul>
    </div>
  );
}