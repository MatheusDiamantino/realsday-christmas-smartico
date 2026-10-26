import { useEffect, useRef, useState } from "react";
import "./styles.scss";
import { Player } from "@lottiefiles/react-lottie-player";
import Reindeer from "./animations/Reindeer.json";
import Smoke from "./animations/Smoke.json";
import Snow from "./animations/Snow.json";
import Missions from "../widget-mission/main.jsx";
import {
  CHRISTMAS_TOURNAMENT_ID,
  CHRISTMAS_TOURNAMENT_NAME,
  CHRISTMAS_DAILY_GIFT_ID,
  CHRISTMAS_MISSION_IDS,
} from "../config/christmas.js";
const MISSION_IDS = CHRISTMAS_MISSION_IDS;

const DISABLE_ANIMATIONS = false;

const SCROLL_OFFSET = 200;

const fishPositions = [
  { top: "317PX", left: "-1px", transform: "rotateY(180deg)" },
];

const REINDEER_POSITIONS = [
  { width: "120px", height: "120px", bottom: "100px", left: "-160px" },
  { width: "120px", height: "120px", bottom: "320px", left: "-160px" },
  { width: "120px", height: "120px", bottom: "400px", left: "-160px" },
];

const animations = [
  {
    key: "Smoke",
    src: Smoke,
    style: { width: "90px", height: "90px", bottom: "256px", left: "262px" },
  },
  {
    key: "Smoke-2",
    src: Smoke,
    style: { width: "90px", height: "90px", top: "477px", left: "167px" },
  },
];

const getRandomPosition = () => {
  const randomIndex = Math.floor(Math.random() * fishPositions.length);
  return fishPositions[randomIndex];
};

const getLevelImageUrl = (level, disabled, index) => {
  if (!level) return "";
  const activeImages = [
    "/img/construção 3.png",
    "/img/construção 4.png",
    "/img/construção 1.png",
    "/img/construção 2.png",
  ];
  const i = Number.isFinite(index) ? index % activeImages.length : 0;
  const activeUrl = activeImages[i];
  return activeUrl;
};

const LevelMap = () => {
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  const levelContainerRef = useRef(null);
  const [showCard, setShowCard] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(null);
  const animationRef = useRef(null);
  const [fishPosition, setFishPosition] = useState(fishPositions[0]);
  const smarticoApi = window?._smartico?.api;

  const REINDEER_RESPAWN_MS = 5000;
  const [reindeerVisible, setReindeerVisible] = useState(true);
  const [reindeerIndex, setReindeerIndex] = useState(0);


  useEffect(() => {
    const loadData = async () => {
      if (!smarticoApi?.getLevels) {
        setLevels([]);
        setLoading(false);
        return;
      }

      const levelsResponse = await smarticoApi.getLevels();

      setLevels(levelsResponse);
      setLoading(false);
    };

    loadData();
  }, [smarticoApi]);

  useEffect(() => {
    if (!loading && levelContainerRef.current) {
      levelContainerRef.current.scrollTop =
        levelContainerRef.current.scrollHeight;
    }
  }, [loading]);

  const handleAnimationComplete = () => {
    const newPosition = getRandomPosition();
    setFishPosition(newPosition);
  };

  const handleOnClick = (key) => {
    if (animationRef.current && key === "OneFish") {
      window?._smartico?.action?.("FISH");
    }
  };

  const handleReindeerEnd = () => {
    setReindeerVisible(false);
    setTimeout(() => {
      setReindeerIndex((i) => (i + 1) % REINDEER_POSITIONS.length);
      setReindeerVisible(true);
    }, REINDEER_RESPAWN_MS);
  };

  const scrollContainer = (scrollOffset) => {
    if (levelContainerRef.current) {
      levelContainerRef.current.scrollBy({
        top: scrollOffset,
        behavior: "smooth",
      });
    }
  };

  const handleScrollUp = () => {
    scrollContainer(-SCROLL_OFFSET);
  };

  const handleScrollDown = () => {
    scrollContainer(SCROLL_OFFSET);
  };

  const handleMouseDown = (e) => {
    if (levelContainerRef.current) {
      levelContainerRef.current.isDragging = true;
      levelContainerRef.current.startY = e.clientY;
      levelContainerRef.current.scrollStartY =
        levelContainerRef.current.scrollTop;
      levelContainerRef.current.classList.add("dragging");
    }
  };

  const handleMouseMove = (e) => {
    if (levelContainerRef.current && levelContainerRef.current.isDragging) {
      const dy = e.clientY - levelContainerRef.current.startY;
      levelContainerRef.current.scrollTop =
        levelContainerRef.current.scrollStartY - dy;
    }
  };

  const handleMouseUp = () => {
    if (levelContainerRef.current) {
      levelContainerRef.current.isDragging = false;
      levelContainerRef.current.classList.remove("dragging");
    }
  };

  const handleMouseLeave = () => {
    if (levelContainerRef.current) {
      levelContainerRef.current.isDragging = false;
      levelContainerRef.current.classList.remove("dragging");
    }
  };


  if (loading) {
    return null;
  }

  return (
    <div
      className={`levels-wrapper ${
        DISABLE_ANIMATIONS ? "disable-animations" : ""
      }`}
    >
      <div className="levels-content-overlay" />
      <div
        className="levels-container"
        ref={levelContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="levels-content">
          <div className="levels-main-background">
            <div className="levels-map-road" />
            <div className="level-items-container">
              {levels
                .sort((a, b) => a.id - b.id)
                .slice(0, 4)
                .map((level, index) => (
                  <div key={level.id}>
                    <LevelItem
                      level={level}
                      index={index}
                      setShowCard={setShowCard}
                      setCurrentLevel={setCurrentLevel}
                    />
                  </div>
                ))}
            </div>
          </div>
          {!DISABLE_ANIMATIONS && (
            <div>
              <div
                className="animation-container snow"
                style={{ top: 0, left: 0, width: "100%", height: "40%", zIndex: 0 }}
              >
                <Player
                  src={Snow}
                  style={{ width: "100%", height: "100%" }}
                  autoplay={true}
                  loop={true}
                  background="transparent"
                />
              </div>
              {reindeerVisible && (
                <div
                  className="animation-container reindeer-run"
                  style={REINDEER_POSITIONS[reindeerIndex]}
                  onAnimationEnd={handleReindeerEnd}
                >
                  <Player
                    src={Reindeer}
                    style={{ width: "100%", height: "100%" }}
                    autoplay={true}
                    loop={true}
                    background="transparent"
                  />
                </div>
              )}
              {animations.map((animation) => (
                <div
                  className={`animation-container ${
                    animation.key === "OneFish" ? "fish" : ""
                  } ${animation.key.startsWith("Reindeer") ? "reindeer-run" : ""} ${animation.key.startsWith("Smoke") ? "smoke" : ""} ${animation.key === "Smoke-2" ? "smoke-2" : ""}`}
                  key={animation.key}
                  style={
                    animation.key === "OneFish" ? fishPosition : animation.style
                  }
                  onClick={() => handleOnClick(animation.key)}
                >
                  <Player
                    ref={animation.key === "OneFish" ? animationRef : null}
                    src={animation.src}
                    style={{ width: "100%", height: "100%" }}
                    autoplay={true}
                    loop={true}
                    background="transparent"
                    onEvent={(event) => {
                      if (event === "loop" && animation.key === "OneFish") {
                        handleAnimationComplete();
                      }
                    }}
                  ></Player>
                </div>
              ))}

            </div>
          )}
        </div>
      </div>


      {showCard && currentLevel && (
        <LevelCardModal
          level={currentLevel}
          showCard={showCard}
          setShowCard={setShowCard}
          levelIndex={levels.indexOf(currentLevel)}
        />
      )}

      <div className="levels-scroll-buttons">
        <div className="button-container" onClick={handleScrollUp}>
          <div className="button-nav up" />
        </div>
        <div className="button-container" onClick={handleScrollDown}>
          <div className="button-nav down" />
        </div>
      </div>
      <div className="levels-hint-message">
        <div className="hint-container">
          <div className="hint-icon" />
          <div className="hint-message">
            Arraste para cima e para baixo para navegar
          </div>
        </div>
      </div>
    </div>
  );
};

const modalConfigs = [
  {
    title: "PRESENTE DE NATAL",
    content: {
      logic:
        "De 03:00 às 23:59 do dia 25/12 o usuário terá acesso ao presente diário dentro da gamificação.",
      distribution: [],
    },
  },
  {
    title: "TORNEIO DE NATAL",
    content: {
      frequency: "03–00h",
      date: "25/12",
      prize: "R$25k + Giros",
      scoring: "R$1 = 1 pt. Ranking por pontos.",
      distribution: [
        { position: "1º", prize: "R$10k" },
        { position: "2º", prize: "R$7k" },
        { position: "3º", prize: "R$5k" },
        { position: "4º", prize: "R$3,5k" },
        { position: "5º", prize: "R$1,5k" },
        { position: "6º", prize: "R$800" },
        { position: "7º", prize: "R$600" },
        { position: "8º", prize: "R$400" },
        { position: "9º", prize: "R$200" },
        { position: "10–30º", prize: "R$100" },
        { position: "31º+", prize: "20 Giros Temáticos" },
      ],
    },
  },
  {
    title: "CALDEIRÃO - NATAL",
    content: {
      distribution: [],
    },
  },
];

const toArray = (value) => (Array.isArray(value) ? value : [value]);

const normalizeText = (text) => {
  if (!text) return "";
  return text.toString().toLowerCase().trim();
};

const getLevelHints = (level) => {
  if (!level?.hints) return [];
  return toArray(level.hints).map((hint) => normalizeText(hint));
};

const matchesLevel = (mission, level) => {
  if (!mission || !level) return false;

  const missionName = normalizeText(mission.name);
  const levelHints = getLevelHints(level);

  return levelHints.some((hint) => missionName.includes(hint));
};

const MissionOverlayButtons = ({ level, levelIndex, maxItems = 2 }) => {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const smarticoApi = window?._smartico?.api;

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        const ids = MISSION_IDS.map(Number);
        const select = (list) => {
          const arr = Array.isArray(list) ? list : [];
          const asMap = new Map(arr.map((m) => [Number(m.id), m]));
          const orderedByIds = ids.map((id) => asMap.get(id)).filter(Boolean);
          const byId = orderedByIds;
          const byLevel = arr.filter((mission) => matchesLevel(mission, level));
          let selected = (byId.length ? byId : byLevel).slice(0, maxItems);
          if (!selected.length && ids.length) {
            selected = ids.map((id) => ({ id, name: `Missão ${id}` }));
          }
          return selected;
        };

        if (!smarticoApi || typeof smarticoApi.getMissions !== "function") {
          setMissions(ids.map((id) => ({ id, name: `Missão ${id}` })));
          return;
        }
        const missionsList = await smarticoApi.getMissions({
          onUpdate: (ms) => {
            setMissions(select(ms));
          },
        });

        if (missionsList && Array.isArray(missionsList)) {
          setMissions(select(missionsList));
        }
      } catch (error) {
        console.error("Erro ao buscar missões:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, [level, levelIndex, maxItems, smarticoApi]);

  const handleMissionClick = (mission, index) => {
    const preferred = index === 0 ? "dl-missions" : "dl-missions-2";
    const aPreferred = document.getElementById(preferred);
    if (aPreferred) {
      aPreferred.click();
      return;
    }
    const fallback = index === 0 ? "dl-missions-2" : "dl-missions";
    const aFallback = document.getElementById(fallback);
    if (aFallback) {
      aFallback.click();
      return;
    }
    console.warn("[MissionOverlayButtons] Anchors de missão não encontrados (dl-missions / dl-missions-2).");
  };

  if (loading || !missions.length) {
    return null;
  }

  return (
    <div className="mission-overlay-buttons">
      {missions.map((mission, index) => (
        <button
          key={mission.id}
          className="mission-overlay-btn"
          onClick={() => handleMissionClick(mission, index)}
          aria-label={`Executar missão: ${mission.name}`}
        >
        </button>
      ))}
    </div>
  );
};

export default LevelMap;

function TournamentDynamicBlock() {
  const [loading, setLoading] = useState(true);
  const [tournament, setTournament] = useState(null);
  const smarticoApi = window?._smartico?.api;

  useEffect(() => {
    const load = async () => {
      if (!smarticoApi) {
        setLoading(false);
        return;
      }
      const onUpdate = (list) => {
        const arr = Array.isArray(list) ? list : [];
        const byId = arr.find(
          (t) => Number(t.id) === Number(CHRISTMAS_TOURNAMENT_ID)
        );
        if (byId) {
          setTournament(byId);
          return;
        }
        const nameQuery = String(CHRISTMAS_TOURNAMENT_NAME || "")
          .trim()
          .toLowerCase();
        if (nameQuery) {
          const byName = arr.find((t) =>
            String(t?.name || "").toLowerCase().includes(nameQuery)
          );
          if (byName) {
            setTournament(byName);
            return;
          }
        }
        setTournament(null);
      };
      const res = await smarticoApi.getTournamentsList({ onUpdate });
      onUpdate(res);
      setLoading(false);
    };
    load();
  }, [smarticoApi]);

  if (loading) return null;
  if (!tournament) {
    return (
      <div className="tournament-layout" role="region" aria-label="Torneio">
        <div className="no-missions">Nenhum torneio ativo encontrado.</div>
      </div>
    );
  }

  const openTournament = () => {
    const a = document.getElementById("dl-tournaments");
    if (a) {
      a.click();
      return;
    }
    const dp = window?._smartico?.dp;
    const selectedId = tournament?.id ?? CHRISTMAS_TOURNAMENT_ID;
    const deepLink = `dp:gf_tournaments&id=${selectedId}`;
    if (typeof dp === "function") {
      dp(deepLink);
      return;
    }
  };

  return (
    <div className="tournament-layout" role="region" aria-label="Torneio ativo">
      <section className="tournament-image">
        <img
          src="/img/banner-torneio.svg"
          alt={tournament?.name || "Torneio"}
          className="tournament-banner"
        />
      </section>
      <div className="tournament-info">
        <h3 className="tournament-title">{tournament?.name || "Torneio"}</h3>
        <div className="tournament-stats-grid">
          <div className="stat-card">
            <div className="stat-label">Premiação</div>
            <div className="stat-value">
              {tournament?.prize_pool_short ?? tournament?.prize_pool ?? "—"}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Registro</div>
            <div className="stat-value">
              {Number.isFinite(Number(tournament?.registration_count))
                ? tournament.registration_count
                : "—"}
              /
              {Number.isFinite(Number(tournament?.players_max_count))
                ? tournament.players_max_count
                : "—"}
            </div>
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="cta-btn" onClick={openTournament}>
            Participar do Torneio
          </button>
        </div>
      </div>
    </div>
  );
}

const LevelItem = ({ level, index, setShowCard, setCurrentLevel }) => {
  if (level === undefined) {
    return null;
  }

  const disabled = false;

  const handleClick = () => {
    if (disabled) return;
    setCurrentLevel(level);
    setShowCard(true);
  };

  const imageUrl = getLevelImageUrl(level, disabled, index);
  const safeImageUrl = imageUrl;
  if (!imageUrl) {
    console.warn(
      "Level image not found for level:",
      level?.id,
      level?.name,
      level?.custom_data
    );
  }

  return (
    <>
      <div
        key={level.id}
        className={`level-item level-${index} ${disabled ? "disabled" : ""}`}
        aria-disabled={disabled}
        title={disabled ? "Bloqueado" : level.name}
      >
        <button
          type="button"
          className="level-image-btn"
          style={{ backgroundImage: `url("${safeImageUrl}")` }}
          onClick={disabled ? undefined : handleClick}
          aria-label={level.name}
          disabled={disabled}
        />
        {disabled && <div className="lock-icon" />}
        <div className="level-name">{level.name}</div>
      </div>
    </>
  );
};

const LevelCardModal = ({ level, showCard, setShowCard, levelIndex }) => {
  if (level === undefined) {
    return null;
  }

  const modalConfig = modalConfigs[levelIndex] || null;

  const getModalClass = () => {
    if (!modalConfig) return "";

    const titleMap = {
      "CALDEIRÃO - NATAL": "giftbox-modal",
      "PRESENTE DE NATAL": "presente-modal",
      "TORNEIO DE NATAL": "torneio-modal",
    };

    return titleMap[modalConfig.title] || "";
  };

  return (
    <div
      className={`level-card-wrapper ${
        showCard ? "active" : ""
      } ${getModalClass()}`}
    >
      <div className={`level-card ${getModalClass()}`}>
        <div
          className="level-card-close"
          onClick={() => setShowCard(false)}
          role="button"
          aria-label="Fechar"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setShowCard(false);
            }
          }}
        >
          <div className="level-card-close-btn" />
        </div>
        <div className="level-card-content">
          {modalConfig ? (
            <div className="custom-modal-content">
              <div className="modal-header">
                <h2 className="modal-title">{modalConfig.title}</h2>
              </div>
              <div className="modal-body">
                {modalConfig.title === "TORNEIO DE NATAL" && (
                  <TournamentDynamicBlock />
                )}

                {modalConfig.title === "PRESENTE DE NATAL" && (
                  <section
                    className="present-layout"
                    aria-label="PRESENTE DE NATAL"
                  >
                    <h3 className="present-title">Como funciona</h3>
                    <p className="present-desc">{modalConfig.content.logic}</p>
                    <div className="modal-actions">
                      <button
                        className="cta-btn"
                        onClick={() => {
                          const giftAnchor = document.getElementById("dl-daily-gift");
                          if (giftAnchor) {
                            giftAnchor.click();
                            return;
                          }
                          const dp = window?._smartico?.dp;
                          const deepLink = `dp:gf_section&id=${CHRISTMAS_DAILY_GIFT_ID}`;
                          if (typeof dp === "function") {
                            dp(deepLink);
                            return;
                          }
                        }}
                      >
                        Abrir Presente Diário
                      </button>
                    </div>
                  </section>
                )}

                {modalConfig.title === "CALDEIRÃO - NATAL" && (
                  <section
                    className="giftbox-layout"
                    aria-label="Gift Box Natal"
                  >
                    <div className="missions-wrapper">
                      <Missions
                        level={level}
                        levelIndex={levelIndex}
                        maxItems={2}
                      />
                      <MissionOverlayButtons
                        level={level}
                        levelIndex={levelIndex}
                        maxItems={2}
                      />
                    </div>
                  </section>
                )}
                
              </div>
            </div>
          ) : (
            <Missions level={level} levelIndex={levelIndex} />
          )}
        </div>
      </div>
    </div>
  );
};
