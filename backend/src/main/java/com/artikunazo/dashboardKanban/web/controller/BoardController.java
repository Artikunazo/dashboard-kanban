package com.artikunazo.dashboardKanban.web.controller;

import com.artikunazo.dashboardKanban.domain.BoardDomain;
import com.artikunazo.dashboardKanban.domain.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "https://dashboard-kanban-two.vercel.app/", maxAge = 3600)
@RestController
@RequestMapping("/board")
public class BoardController {

  @Autowired
  private BoardService boardService;

  @GetMapping("/health-check")
  public ResponseEntity<String> getResponse() {
    return new ResponseEntity<String>("Ok!", HttpStatus.OK) ;
  }

  @GetMapping("/")
  public ResponseEntity<List<BoardDomain>> getAll() {
    return new ResponseEntity<>(boardService.getAll(), HttpStatus.OK);
  }

  @PostMapping("/save")
  public ResponseEntity<BoardDomain> saveBoard(@RequestBody BoardDomain boardDomain) {
    return new ResponseEntity<>(boardService.saveBoard(boardDomain), HttpStatus.CREATED);
  }

  @PostMapping("/update")
  public ResponseEntity<Integer> updateBoard(@RequestBody BoardDomain boardDomain) {
    return new ResponseEntity<Integer>(boardService.updateBoard(boardDomain), HttpStatus.OK);
  }

  @DeleteMapping("/delete/{idBoard}")
  public ResponseEntity<String> deleteBoard(@PathVariable("idBoard") int idBoard) {
    if(!boardService.deleteBoard(idBoard)) {
      return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
    } else {
      return new ResponseEntity<String>(HttpStatus.OK);
    }
  }

}
