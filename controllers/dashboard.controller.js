import { TaskStatus } from "@prisma/client";
import { TryCatch } from "../middlewares/error.js";
import { prisma } from "../utils/helper.js";


export const getOrgDashboardSummary = TryCatch(async (req, res) => {
  const organizationId = req.user.organizationId;

  const [totalTasks, completed, expired] = await Promise.all([
    prisma.task.count({ where: { organizationId } }),
    prisma.task.count({ where: { organizationId, status: TaskStatus.COMPLETED } }),
    prisma.task.count({ where: { organizationId, status: TaskStatus.EXPIRED } }),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalTasks,
      completed,
      expired,
    },
  });
});

export const getMemberTaskSummary = TryCatch(async (req, res) => {
  const userId = req.user.id;

  const tasks = await prisma.task.findMany({
    where: { assignedToId: userId },
    select: {
      id: true,
      title: true,
      status: true,
      dueDate: true,
      priority: true,
    },
    orderBy: { dueDate: "asc" },
  });

  const statusCount = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    tasks,
    statusCount,
  });
});
