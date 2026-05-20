package com.example.demo.controller;

import com.example.demo.model.Todo;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:5173") // Vite default port
public class TodoController {
    private final List<Todo> todos = new ArrayList<>();
    private final AtomicLong counter = new AtomicLong();

    public TodoController() {
        todos.add(new Todo(counter.incrementAndGet(), "Learn Spring Boot", false));
        todos.add(new Todo(counter.incrementAndGet(), "Connect to React", false));
    }

    @GetMapping
    public List<Todo> getAll() {
        return todos;
    }

    @PostMapping
    public Todo create(@RequestBody Todo todo) {
        todo.setId(counter.incrementAndGet());
        todos.add(todo);
        return todo;
    }

    @PutMapping("/{id}")
    public Todo update(@PathVariable Long id, @RequestBody Todo todoDetails) {
        Todo todo = todos.stream()
                .filter(t -> t.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        
        todo.setCompleted(todoDetails.isCompleted());
        todo.setText(todoDetails.getText());
        return todo;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        todos.removeIf(t -> t.getId().equals(id));
    }
}
