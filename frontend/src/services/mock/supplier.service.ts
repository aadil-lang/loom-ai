import fs from 'fs';
import path from 'path';

const getFilePath = (fileName: string) => path.join(process.cwd(), 'src', 'mocks', fileName);

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function getSuppliers(): Promise<any[]> {
  const data = fs.readFileSync(getFilePath('suppliers.json'), 'utf8');
  return JSON.parse(data);
}

export async function getSupplierById(id: string): Promise<any | null> {
  const suppliers = await getSuppliers();
  return suppliers.find(s => s.id === id) || null;
}
