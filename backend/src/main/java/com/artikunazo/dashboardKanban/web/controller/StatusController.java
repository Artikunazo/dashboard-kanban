package com.artikunazo.dashboardKanban.web.controller;

import com.artikunazo.dashboardKanban.domain.StatusDomain;
import com.artikunazo.dashboardKanban.domain.service.StatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "https://dashboard-kanban-two.vercel.app/", maxAge = 3600)
@RestController
@RequestMapping("/status")
public class StatusController {

  @Autowired
  private StatusService statusService;

  @GetMapping("/health-check")
  public ResponseEntity<String> getResponse() {
    return new ResponseEntity<String>("Ok!", HttpStatus.OK) ;
  }

  @GetMapping("/")
  public ResponseEntity<List<StatusDomain>> getAll() {
    return new ResponseEntity<>(statusService.getAll(), HttpStatus.OK);
  }
}
