package com.example.taskmanager.controller;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.User;
import com.example.taskmanager.service.TaskService;
import com.example.taskmanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/dashboard")
public class DashboardController {
    
    @Autowired
    private TaskService taskService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public String dashboard(Model model) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return "redirect:/login";
        }
        
        List<Task> userTasks = taskService.getTasksByUser(currentUser);
        
        // Task statistics
        long todoCount = userTasks.stream().filter(t -> "TODO".equals(t.getStatus().toString())).count();
        long inProgressCount = userTasks.stream().filter(t -> "IN_PROGRESS".equals(t.getStatus().toString())).count();
        long doneCount = userTasks.stream().filter(t -> "DONE".equals(t.getStatus().toString())).count();
        
        model.addAttribute("user", currentUser);
        model.addAttribute("tasks", userTasks);
        model.addAttribute("newTask", new Task());
        model.addAttribute("todoCount", todoCount);
        model.addAttribute("inProgressCount", inProgressCount);
        model.addAttribute("doneCount", doneCount);
        model.addAttribute("totalTasks", userTasks.size());
        
        return "dashboard";
    }
    
    @PostMapping("/tasks")
    public String createTask(@ModelAttribute Task task, RedirectAttributes redirectAttributes) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return "redirect:/login";
        }
        
        try {
            task.setUser(currentUser);
            taskService.createTask(task);
            redirectAttributes.addFlashAttribute("successMessage", "Task created successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error creating task: " + e.getMessage());
        }
        return "redirect:/dashboard";
    }
    
    @GetMapping("/tasks/{id}/edit")
    public String editTaskForm(@PathVariable Long id, Model model) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return "redirect:/login";
        }
        
        Optional<Task> task = taskService.getTaskById(id);
        if (task.isPresent() && task.get().getUser().getId().equals(currentUser.getId())) {
            model.addAttribute("task", task.get());
            return "edit-task";
        }
        return "redirect:/dashboard";
    }
    
    @PostMapping("/tasks/{id}")
    public String updateTask(@PathVariable Long id, @ModelAttribute Task task, RedirectAttributes redirectAttributes) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return "redirect:/login";
        }
        
        try {
            // Verify task belongs to current user
            Optional<Task> existingTask = taskService.getTaskById(id);
            if (existingTask.isPresent() && existingTask.get().getUser().getId().equals(currentUser.getId())) {
                task.setUser(currentUser);
                Task updatedTask = taskService.updateTask(id, task);
                if (updatedTask != null) {
                    redirectAttributes.addFlashAttribute("successMessage", "Task updated successfully!");
                } else {
                    redirectAttributes.addFlashAttribute("errorMessage", "Task not found!");
                }
            } else {
                redirectAttributes.addFlashAttribute("errorMessage", "Unauthorized access!");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error updating task: " + e.getMessage());
        }
        return "redirect:/dashboard";
    }
    
    @PostMapping("/tasks/{id}/delete")
    public String deleteTask(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return "redirect:/login";
        }
        
        try {
            // Verify task belongs to current user
            Optional<Task> task = taskService.getTaskById(id);
            if (task.isPresent() && task.get().getUser().getId().equals(currentUser.getId())) {
                boolean deleted = taskService.deleteTask(id);
                if (deleted) {
                    redirectAttributes.addFlashAttribute("successMessage", "Task deleted successfully!");
                } else {
                    redirectAttributes.addFlashAttribute("errorMessage", "Task not found!");
                }
            } else {
                redirectAttributes.addFlashAttribute("errorMessage", "Unauthorized access!");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error deleting task: " + e.getMessage());
        }
        return "redirect:/dashboard";
    }
    
    @GetMapping("/search")
    public String searchTasks(@RequestParam String keyword, Model model) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return "redirect:/login";
        }
        
        List<Task> tasks = taskService.searchUserTasks(currentUser, keyword);
        model.addAttribute("user", currentUser);
        model.addAttribute("tasks", tasks);
        model.addAttribute("newTask", new Task());
        model.addAttribute("searchKeyword", keyword);
        
        return "dashboard";
    }
    
    @GetMapping("/filter")
    public String filterTasks(@RequestParam(required = false) String status, 
                             @RequestParam(required = false) String priority, 
                             Model model) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return "redirect:/login";
        }
        
        List<Task> tasks;
        if (status != null && !status.isEmpty()) {
            tasks = taskService.getUserTasksByStatus(currentUser, status);
        } else if (priority != null && !priority.isEmpty()) {
            tasks = taskService.getUserTasksByPriority(currentUser, priority);
        } else {
            tasks = taskService.getTasksByUser(currentUser);
        }
        
        model.addAttribute("user", currentUser);
        model.addAttribute("tasks", tasks);
        model.addAttribute("newTask", new Task());
        model.addAttribute("selectedStatus", status);
        model.addAttribute("selectedPriority", priority);
        
        return "dashboard";
    }
    
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            Optional<User> user = userService.findByUsername(auth.getName());
            return user.orElse(null);
        }
        return null;
    }
}
