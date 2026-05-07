package com.example.taskmanager.service;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    public List<Task> getAllTasks() {
        return taskRepository.findAllOrderByCreatedAtDesc();
    }
    
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }
    
    public Task createTask(Task task) {
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }
    
    public Task updateTask(Long id, Task taskDetails) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setStatus(taskDetails.getStatus());
            task.setPriority(taskDetails.getPriority());
            task.setDueDate(taskDetails.getDueDate());
            task.setUpdatedAt(LocalDateTime.now());
            return taskRepository.save(task);
        }
        return null;
    }
    
    public boolean deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public List<Task> getTasksByStatus(String status) {
        return taskRepository.findByStatusOrderByCreatedAtDesc(status);
    }
    
    public List<Task> getTasksByPriority(String priority) {
        return taskRepository.findByPriorityOrderByCreatedAtDesc(priority);
    }
    
    public List<Task> searchTasks(String keyword) {
        return taskRepository.findByTitleOrDescriptionContaining(keyword);
    }
    
    // User-specific methods
    public List<Task> getTasksByUser(User user) {
        return taskRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    public List<Task> getUserTasksByStatus(User user, String status) {
        return taskRepository.findByUserAndStatusOrderByCreatedAtDesc(user, status);
    }
    
    public List<Task> getUserTasksByPriority(User user, String priority) {
        return taskRepository.findByUserAndPriorityOrderByCreatedAtDesc(user, priority);
    }
    
    public List<Task> searchUserTasks(User user, String keyword) {
        return taskRepository.findByUserAndTitleOrDescriptionContaining(user, keyword);
    }
}
