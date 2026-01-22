package com.autowerkstatt.autowerkstatt.dao;

import com.autowerkstatt.autowerkstatt.entity.Mark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarkRepository extends JpaRepository<Mark, Long> {

    @Query(value = "SELECT m.id,m.name FROM Marks m", nativeQuery = true)
    List<Object[]> geaAllMarks();

    @Query(value = "select m.id, m.name " +
            "from marks mk " +
            "         join models m on mk.id = m.mark_id " +
            "where mk.id = :id", nativeQuery = true)
    List<Object[]> getModelByMark(Long id);
}
