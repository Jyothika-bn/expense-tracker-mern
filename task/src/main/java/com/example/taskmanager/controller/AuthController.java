package com.example.taskmanager.controller;

import com.example.taskmanager.model.User;
import com.example.taskmanager.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @GetMapping("/")
    public String home() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            return "redirect:/dashboard";
        }
        return "redirect:/login";
    }
    
    @GetMapping("/login")
    public String loginPage(@RequestParam(value = "error", required = false) String error,
                           @RequestParam(value = "logout", required = false) String logout,
                           Model model) {
        if (error != null) {
            model.addAttribute("errorMessage", "Invalid username or password!");
        }
        if (logout != null) {
            model.addAttribute("successMessage", "You have been logged out successfully!");
        }
        return "login";
    }
    
    @GetMapping("/register")
    public String registerPage(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }
    
    @PostMapping("/register")
    public String registerUser(@Valid @ModelAttribute("user") User user, 
                              BindingResult bindingResult, 
                              @RequestParam("confirmPassword") String confirmPassword,
                              Model model, 
                              RedirectAttributes redirectAttributes) {
        
        // Check for validation errors
        if (bindingResult.hasErrors()) {
            return "register";
        }
        
        // Check if passwords match
        if (!user.getPassword().equals(confirmPassword)) {
            model.addAttribute("errorMessage", "Passwords do not match!");
            return "register";
        }
        
        try {
            userService.registerUser(user);
            
            // Auto-login after registration
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), confirmPassword)
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
            
            // Update last login
            userService.updateLastLogin(user.getUsername());
            
            redirectAttributes.addFlashAttribute("successMessage", 
                "Registration successful! Welcome, " + user.getFirstName() + "!");
            return "redirect:/dashboard";
            
        } catch (Exception e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "register";
        }
    }
    
    @PostMapping("/login")
    public String loginUser(@RequestParam String username, 
                           @RequestParam String password,
                           RedirectAttributes redirectAttributes) {
        try {
            // Update last login time
            userService.updateLastLogin(username);
            
            redirectAttributes.addFlashAttribute("successMessage", "Welcome back!");
            return "redirect:/dashboard";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Login failed!");
            return "redirect:/login?error=true";
        }
    }
}
