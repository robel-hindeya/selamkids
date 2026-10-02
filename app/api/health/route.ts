import { apiSuccess } from '@/backend/utils/response';

export async function GET() {
  return apiSuccess({
    status: 'HEALTHY',
    service: 'Selam Kids - Night Zookeeper Edition',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
