/**
 * Invoice Validation Logic
 * Implements comprehensive rules for completeness, format, business logic, and anomalies.
 */

export const validateInvoice = (data) => {
  const errors = [];
  const warnings = [];
  
  // 1. Completeness Rules
  if (!data.invoice_number) errors.push("Missing Invoice Number");
  if (!data.vendor_name) errors.push("Missing Vendor Name");
  if (!data.invoice_date) errors.push("Missing Invoice Date");
  if (data.total_amount === undefined || data.total_amount === null) errors.push("Missing Total Amount");

  // 2. Format & Type Rules
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (data.invoice_date && !dateRegex.test(data.invoice_date)) {
    errors.push("Invalid Invoice Date format (expected YYYY-MM-DD)");
  }
  
  if (data.currency && data.currency.length !== 3) {
    warnings.push(`Suspicious currency code: ${data.currency}`);
  }

  // 3. Business Logic Rules
  if (data.total_amount !== undefined && data.total_amount <= 0) {
    errors.push("Total amount must be greater than zero");
  }

  if (data.invoice_date && data.due_date) {
    if (new Date(data.due_date) < new Date(data.invoice_date)) {
      errors.push("Due Date cannot be earlier than Invoice Date");
    }
  }

  // Line Item Validation (if present)
  if (data.line_items && Array.isArray(data.line_items) && data.line_items.length > 0) {
    let calculatedTotal = 0;
    data.line_items.forEach((item, index) => {
      if (!item.description) warnings.push(`Line item ${index + 1} missing description`);
      if (item.quantity && item.unit_price) {
        const itemTotal = item.quantity * item.unit_price;
        // Allow small float rounding differences (0.01)
        if (item.total && Math.abs(itemTotal - item.total) > 0.05) {
          warnings.push(`Line item ${index + 1} math mismatch: ${item.quantity} * ${item.unit_price} != ${item.total}`);
        }
        calculatedTotal += (item.total || itemTotal);
      }
    });

    // Cross-check total
    if (data.total_amount && Math.abs(calculatedTotal - data.total_amount) > 1.0) {
        warnings.push(`Sum of line items (${calculatedTotal.toFixed(2)}) does not match Total Amount (${data.total_amount})`);
    }
  } else {
      warnings.push("No line items extracted");
  }

  // 4. Anomaly Detection (Simple)
  const currentYear = new Date().getFullYear();
  if (data.invoice_date) {
    const invoiceYear = new Date(data.invoice_date).getFullYear();
    if (invoiceYear < currentYear - 5 || invoiceYear > currentYear + 1) {
        warnings.push(`Invoice date year (${invoiceYear}) seems unusual`);
    }
  }

  // Determine Status
  let status = 'valid';
  if (errors.length > 0) status = 'invalid';
  else if (warnings.length > 0) status = 'warning';

  // Calculate a simple quality score (0-100)
  let score = 100;
  score -= (errors.length * 20);
  score -= (warnings.length * 5);
  score = Math.max(0, score);

  return {
    status,
    report: {
      errors,
      warnings,
      score
    }
  };
};