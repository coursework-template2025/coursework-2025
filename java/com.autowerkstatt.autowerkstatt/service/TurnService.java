package com.autowerkstatt.autowerkstatt.service;

import com.autowerkstatt.autowerkstatt.dao.TurnRepository;
import com.autowerkstatt.autowerkstatt.entity.Turn;
import com.autowerkstatt.autowerkstatt.enums.Faults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TurnService {

    @Autowired
    private TurnRepository turnRepository;

    public void save(Turn turn) {
        this.turnRepository.save(turn);
    }

    public Turn findById(Long turnId) {
        return this.turnRepository.findById(turnId).orElse(null);
    }

    public List<Turn> findTurnByHodovkaAndStatus() {
        return this.turnRepository.findTurnByStatus();
    }

    public List<Turn> findTurnByElectricianAndStatus() {
        return this.turnRepository.findTurnsBy();
    }

    public List<Turn> findTurnByDVSAndStatus() {
        return this.turnRepository.findTurnAndStatus();
    }

    public List<Turn> findTurnByMoreAndStatus() {
        return this.turnRepository.findTurnByStatusAndNotification();
    }

    public List<Turn> findTurnByStatusAndUser(Long userId) {
        return this.turnRepository.findTurnByStatusAndNotificationStatus(userId);
    }

    public List<Turn> findTurnByStatusWorking() {
        return this.turnRepository.findTurnsByStatus();
    }

    public List<Turn> findTurnByStatusDone() {
        return this.turnRepository.findTurnBy();
    }

    public Integer findTurnByFaultsCount(Long turnId) {
        return this.turnRepository.getTurnByFaults(turnId);
    }
}
