package com.example.taskmanager.repository;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByStatusOrderByCreatedAtDesc(String status);
    
    List<Task> findByPriorityOrderByCreatedAtDesc(String priority);
    
    @Query("SELECT t FROM Task t ORDER BY t.createdAt DESC")
    List<Task> findAllOrderByCreatedAtDesc();
    
    @Query("SELECT t FROM Task t WHERE t.title LIKE %?1% OR t.description LIKE %?1%")
    List<Task> findByTitleOrDescriptionContaining(String keyword);
    
    // User-specific queries
    List<Task> findByUserOrderByCreatedAtDesc(User user);
    
    List<Task> findByUserAndStatusOrderByCreatedAtDesc(User user, String status);
    
    List<Task> findByUserAndPriorityOrderByCreatedAtDesc(User user, String priority);
    
    @Query("SELECT t FROM Task t WHERE t.user = ?1 AND (t.title LIKE %?2% OR t.description LIKE %?2%)")
    List<Task> findByUserAndTitleOrDescriptionContaining(User user, String keyword);
}
