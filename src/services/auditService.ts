import { mockStore } from "./mockStore";
import type { AuditLog } from "../types/audit";

export const auditService = {
  async getAuditLogs(entity?: string, action?: string): Promise<AuditLog[]> {
    await new Promise((r) => setTimeout(r, 100));
    let list = [...mockStore.auditLogs];
    if (entity && entity !== "ALL") {
      list = list.filter((l) => l.entity === entity);
    }
    if (action && action !== "ALL") {
      list = list.filter((l) => l.action.includes(action));
    }
    return list;
  },
};
