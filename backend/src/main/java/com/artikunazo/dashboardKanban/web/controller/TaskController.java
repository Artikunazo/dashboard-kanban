package com.artikunazo.dashboardKanban.web.controller;

import com.artikunazo.dashboardKanban.domain.TaskDomain;
import com.artikunazo.dashboardKanban.domain.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "https://dashboard-kanban-two.vercel.app/", maxAge = 3600)
@RestController
@RequestMapping("/task")
public class TaskController {

  @Autowired
  private TaskService taskService;

  @GetMapping("/health-check")
  public ResponseEntity<String> getResponse() {
    return new ResponseEntity<String>("Ok!", HttpStatus.OK) ;
  }

  @GetMapping("/all/{idBoard}")
  public ResponseEntity<List<TaskDomain>> getTasksByBoardId(@PathVariable("idBoard") int idBoard) {
    return new ResponseEntity<>(taskService.getTasksByBoardId(idBoard), HttpStatus.OK);
  }

  @GetMapping("{idTask}")
  public ResponseEntity<Optional<TaskDomain>> getTaskById(@PathVariable("idTask") int idTask) {
    return new ResponseEntity<>(taskService.getTaskById(idTask), HttpStatus.OK);
  }

  @PostMapping("/save")
  public ResponseEntity<TaskDomain> saveTask(@RequestBody TaskDomain taskDomain){
    return new ResponseEntity<>(taskService.saveTask(taskDomain), HttpStatus.CREATED);
  }

  @PutMapping("/update")
  public ResponseEntity<Boolean> updateTask(@RequestBody TaskDomain taskDomain){
    if(!taskService.updateTask(taskDomain)) {
      return  new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
    } else {
      return  new ResponseEntity<>(true, HttpStatus.OK);
    }
  }

  @DeleteMapping("/delete/{idTask}")
  public ResponseEntity<Boolean> deleteTask(@PathVariable("idTask") int idTask) {
    if(!taskService.deleteTask(idTask)) {
      return new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
    } else {
      return new ResponseEntity<>(true, HttpStatus.OK);
    }
  }

  @PutMapping("/update-status")
  public ResponseEntity<Boolean> updateTaskStatus(@RequestBody TaskDomain taskDomain) {
    if(!taskService.updateTaskStatus(taskDomain)){
      return new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
    } else {
      return new ResponseEntity<>(true, HttpStatus.OK);
    }
  }
}
