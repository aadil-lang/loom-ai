import fs from 'fs';
import path from 'path';

const getFilePath = (fileName: string) => path.join(process.cwd(), 'src', 'mocks', fileName);

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function getNotifications(): Promise<any[]> {
  const data = fs.readFileSync(getFilePath('notifications.json'), 'utf8');
  return JSON.parse(data);
}

export async function getNotificationsBySupplier(supplierId: string): Promise<any[]> {
  const notifications = await getNotifications();
  return notifications.filter(n => n.supplierId === supplierId);
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  return Promise.resolve(true);
}
