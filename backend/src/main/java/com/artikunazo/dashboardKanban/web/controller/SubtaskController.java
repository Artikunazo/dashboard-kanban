package com.artikunazo.dashboardKanban.web.controller;

import com.artikunazo.dashboardKanban.domain.SubtaskDomain;
import com.artikunazo.dashboardKanban.domain.service.SubtaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "https://dashboard-kanban-two.vercel.app/", maxAge = 3600)
@RestController
@RequestMapping("/subtask")
public class SubtaskController {

  @Autowired
  private SubtaskService subtaskService;

  @GetMapping("/health-check")
  public ResponseEntity<String> getResponse() {
    return new ResponseEntity<String>("Ok!", HttpStatus.OK) ;
  }

  @GetMapping("/all/{idTask}")
  public ResponseEntity<List<SubtaskDomain>> getAllByTask(@PathVariable("idTask") int idTask) {
    return new ResponseEntity<>(subtaskService.getAllByTaskId(idTask), HttpStatus.OK);
  }

  @PostMapping("/save")
  public ResponseEntity<SubtaskDomain> saveSubtask(@RequestBody SubtaskDomain subtaskDomain) {
    return new ResponseEntity<>(subtaskService.saveSubtask(subtaskDomain), HttpStatus.CREATED);
  }

  @DeleteMapping("delete/{idSubtask}")
  ResponseEntity<String> deleteSubtask(@PathVariable("idSubtask") int idSubtask) {
    if(!subtaskService.deleteSubtask(idSubtask)) {
      return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
    } else {
      return new ResponseEntity<String>(HttpStatus.OK);
    }
  }

  @PutMapping("/update")
  ResponseEntity<String> updateSubtask(@RequestBody SubtaskDomain subtaskDomain) {
    System.out.println(subtaskDomain.getSubtaskId() + " " + subtaskDomain.getDone());
    if(!subtaskService.updateSubtask(subtaskDomain)) {
      return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
    } else {
      return new ResponseEntity<String>(HttpStatus.OK);
    }
  }

}
