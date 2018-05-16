package com.example.ideasapi.controllers;

import com.example.ideasapi.models.Idea;
import com.example.ideasapi.repositories.IdeasRepository;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
public class IdeasController {

	@Autowired
	private IdeasRepository userRepository;

	@GetMapping("/ideas")
	public List<Idea> findAllIdeas() {
		return userRepository.findAll();
	}

	@GetMapping("/ideas/{ideaId}")
	public Idea findIdeaById(@PathVariable Long ideaId) throws NotFoundException {

		Idea foundIdea = userRepository.findOne(ideaId);

		if (foundIdea == null) {
			throw new NotFoundException("Idea with ID of " + ideaId + " was not found!");
		}

		return foundIdea;
	}

	@PostMapping("/ideas")
	public Idea createNewIdea(@RequestBody Idea newIdea) {
		return userRepository.save(newIdea);
	}

	@DeleteMapping("/ideas/{ideaId}")
	public HttpStatus deleteIdeaById(@PathVariable Long ideaId) throws EmptyResultDataAccessException {

		userRepository.delete(ideaId);
		return HttpStatus.OK;
	}

	@PatchMapping("/ideas/{ideaId}")
	public Idea updateIdeaById(@PathVariable Long ideaId, @RequestBody Idea userRequest) throws NotFoundException {
		Idea userFromDb = userRepository.findOne(ideaId);

		if (userFromDb == null) {
			throw new NotFoundException("Idea with ID of " + ideaId + " was not found!");
		}

		userFromDb.setTitle(userRequest.getTitle());
		userFromDb.setDescription(userRequest.getDescription());

		return userRepository.save(userFromDb);
	}

	// EXCEPTION HANDLERS

	@ExceptionHandler
	void handleIdeaNotFound(
		NotFoundException exception,
		HttpServletResponse response) throws IOException {

		response.sendError(HttpStatus.NOT_FOUND.value(), exception.getMessage());
	}

	@ExceptionHandler
	void handleDeleteNotFoundException(
		EmptyResultDataAccessException exception,
		HttpServletResponse response) throws IOException {

		response.sendError(HttpStatus.NOT_FOUND.value());
	}
}
