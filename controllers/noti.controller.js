import { TryCatch } from "../middlewares/error.js";
import { prisma } from "../utils/helper.js";
import { TaskStatus } from "@prisma/client";

export const getUserNotifications = TryCatch(async (req, res) => {
  const userId = req.user.id;

  const now = new Date();

  const overdueTasks = await prisma.task.findMany({
    where: {
      assignedToId: userId,
      status: { not: TaskStatus.COMPLETED },
      dueDate: { lt: now },
    },
    select: {
      id: true,
      title: true,
      dueDate: true,
      priority: true,
      status: true,
    },
    orderBy: {
      dueDate: "asc",
    },
  });

  res.status(200).json({
    success: true,
    overdueTasks,
  });
});
