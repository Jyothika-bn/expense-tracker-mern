package com.example.taskmanager.controller;

import com.example.taskmanager.model.User;
import com.example.taskmanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Optional;

@Controller
@RequestMapping("/profile")
public class ProfileController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public String profilePage(Model model) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return "redirect:/login";
        }
        
        model.addAttribute("user", currentUser);
        return "profile";
    }
    
    @PostMapping("/update")
    public String updateProfile(@RequestParam String firstName,
                               @RequestParam String lastName,
                               @RequestParam String email,
                               RedirectAttributes redirectAttributes) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return "redirect:/login";
        }
        
        try {
            userService.updateProfile(currentUser.getId(), firstName, lastName, email);
            redirectAttributes.addFlashAttribute("successMessage", "Profile updated successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        
        return "redirect:/profile";
    }
    
    @PostMapping("/change-password")
    public String changePassword(@RequestParam String currentPassword,
                                @RequestParam String newPassword,
                                @RequestParam String confirmPassword,
                                RedirectAttributes redirectAttributes) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return "redirect:/login";
        }
        
        // Check if new passwords match
        if (!newPassword.equals(confirmPassword)) {
            redirectAttributes.addFlashAttribute("errorMessage", "New passwords do not match!");
            return "redirect:/profile";
        }
        
        // Check password length
        if (newPassword.length() < 6) {
            redirectAttributes.addFlashAttribute("errorMessage", "Password must be at least 6 characters long!");
            return "redirect:/profile";
        }
        
        try {
            boolean success = userService.changePassword(currentUser.getId(), currentPassword, newPassword);
            if (success) {
                redirectAttributes.addFlashAttribute("successMessage", "Password changed successfully!");
            } else {
                redirectAttributes.addFlashAttribute("errorMessage", "Current password is incorrect!");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error changing password: " + e.getMessage());
        }
        
        return "redirect:/profile";
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
