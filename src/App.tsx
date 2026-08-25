/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback } from 'react';
import { GameMode, Language, Screen } from './types';
import { TopBar } from './components/TopBar';
import { HeroScreen } from './components/HeroScreen';
import { GameScreen, FinalGameStats } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { ConfirmModal } from './components/ConfirmModal';
import { FireworksCanvas, FireworksRef } from './components/FireworksCanvas';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [lang, setLang] = useState<Language>('vi');
  const [gameMode, setGameMode] = useState<GameMode>('solo');
  const [gameKey, setGameKey] = useState<number>(0);
  const [activeModal, setActiveModal] = useState<'reset' | 'end' | null>(null);

  const [currentStats, setCurrentStats] = useState<FinalGameStats>({
    score: 0,
    right: 0,
    scoreRed: 0,
    scoreBlue: 0,
    rightRed: 0,
    rightBlue: 0,
    totalQuestions: 30,
    elapsedSeconds: 0,
  });

  const fireworksRef = useRef<FireworksRef | null>(null);

  const triggerFireworks = useCallback((x: number, y: number, count = 60) => {
    fireworksRef.current?.burst(x, y, count);
  }, []);

  const handleStartGame = () => {
    setCurrentStats({
      score: 0,
      right: 0,
      scoreRed: 0,
      scoreBlue: 0,
      rightRed: 0,
      rightBlue: 0,
      totalQuestions: 30,
      elapsedSeconds: 0,
    });
    setGameKey((k) => k + 1);
    setScreen('game');
  };

  const handleScoreUpdate = useCallback((stats: FinalGameStats) => {
    setCurrentStats(stats);
  }, []);

  const handleFinishGame = (stats: FinalGameStats) => {
    setCurrentStats(stats);
    setScreen('result');
  };

  const handleResetClick = () => {
    setActiveModal('reset');
  };

  const handleEndGameClick = () => {
    if (screen === 'game') {
      setActiveModal('end');
    } else {
      setScreen('home');
    }
  };

  const handleConfirmModal = () => {
    if (activeModal === 'reset') {
      setActiveModal(null);
      handleStartGame();
    } else if (activeModal === 'end') {
      setActiveModal(null);
      setScreen('result');
    }
  };

  const handleCancelModal = () => {
    setActiveModal(null);
  };

  return (
    <main className="w-full h-[100dvh] flex flex-col justify-between overflow-hidden relative" id="mainApp">
      <FireworksCanvas ref={fireworksRef} />
      <div className="signature-tag select-none">tambmt'</div>

      <div className="w-[98%] max-w-[1400px] h-[100dvh] mx-auto p-1.5 sm:p-2.5 flex flex-col overflow-hidden">
        <TopBar
          lang={lang}
          onSetLang={setLang}
          onReset={handleResetClick}
          onEndGame={handleEndGameClick}
        />

        {/* Main Card */}
        <div className="border border-white/15 bg-slate-900/85 rounded-2xl p-2 sm:p-3.5 backdrop-blur-xl shadow-2xl flex-1 flex flex-col justify-between min-h-0 overflow-hidden">
          {screen === 'home' && (
            <HeroScreen
              lang={lang}
              gameMode={gameMode}
              onSetMode={setGameMode}
              onStart={handleStartGame}
            />
          )}

          {screen === 'game' && (
            <GameScreen
              key={gameKey}
              gameMode={gameMode}
              lang={lang}
              onFinishGame={handleFinishGame}
              onScoreUpdate={handleScoreUpdate}
              triggerFireworks={triggerFireworks}
              isPaused={activeModal !== null}
            />
          )}

          {screen === 'result' && (
            <ResultScreen
              stats={currentStats}
              gameMode={gameMode}
              lang={lang}
              onPlayAgain={handleStartGame}
              triggerFireworks={triggerFireworks}
            />
          )}
        </div>
      </div>

      {activeModal && (
        <ConfirmModal
          type={activeModal}
          lang={lang}
          onConfirm={handleConfirmModal}
          onCancel={handleCancelModal}
        />
      )}
    </main>
  );
}
