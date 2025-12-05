// Simple stub client so the UI can run without backend connectivity.
// Replace these implementations with real Base44 SDK calls.

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockInvoices = [];

export const base44 = {
  entities: {
    Invoice: {
      list: async (_sort = "-created_date", limit = 100) => {
        await delay(300);
        return mockInvoices.slice(0, limit);
      },
      bulkCreate: async (payload) => {
        await delay(300);
        payload.forEach((p, idx) =>
          mockInvoices.push({ id: `${Date.now()}-${idx}`, created_date: new Date().toISOString(), ...p })
        );
        return payload;
      },
    },
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        await delay(300);
        // In a real app this would be an upload endpoint returning a file URL.
        const fakeUrl = URL.createObjectURL(file);
        return { file_url: fakeUrl };
      },
      ExtractDataFromUploadedFile: async ({ file_url, json_schema }) => {
        await delay(800);
        // Return a mocked extraction honoring the schema shape.
        const output = {
          invoice_number: "INV-" + Math.floor(Math.random() * 10000),
          vendor_name: "Demo Vendor",
          buyer_name: "Demo Buyer",
          invoice_date: "2024-01-15",
          due_date: "2024-02-15",
          currency: "USD",
          total_amount: 1234.56,
          line_items: [
            { description: "Sample Item", quantity: 2, unit_price: 500, total: 1000 },
            { description: "Tax", quantity: 1, unit_price: 234.56, total: 234.56 },
          ],
        };
        return { status: "success", output };
      },
      InvokeLLM: async ({ prompt }) => {
        await delay(500);
        return {
          trends: ["Spending up 12% MoM", "Top vendor concentration at 40%"],
          top_spending_category: "Cloud Services",
          anomalies: ["Invoice INV-1001 flagged for outlier amount"],
          savings_opportunity: "Negotiate volume discounts with top 2 vendors.",
        };
      },
    },
  },
};

