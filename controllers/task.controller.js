import { TryCatch } from "../middlewares/error.js";
import { prisma } from "../utils/helper.js";


export const createTask = TryCatch(async (req, res) => {
    const { title, description, category, priority, dueDate } = req.body;
  
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        organizationId: true
      }
    });
  
    const task = await prisma.task.create({
      data: {
        title,
        description,
        category,
        priority,
        dueDate: new Date(dueDate),
        organizationId: user.organizationId
      }
    });
  
    return res.status(201).json({
      message: "Task Created",
      task,
      success: true
    });
  });

export const getAllTasks=TryCatch(async (req, res) => {

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      organizationId: true
    }
  });
  const tasks =await prisma.task.findMany({
    where:{
      organizationId: user.organizationId
    }
  })

  res.status(200).json({
    message:"Received all the tasks ",
    success:true,
    tasks
  })
})

export const getTaskById = TryCatch(async (req, res) => {
  const { id } = req.params;
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return res.status(404).json({ message: "Task not found",success:false });
  res.status(200).json({ task,message:"Task Found",success:true });
});

export const updateTask = TryCatch(async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate } = req.body;

  const updateData = {};
  
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (dueDate !== undefined) {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" ,success:false});
    }
    updateData.dueDate = parsedDate;
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No valid fields to update" ,success:false});
  }

  const updated = await prisma.task.update({
    where: { id },
    data: updateData,
  });

  res.status(200).json({ message: "Task updated", task: updated,success:true });
});

export const deleteTask = TryCatch(async (req, res) => {
  const { id } = req.params;
  await prisma.task.delete({ where: { id } });
  res.status(200).json({ message: "Task deleted" ,succcess:true});
});

export const assignTask = TryCatch(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const task = await prisma.task.update({
    where: { id },
    data: { assignedToId: userId },
  });
  res.status(200).json({ message: "Task assigned", task, success:true });
});

export const pickTask = TryCatch(async (req, res) => {
  const pendingTasks = await prisma.task.findFirst({
    where: { assignedToId: req.user.id, status: { not: "COMPLETED" } },
  });
  if (pendingTasks) return res.status(400).json({ message: "You already have a pending task" });
  const { id } = req.params;
  const task = await prisma.task.update({
    where: { id },
    data: { assignedToId: req.user.id },
  });
  res.status(200).json({ message: "Task picked", task });
});


export const completeTask = TryCatch(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; 
  const task = await prisma.task.findUnique({
    where: { id },
    select: {
      assignedToId: true,
      status: true
    }
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" ,sucess:false });
  }

 
  if (task.assignedToId !== userId) {
    return res.status(403).json({ 
      message: "Only the assigned user can complete this task",
      sucess:false 
    });
  }

 
  if (task.status === "COMPLETED") {
    return res.status(400).json({ 
      message: "Task is already completed" ,
      sucess:false 
    });
  }

  
  const updatedTask = await prisma.task.update({
    where: { id },
    data: { 
      status: "COMPLETED"
    },
  });

  res.status(200).json({ 
    message: "Task marked as completed", 
    task: updatedTask ,
    sucess:true 
  });
});