package com.example.ideasapi.repositories;

import com.example.ideasapi.models.Idea;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface IdeasRepository extends CrudRepository<Idea, Long> {

	List<Idea> findAll();

}