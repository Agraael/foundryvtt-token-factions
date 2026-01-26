import { AdvancedFactions, TeamConfig } from "./scripts/advanced-factions.js";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const CONSTANTS = Object.freeze({
  MODULE_ID: "token-factions",
  PATH: `modules/token-factions/`,
  FLAGS: {
    FACTION_DRAW_FRAME: "factionDrawFrame",
    FACTION_DISABLE_BORDER: "disableBorder",
    FACTION_CUSTOM_BORDER: "customBorder",
    FACTION_CUSTOM_COLOR_INT: "customColorInt",
    FACTION_CUSTOM_COLOR_EXT: "customColorExt",
    FACTION_CUSTOM_FRAME_OPACITY: "customFrameOpacity",
    FACTION_CUSTOM_BASE_OPACITY: "customBaseOpacity",
    FACTION_TEAM: "team"
  },
  DEFAULTS: {
    CONTROLLED_COLOR: "#FF9829",
    CONTROLLED_COLOR_EX: "#000000",
    HOSTILE_COLOR: "#E72124",
    HOSTILE_COLOR_EX: "#000000",
    FRIENDLY_COLOR: "#43DFDF",
    FRIENDLY_COLOR_EX: "#000000",
    NEUTRAL_COLOR: "#F1D836",
    NEUTRAL_COLOR_EX: "#000000",
    PARTY_COLOR: "#33BC4E",
    PARTY_COLOR_EX: "#000000",
    ACTOR_FOLDER_COLOR_EX: "#000000",
    COLOR_FROM: "token-disposition",
    BASE_OPACITY: 0.5,
    FILL_TEXTURE: true,
    FRAME_STYLE: "flat",
    FRAME_OPACITY: 1,
    REMOVE_BORDERS: "0",
    PERMANENT_BORDER: false,
    BORDER_WIDTH: 4,
    BORDER_GRID_SCALE: false,
    BORDER_OFFSET: 0,
    CIRCLE_BORDERS: false,
    SCALE_BORDER: false,
    HUD_ENABLE: true,
    HUD_COLUMN: "Right",
    HUD_TOP_BOTTOM: "Bottom",
    DEBUG: false
  },
  SETTINGS: {
    RESET: "reset",
    COLOR_FROM: "color-from",
    BASE_OPACITY: "base-opacity",
    FILL_TEXTURE: "fillTexture",
    FRAME_STYLE: "frame-style",
    FRAME_OPACITY: "frame-opacity",
    REMOVE_BORDERS: "removeBorders",
    PERMANENT_BORDER: "permanentBorder",
    BORDER_WIDTH: "borderWidth",
    BORDER_GRID_SCALE: "borderGridScale",
    BORDER_OFFSET: "borderOffset",
    CIRCLE_BORDERS: "circleBorders",
    SCALE_BORDER: "scaleBorder",
    HUD_ENABLE: "hudEnable",
    HUD_COLUMN: "hudColumn",
    HUD_TOP_BOTTOM: "hudTopBottom",
    CONTROLLED_COLOR: "controlledColor",
    CONTROLLED_COLOR_EX: "controlledColorEx",
    HOSTILE_COLOR: "hostileColor",
    HOSTILE_COLOR_EX: "hostileColorEx",
    FRIENDLY_COLOR: "friendlyColor",
    FRIENDLY_COLOR_EX: "friendlyColorEx",
    NEUTRAL_COLOR: "neutralColor",
    NEUTRAL_COLOR_EX: "neutralColorEx",
    PARTY_COLOR: "partyColor",
    PARTY_COLOR_EX: "partyColorEx",
    ACTOR_FOLDER_COLOR_EX: "actorFolderColorEx",
    ACTOR_FOLDER_COLOR_EX: "actorFolderColorEx",
    DEBUG: "debug",
    TEAM_SETUP: "team-setup",
    DISPOSITION_MATRIX: "disposition-matrix"
  }
});
const _Logger = class _Logger {
  static get DEBUG() {
    return game.settings.get(CONSTANTS.MODULE_ID, "debug") || game.modules.get("_dev-mode")?.api?.getPackageDebugValue(CONSTANTS.MODULE_ID, "boolean");
  }
  // export let debugEnabled = 0;
  // 0 = none, warnings = 1, debug = 2, all = 3
  static debug(msg, ...args) {
    try {
      if (game.settings.get(CONSTANTS.MODULE_ID, "debug") || game.modules.get("_dev-mode")?.api?.getPackageDebugValue(CONSTANTS.MODULE_ID, "boolean")) {
        console.log(`DEBUG | ${CONSTANTS.MODULE_ID} | ${msg}`, ...args);
      }
    } catch (e) {
      console.error(e.message);
    }
    return msg;
  }
  static logObject(...args) {
    return this.log("", args);
  }
  static log(message, ...args) {
    try {
      message = `${CONSTANTS.MODULE_ID} | ${message}`;
      console.log(message.replace("<br>", "\n"), ...args);
    } catch (e) {
      console.error(e.message);
    }
    return message;
  }
  static notify(message, ...args) {
    try {
      message = `${CONSTANTS.MODULE_ID} | ${message}`;
      ui.notifications?.notify(message);
      console.log(message.replace("<br>", "\n"), ...args);
    } catch (e) {
      console.error(e.message);
    }
    return message;
  }
  static info(info, notify = false, ...args) {
    try {
      info = `${CONSTANTS.MODULE_ID} | ${info}`;
      if (notify) {
        ui.notifications?.info(info);
      }
      console.log(info.replace("<br>", "\n"), ...args);
    } catch (e) {
      console.error(e.message);
    }
    return info;
  }
  static warn(warning, notify = false, ...args) {
    try {
      warning = `${CONSTANTS.MODULE_ID} | ${warning}`;
      if (notify) {
        ui.notifications?.warn(warning);
      }
      console.warn(warning.replace("<br>", "\n"), ...args);
    } catch (e) {
      console.error(e.message);
    }
    return warning;
  }
  static errorObject(...args) {
    return this.error("", false, args);
  }
  static error(error, notify = true, ...args) {
    try {
      error = `${CONSTANTS.MODULE_ID} | ${error}`;
      if (notify) {
        ui.notifications?.error(error);
      }
      console.error(error.replace("<br>", "\n"), ...args);
    } catch (e) {
      console.error(e.message);
    }
    return new Error(error.replace("<br>", "\n"));
  }
  static timelog(message) {
    warn(Date.now(), message);
  }
  // setDebugLevel = (debugText): void => {
  //   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
  //   // 0 = none, warnings = 1, debug = 2, all = 3
  //   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
  // };
  static dialogWarning(message, icon = "fas fa-exclamation-triangle") {
    return `<p class="${CONSTANTS.MODULE_ID}-dialog">
        <i style="font-size:3rem;" class="${icon}"></i><br><br>
        <strong style="font-size:1.2rem;">${CONSTANTS.MODULE_ID}</strong>
        <br><br>${message}
    </p>`;
  }
};
__name(_Logger, "Logger");
__publicField(_Logger, "i18n", (key) => {
  return game.i18n.localize(key)?.trim();
});
__publicField(_Logger, "i18nFormat", (key, data = {}) => {
  return game.i18n.format(key, data)?.trim();
});
let Logger = _Logger;
const registerSettings = /* @__PURE__ */ __name(function () {
  game.settings.registerMenu(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.RESET, {
    name: `${CONSTANTS.MODULE_ID}.setting.reset.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.reset.hint`,
    icon: "fas fa-coins",
    type: ResetSettingsDialog,
    restricted: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.COLOR_FROM, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.COLOR_FROM}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.COLOR_FROM}.hint`,
    scope: "world",
    config: true,
    default: CONSTANTS.DEFAULTS.COLOR_FROM,
    type: String,
    choices: {
      "token-disposition": `${CONSTANTS.MODULE_ID}.setting.color-from.opt.token-disposition`,
      "actor-folder-color": `${CONSTANTS.MODULE_ID}.setting.color-from.opt.actor-folder-color`,
      "advanced-factions": "Advanced Factions (Teams)"
    }
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BASE_OPACITY, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.BASE_OPACITY}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.BASE_OPACITY}.hint`,
    scope: "world",
    config: true,
    default: CONSTANTS.DEFAULTS.BASE_OPACITY,
    type: Number,
    range: {
      min: 0,
      max: 1,
      step: 0.05
    }
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FILL_TEXTURE, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FILL_TEXTURE}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FILL_TEXTURE}.hint`,
    scope: "world",
    type: Boolean,
    default: CONSTANTS.DEFAULTS.FILL_TEXTURE,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRAME_STYLE, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FRAME_STYLE}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FRAME_STYLE}.hint`,
    scope: "world",
    config: true,
    default: CONSTANTS.DEFAULTS.FRAME_STYLE,
    type: String,
    choices: {
      flat: `${CONSTANTS.MODULE_ID}.setting.frame-style.opt.flat`,
      beveled: `${CONSTANTS.MODULE_ID}.setting.frame-style.opt.beveled`
    }
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRAME_OPACITY, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FRAME_OPACITY}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FRAME_OPACITY}.hint`,
    scope: "world",
    config: true,
    default: CONSTANTS.DEFAULTS.FRAME_OPACITY,
    type: Number,
    range: {
      min: 0,
      max: 1,
      step: 0.05
    }
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.REMOVE_BORDERS, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.REMOVE_BORDERS}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.REMOVE_BORDERS}.hint`,
    scope: "world",
    type: String,
    choices: {
      0: "None",
      1: "Non Owned",
      2: "All"
    },
    default: CONSTANTS.DEFAULTS.REMOVE_BORDERS,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PERMANENT_BORDER, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.PERMANENT_BORDER}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.PERMANENT_BORDER}.hint`,
    default: CONSTANTS.DEFAULTS.PERMANENT_BORDER,
    type: Boolean,
    scope: "world",
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BORDER_WIDTH, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.BORDER_WIDTH}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.BORDER_WIDTH}.hint`,
    scope: "world",
    type: Number,
    default: CONSTANTS.DEFAULTS.BORDER_WIDTH,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BORDER_GRID_SCALE, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.BORDER_GRID_SCALE}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.BORDER_GRID_SCALE}.hint`,
    scope: "world",
    type: Boolean,
    default: CONSTANTS.DEFAULTS.BORDER_GRID_SCALE,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BORDER_OFFSET, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.BORDER_OFFSET}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.BORDER_OFFSET}.hint`,
    scope: "world",
    type: Number,
    default: CONSTANTS.DEFAULTS.BORDER_OFFSET,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CIRCLE_BORDERS, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.CIRCLE_BORDERS}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.CIRCLE_BORDERS}.hint`,
    scope: "world",
    type: Boolean,
    default: CONSTANTS.DEFAULTS.CIRCLE_BORDERS,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.SCALE_BORDER, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.SCALE_BORDER}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.SCALE_BORDER}.hint`,
    scope: "world",
    type: Boolean,
    default: CONSTANTS.DEFAULTS.SCALE_BORDER,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HUD_ENABLE, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HUD_ENABLE}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HUD_ENABLE}.hint`,
    scope: "world",
    type: Boolean,
    default: CONSTANTS.DEFAULTS.HUD_ENABLE,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HUD_COLUMN, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HUD_COLUMN}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HUD_COLUMN}.hint`,
    scope: "world",
    config: true,
    type: String,
    default: CONSTANTS.DEFAULTS.HUD_COLUMN,
    choices: {
      Left: "Left",
      Right: "Right"
    }
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HUD_TOP_BOTTOM, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HUD_TOP_BOTTOM}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HUD_TOP_BOTTOM}.hint`,
    scope: "world",
    config: true,
    type: String,
    default: CONSTANTS.DEFAULTS.HUD_TOP_BOTTOM,
    choices: {
      Top: "Top",
      Bottom: "Bottom"
    }
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.CONTROLLED_COLOR}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.CONTROLLED_COLOR}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.CONTROLLED_COLOR,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR_EX, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.CONTROLLED_COLOR_EX}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.CONTROLLED_COLOR_EX}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.CONTROLLED_COLOR_EX,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HOSTILE_COLOR}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HOSTILE_COLOR}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.HOSTILE_COLOR,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR_EX, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HOSTILE_COLOR_EX}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.HOSTILE_COLOR_EX}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.HOSTILE_COLOR_EX,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FRIENDLY_COLOR}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FRIENDLY_COLOR}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.FRIENDLY_COLOR,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.FRIENDLY_COLOR_EX,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.NEUTRAL_COLOR}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.NEUTRAL_COLOR}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.NEUTRAL_COLOR,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.NEUTRAL_COLOR_EX,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.PARTY_COLOR}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.PARTY_COLOR}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.PARTY_COLOR,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR_EX, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.PARTY_COLOR_EX}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.PARTY_COLOR_EX}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.PARTY_COLOR_EX,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.ACTOR_FOLDER_COLOR_EX, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.ACTOR_FOLDER_COLOR_EX}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.ACTOR_FOLDER_COLOR_EX}.hint`,
    scope: "world",
    type: String,
    default: CONSTANTS.DEFAULTS.ACTOR_FOLDER_COLOR_EX,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.DEBUG, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.DEBUG}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.DEBUG}.hint`,
    scope: "client",
    config: true,
    default: CONSTANTS.DEFAULTS.DEBUG,
    type: Boolean
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.TEAM_SETUP, {
    name: "Teams Setup",
    scope: "world",
    config: false,
    type: Array,
    default: []
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.DISPOSITION_MATRIX, {
    name: "Disposition Matrix",
    scope: "world",
    config: false,
    type: Object,
    default: {}
  });

  game.settings.registerMenu(CONSTANTS.MODULE_ID, "team-config", {
    name: "Team Configuration",
    label: "Configure Teams",
    hint: "Setup Teams and Dispositions",
    icon: "fas fa-users-cog",
    type: TeamConfig,
    restricted: true
  });

}, "registerSettings");
const _ResetSettingsDialog = class _ResetSettingsDialog extends FormApplication {
  constructor(...args) {
    super(...args);
    return new Dialog({
      title: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.title`),
      content: '<p style="margin-bottom:1rem;">' + game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.content`) + "</p>",
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.confirm`),
          callback: async () => {
            const worldSettings = game.settings.storage?.get("world")?.filter((setting) => setting.key.startsWith(`${CONSTANTS.MODULE_ID}.`));
            for (let setting of worldSettings) {
              Logger.info(`Reset setting '${setting.key}'`);
              await setting.delete();
            }
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.cancel`)
        }
      },
      default: "cancel"
    });
  }
  async _updateObject(event, formData = null) {
  }
};
__name(_ResetSettingsDialog, "ResetSettingsDialog");
let ResetSettingsDialog = _ResetSettingsDialog;
const _FactionBorderGraphics = class _FactionBorderGraphics {
  INT = Color.from(0);
  EX = Color.from(0);
  INT_S = "000";
  EX_S = "000";
  constructor() {
    this.INT = Color.from(0);
    this.EX = Color.from(0);
    this.INT_S = "000";
    this.EX_S = "000";
  }
};
__name(_FactionBorderGraphics, "FactionBorderGraphics");
let FactionBorderGraphics = _FactionBorderGraphics;
let bevelGradient;
let bevelTexture;
async function initTexture() {
  bevelGradient = await loadTexture(`modules/${CONSTANTS.MODULE_ID}/assets/bevel-gradient.jpg`);
  bevelTexture = await loadTexture(`modules/${CONSTANTS.MODULE_ID}/assets/bevel-texture.png`);
}
__name(initTexture, "initTexture");
function drawBorderFaction(token) {
  if (!token) {
    Logger.debug("No token is found or passed");
    return;
  }
  if (!token.faction) {
    Logger.debug(`Token faction is not initialized`);
    return;
  }
  if (token.x === 0 && token.y === 0 && token.document.x === 0 && token.document.y === 0) {
    Logger.debug(`Token position is invalid`);
    return;
  }
  dropTokenBoarder(token);
  if (shouldSkipDrawing(token)) {
    Logger.debug(`Skipping drawing border for token ${token.document.name}`);
    return;
  }
  const borderColor = colorBorderFaction(token);
  if (!borderColor) {
    Logger.debug(`No border color is found for token ${token.document.name}`);
    return;
  }
  if (!borderColor.INT || Number.isNaN(borderColor.INT)) {
    Logger.debug(`No border color is found for token ${token.document.name}`);
    return;
  }
  const frameStyle = String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRAME_STYLE));
  Logger.debug(`Drawing border for token %s. Style: %s, Color: %d`, token.document.name, frameStyle, borderColor.INT);
  token.faction.container.position.set(0, 0);
  if (frameStyle === TokenFactions.TOKEN_FACTIONS_FRAME_STYLE.BELEVELED) {
    drawBeveledBorder(token, token.faction.container, borderColor);
  } else {
    drawBorder(token, token.faction.container, borderColor);
  }
}
__name(drawBorderFaction, "drawBorderFaction");
function dropTokenBoarder(token) {
  token.faction.container.removeChildren().forEach((c) => c.destroy());
}
__name(dropTokenBoarder, "dropTokenBoarder");
function shouldSkipDrawing(token) {
  if (!token.visible) {
    return true;
  }
  const removeBorders = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.REMOVE_BORDERS);
  if (removeBorders === "1" && !token.isOwner) {
    return true;
  } else if (removeBorders === "2") {
    return true;
  }
  return token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE_BORDER) ?? false;
}
__name(shouldSkipDrawing, "shouldSkipDrawing");
function drawBeveledBorder(token, container, borderColor) {
  const { textureScaleX, textureScaleY } = getTextureScale(token);
  const borderOffset = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BORDER_OFFSET);
  const borderScale = getBorderScale();
  const frameOpacity = getFrameOpacity(token);
  const baseOpacity = getBaseOpacity(token);
  const fillTexture = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FILL_TEXTURE);
  const tokenCenterX = token.w / 2;
  const tokenCenterY = token.h / 2;
  const tokenBorderRadiusX = token.w * textureScaleX / 2;
  const tokenBorderRadiusY = token.h * textureScaleY / 2;
  const borderWidth = getTokenBorderWidth(token);
  const scaledBorderWidth = borderWidth * borderScale;
  const scaledHalfBorderWidth = scaledBorderWidth / 2;
  const outerRing = _drawGradient(token, borderColor.INT, bevelGradient);
  const innerRing = _drawGradient(token, borderColor.INT, bevelGradient);
  const ringTexture = _drawTexture(token, borderColor.INT, bevelTexture);
  const outerRingMask = new PIXI.Graphics();
  const innerRingMask = new PIXI.Graphics();
  const ringTextureMask = new PIXI.Graphics();
  outerRing.alpha = frameOpacity;
  innerRing.alpha = frameOpacity;
  ringTexture.alpha = frameOpacity;
  if (fillTexture) {
    const factionBorder = new PIXI.Graphics();
    container.addChild(factionBorder);
    factionBorder.beginFill(Color.from(borderColor.EX), baseOpacity).lineStyle(scaledBorderWidth, borderColor.EX, 0.8).drawEllipse(
      tokenCenterX,
      tokenCenterY,
      tokenBorderRadiusX - scaledBorderWidth - borderOffset,
      tokenBorderRadiusY - scaledBorderWidth - borderOffset
    ).beginTextureFill({
      texture: PIXI.Texture.EMPTY,
      color: borderColor.EX,
      alpha: baseOpacity
    }).endFill();
    factionBorder.beginFill(Color.from(borderColor.INT), baseOpacity).lineStyle(scaledHalfBorderWidth, Color.from(borderColor.INT), 1).drawEllipse(
      tokenCenterX,
      tokenCenterY,
      tokenBorderRadiusX - scaledHalfBorderWidth - scaledBorderWidth / 2 - borderOffset,
      tokenBorderRadiusY - scaledHalfBorderWidth - scaledBorderWidth / 2 - borderOffset
    ).beginTextureFill({
      texture: PIXI.Texture.EMPTY,
      color: Color.from(borderColor.INT),
      alpha: baseOpacity
    }).endFill();
  }
  outerRingMask.lineStyle(scaledHalfBorderWidth, borderColor.EX, 1).beginFill(Color.from(16777215), 0).drawEllipse(
    tokenCenterX,
    tokenCenterY,
    tokenBorderRadiusX - scaledBorderWidth - borderOffset,
    tokenBorderRadiusY - scaledBorderWidth - borderOffset
  ).endFill();
  innerRing.anchor.set(1);
  innerRing.rotation = Math.PI;
  innerRingMask.lineStyle(scaledHalfBorderWidth, borderColor.EX, 1).beginFill(Color.from(16777215), 0).drawEllipse(
    tokenCenterX,
    tokenCenterY,
    tokenBorderRadiusX - scaledBorderWidth - borderOffset - scaledHalfBorderWidth,
    tokenBorderRadiusY - scaledBorderWidth - borderOffset - scaledHalfBorderWidth
  ).endFill();
  ringTextureMask.lineStyle(scaledBorderWidth, borderColor.EX, 1).beginFill(Color.from(16777215), 0).drawEllipse(
    tokenCenterX,
    tokenCenterY,
    tokenBorderRadiusX - scaledBorderWidth - borderOffset - scaledHalfBorderWidth / 2,
    tokenBorderRadiusY - scaledBorderWidth - borderOffset - scaledHalfBorderWidth / 2
  ).endFill();
  container.addChild(outerRing);
  container.addChild(outerRingMask);
  outerRing.mask = outerRingMask;
  container.addChild(innerRing);
  container.addChild(innerRingMask);
  innerRing.mask = innerRingMask;
  container.addChild(ringTexture);
  container.addChild(ringTextureMask);
  ringTexture.mask = ringTextureMask;
}
__name(drawBeveledBorder, "drawBeveledBorder");
function drawBorder(token, container, borderColor) {
  const graphics = new PIXI.Graphics();
  container.addChild(graphics);
  const tokenBorderWidth = getTokenBorderWidth(token);
  const isFilled = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FILL_TEXTURE);
  const borderOffset = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BORDER_OFFSET);
  const borderScale = getBorderScale();
  const frameOpacity = getFrameOpacity(token);
  const baseOpacity = getBaseOpacity(token);
  graphics.alpha = frameOpacity;
  if (game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CIRCLE_BORDERS)) {
    drawCircleBorder(token, borderColor, graphics, isFilled, tokenBorderWidth, borderOffset, borderScale, baseOpacity);
  } else if (isHexGrid()) {
    drawHexBorder(token, borderColor, graphics, isFilled, tokenBorderWidth, borderOffset, borderScale, baseOpacity);
  } else {
    drawSquareBorder(token, borderColor, graphics, isFilled, tokenBorderWidth, borderOffset, borderScale, baseOpacity);
  }
}
__name(drawBorder, "drawBorder");
function getTokenBorderWidth(token) {
  let tokenBorderWidth = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BORDER_WIDTH) || CONFIG.Canvas.objectBorderThickness;
  if (game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PERMANENT_BORDER) && token.controlled) {
    tokenBorderWidth *= 2;
  }
  return tokenBorderWidth;
}
__name(getTokenBorderWidth, "getTokenBorderWidth");
function getBorderScale() {
  const borderGridScale = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BORDER_GRID_SCALE);
  return borderGridScale ? canvas.dimensions?.size / 100 : 1;
}
__name(getBorderScale, "getBorderScale");
function getFrameOpacity(token) {
  let frameOpacity = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRAME_OPACITY) || 0.5;
  const customFrameOpacity = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY);
  if (customFrameOpacity && customFrameOpacity != 0.5) {
    frameOpacity = customFrameOpacity;
  }
  return frameOpacity;
}
__name(getFrameOpacity, "getFrameOpacity");
function getBaseOpacity(token) {
  let baseOpacity = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BASE_OPACITY) || 0.5;
  const customBaseOpacity = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY);
  if (customBaseOpacity && customBaseOpacity != 0.5) {
    baseOpacity = customBaseOpacity;
  }
  return baseOpacity;
}
__name(getBaseOpacity, "getBaseOpacity");
function isHexGrid() {
  const gridTypes = CONST.GRID_TYPES;
  const hexTypes = [gridTypes.HEXEVENQ, gridTypes.HEXEVENR, gridTypes.HEXODDQ, gridTypes.HEXODDR];
  return canvas.grid.isHexagonal || hexTypes.includes(canvas.grid?.type);
}
__name(isHexGrid, "isHexGrid");
function drawCircleBorder(token, borderColor, graphics, isFilled, borderWidth, borderOffset, borderScale, baseOpacity) {
  const { textureScaleX, textureScaleY } = getTextureScale(token);
  const scaledBorderWidth = borderWidth * borderScale;
  const scaledBorderHalfWidth = borderWidth * borderScale;
  const tokenCenterX = token.w / 2;
  const tokenCenterY = token.h / 2;
  const tokenBorderRadiusX = token.w * textureScaleX / 2;
  const tokenBorderRadiusY = token.h * textureScaleY / 2;
  if (isFilled) {
    graphics.beginFill(Color.from(borderColor.EX), baseOpacity).lineStyle(scaledBorderWidth, borderColor.EX, 0.8).drawEllipse(
      tokenCenterX,
      tokenCenterY,
      tokenBorderRadiusX - scaledBorderWidth - borderOffset,
      tokenBorderRadiusY - scaledBorderWidth - borderOffset
    ).beginTextureFill({
      texture: PIXI.Texture.EMPTY,
      color: borderColor.EX,
      alpha: baseOpacity
    }).endFill();
    graphics.beginFill(Color.from(borderColor.INT), baseOpacity).lineStyle(scaledBorderHalfWidth, Color.from(borderColor.INT), 1).drawEllipse(
      tokenCenterX,
      tokenCenterY,
      tokenBorderRadiusX - scaledBorderHalfWidth - scaledBorderWidth / 2 - borderOffset,
      tokenBorderRadiusY - scaledBorderHalfWidth - scaledBorderWidth / 2 - borderOffset
    ).beginTextureFill({
      texture: PIXI.Texture.EMPTY,
      color: Color.from(borderColor.INT),
      alpha: baseOpacity
    }).endFill();
  }
  graphics.lineStyle(scaledBorderWidth, borderColor.EX, 0.8).drawEllipse(
    tokenCenterX,
    tokenCenterY,
    tokenBorderRadiusX - scaledBorderWidth - borderOffset,
    tokenBorderRadiusY - scaledBorderWidth - borderOffset
  );
  graphics.lineStyle(scaledBorderHalfWidth, Color.from(borderColor.INT), 1).drawEllipse(
    tokenCenterX,
    tokenCenterY,
    tokenBorderRadiusX - scaledBorderHalfWidth - scaledBorderWidth / 2 - borderOffset,
    tokenBorderRadiusY - scaledBorderHalfWidth - scaledBorderWidth / 2 - borderOffset
  );
}
__name(drawCircleBorder, "drawCircleBorder");
function drawHexBorder(token, borderColor, graphics, fillTexture, tokenBorderWidth, borderOffset, borderScale, baseOpacity) {
  const { textureScaleX, textureScaleY } = getTextureScale(token);
  const { offsetX, offsetY } = getScaledOffsets(token, textureScaleX, textureScaleY);
  let polygon = token.getShape();
  polygon.points = polygon.points.map(
    (coord, index) => index % 2 === 0 ? coord * textureScaleX + offsetX : coord * textureScaleY + offsetY
  );
  if (fillTexture) {
    graphics.beginFill(Color.from(borderColor.EX), baseOpacity).lineStyle(tokenBorderWidth * borderScale, borderColor.EX, 0.8).drawPolygon(polygon).beginTextureFill({
      texture: PIXI.Texture.EMPTY,
      color: borderColor.EX,
      alpha: baseOpacity
    }).endFill();
    graphics.beginFill(Color.from(borderColor.INT), baseOpacity).lineStyle(tokenBorderWidth * borderScale / 2, Color.from(borderColor.INT), 1).drawPolygon(polygon).beginTextureFill({
      texture: PIXI.Texture.EMPTY,
      color: Color.from(borderColor.INT),
      alpha: baseOpacity
    }).endFill();
  }
  graphics.lineStyle(tokenBorderWidth * borderScale, borderColor.EX, 0.8).drawPolygon(polygon);
  graphics.lineStyle(tokenBorderWidth * borderScale / 2, Color.from(borderColor.INT), 1).drawPolygon(polygon);
}
__name(drawHexBorder, "drawHexBorder");
function drawSquareBorder(token, borderColor, graphics, fillTexture, tokenBorderWidth, borderOffset, borderScale, baseOpacity) {
  const { textureScaleX, textureScaleY } = getTextureScale(token);
  const { offsetX, offsetY } = getScaledOffsets(token, textureScaleX, textureScaleY);
  const tokenWidth = token.w * textureScaleX;
  const tokenHeight = token.h * textureScaleY;
  const halfBorderOffset = Math.round(borderOffset / 2);
  const halfBorderWidth = Math.round(tokenBorderWidth / 2);
  const quarterBorderWidth = Math.round(halfBorderWidth / 2);
  if (fillTexture) {
    graphics.beginFill(Color.from(borderColor.EX), baseOpacity).lineStyle(tokenBorderWidth * borderScale, borderColor.EX, 0.8).drawRoundedRect(
      offsetX - quarterBorderWidth - halfBorderOffset,
      offsetY - quarterBorderWidth - halfBorderOffset,
      tokenWidth + halfBorderWidth - borderOffset,
      tokenHeight + halfBorderWidth - borderOffset,
      3
    ).beginTextureFill({
      texture: PIXI.Texture.EMPTY,
      color: borderColor.EX,
      alpha: baseOpacity
    }).endFill();
    graphics.beginFill(Color.from(borderColor.INT), baseOpacity).lineStyle(halfBorderWidth * borderScale, Color.from(borderColor.INT), 1).drawRoundedRect(
      offsetX - quarterBorderWidth - halfBorderOffset,
      offsetY - quarterBorderWidth - halfBorderOffset,
      tokenWidth + halfBorderWidth - borderOffset,
      tokenHeight + halfBorderWidth - borderOffset,
      3
    ).beginTextureFill({
      texture: PIXI.Texture.EMPTY,
      color: Color.from(borderColor.INT),
      alpha: baseOpacity
    }).endFill();
  }
  graphics.lineStyle(tokenBorderWidth * borderScale, borderColor.EX, 0.8).drawRoundedRect(
    offsetX - quarterBorderWidth - halfBorderOffset,
    offsetY - quarterBorderWidth - halfBorderOffset,
    tokenWidth + halfBorderWidth - borderOffset,
    tokenHeight + halfBorderWidth - borderOffset,
    3
  );
  graphics.lineStyle(halfBorderWidth * borderScale, Color.from(borderColor.INT), 1).drawRoundedRect(
    offsetX - quarterBorderWidth - halfBorderOffset,
    offsetY - quarterBorderWidth - halfBorderOffset,
    tokenWidth + halfBorderWidth - borderOffset,
    tokenHeight + halfBorderWidth - borderOffset,
    3
  );
}
__name(drawSquareBorder, "drawSquareBorder");
function _drawGradient(token, color, bevelGradient2) {
  const bg = new PIXI.Sprite(bevelGradient2);
  bg.anchor.set(0, 0);
  bg.width = token.w;
  bg.height = token.h;
  bg.tint = color;
  return bg;
}
__name(_drawGradient, "_drawGradient");
function _drawTexture(token, color, bevelTexture2) {
  const bg = new PIXI.Sprite(bevelTexture2);
  bg.anchor.set(0, 0);
  bg.width = token.w;
  bg.height = token.h;
  bg.tint = color;
  return bg;
}
__name(_drawTexture, "_drawTexture");
function colorBorderFaction(token) {
  const colorFrom = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.COLOR_FROM);
  let color;
  if (colorFrom === "token-disposition") {
    const disposition = TokenFactions.dispositionKey(token);
    if (disposition) {
      color = TokenFactions.defaultColors[disposition];
    }
  } else if (colorFrom === "advanced-factions") {
    const borderColor = AdvancedFactions.getBorderColor(token);
    if (borderColor) return borderColor;
    // Fallback if something fails
    // return overrides.NEUTRAL; (Removed to avoid ReferenceError, falling through to default logic)
  } else if (colorFrom === "actor-folder-color") {
    if (token.actor && token.actor.folder && token.actor.folder) {
      color = token.actor.folder.color;
    }
  } else {
    const disposition = TokenFactions.dispositionKey(token);
    if (disposition) {
      color = game.settings.get(CONSTANTS.MODULE_ID, `custom-${disposition}-color`);
    }
  }
  const overrides = {
    CONTROLLED: {
      INT: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR)),
      EX: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR_EX)),
      INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR)),
      EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR_EX))
    },
    FRIENDLY: {
      INT: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR)),
      EX: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX)),
      INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR)),
      EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX))
    },
    NEUTRAL: {
      INT: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR)),
      EX: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX)),
      INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR)),
      EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX))
    },
    HOSTILE: {
      INT: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR)),
      EX: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR_EX)),
      INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR)),
      EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR_EX))
    },
    PARTY: {
      INT: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR)),
      EX: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR_EX)),
      INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR)),
      EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR_EX))
    },
    ACTOR_FOLDER_COLOR: {
      INT: Color.fromString(color ? String(color) : CONSTANTS.DEFAULTS.ACTOR_FOLDER_COLOR_EX),
      EX: Color.fromString(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.ACTOR_FOLDER_COLOR_EX)),
      INT_S: color ? String(color) : CONSTANTS.DEFAULTS.ACTOR_FOLDER_COLOR_EX,
      EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.ACTOR_FOLDER_COLOR_EX))
    }
  };
  const isBorderCustom = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_BORDER) || false;
  if (isBorderCustom) {
    const customColorInt = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_INT);
    const customColorExt = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_EXT);
    return {
      INT: Color.fromString(String(customColorInt)),
      EX: Color.fromString(String(customColorExt)),
      INT_S: String(customColorInt),
      EX_S: String(customColorExt)
    };
  } else if (colorFrom === "token-disposition") {
    const disPath = CONST.TOKEN_DISPOSITIONS;
    const disposition = parseInt(token.document.disposition);
    let borderColor = new FactionBorderGraphics();
    if (!game.user?.isGM && token.isOwner) {
      borderColor = overrides.CONTROLLED;
    } else if (token.actor?.hasPlayerOwner) {
      borderColor = overrides.PARTY;
    } else if (disposition === disPath.FRIENDLY) {
      borderColor = overrides.FRIENDLY;
    } else if (disposition === disPath.NEUTRAL) {
      borderColor = overrides.NEUTRAL;
    } else {
      borderColor = overrides.HOSTILE;
    }
    return borderColor;
  } else if (colorFrom === "actor-folder-color") {
    return overrides.ACTOR_FOLDER_COLOR;
  } else {
    Logger.debug(`No color found for token ${token.document.name}`);
    return overrides.ACTOR_FOLDER_COLOR;
  }
}
__name(colorBorderFaction, "colorBorderFaction");
function getTextureScale(token) {
  return game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.SCALE_BORDER) ? {
    textureScaleX: token.document.texture.scaleX,
    textureScaleY: token.document.texture.scaleY
  } : { textureScaleX: 1, textureScaleY: 1 };
}
__name(getTextureScale, "getTextureScale");
function getScaledOffsets(token, textureScaleX, textureScaleY) {
  return game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.SCALE_BORDER) ? {
    offsetX: token.w * (1 - textureScaleX) / 2,
    offsetY: token.h * (1 - textureScaleY) / 2
  } : { offsetX: 0, offsetY: 0 };
}
__name(getScaledOffsets, "getScaledOffsets");
const _TokenFaction = class _TokenFaction {
  // static TOKEN_FACTIONS_FRAME_STYLE = {
  //   FLAT: "flat",
  //   BELEVELED: "beveled",
  //   BORDER: "border",
  // };
  constructor(token) {
    Logger.debug("Creating token's faction for %s", token.name);
    token.faction = this;
    this.token = token;
    this.container = token.addChildAt(this.createTokenContainer(), 0);
    drawBorderFaction(token);
  }
  updateToken() {
    if (!this.token) {
      Logger.warn("No token was setup");
      return;
    }
    if (!(this.token instanceof Token)) {
      Logger.warn("Token is not a Token instance");
      return;
    }
    Logger.debug("Updating token %s", this.token.document.name);
    drawBorderFaction(this.token);
  }
  createTokenContainer() {
    const container = new PIXI.Container();
    container.name = CONSTANTS.MODULE_ID;
    return container;
  }
  destroy() {
    Logger.debug("Destroying token's faction for %s", this.token.name);
    this.token.removeChild(this.container);
    this.container.destroy();
    this.token.faction = null;
    this.token = null;
  }
};
__name(_TokenFaction, "TokenFaction");
let TokenFaction = _TokenFaction;
const _TokenFactions = class _TokenFactions {
  static async onInit() {
    _TokenFactions.defaultColors = {
      "party-member": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR),
      //'#33bc4e',
      "party-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR),
      //'#33bc4e',
      "friendly-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR),
      //'#43dfdf',
      "neutral-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR),
      //'#f1d836',
      "hostile-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR),
      //'#e72124',
      "controlled-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR),
      "neutral-external-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX),
      "friendly-external-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX),
      "hostile-external-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR_EX),
      "controlled-external-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR_EX),
      "party-external-member": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR_EX),
      "party-external-npc": game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR_EX)
    };
    _TokenFactions.dispositions = Object.keys(_TokenFactions.defaultColors);
    await initTexture();
  }
  static setupTokens(canvas2) {
    Logger.debug("Setup tokens");
    canvas2.tokens.placeables.forEach((token) => {
      _TokenFactions.setupFactionForToken(token);
    });
  }
  static updateTokenFolder(tokenFolder) {
    Logger.debug("Updating folder");
    const tokens = canvas.tokens?.placeables;
    for (const token of tokens) {
      if (token.actor?.folder?.id === tokenFolder.id) {
        token.faction.updateToken();
      }
    }
  }
  static async updateAllTokens() {
    Logger.debug("Updating all tokens");
    canvas.tokens.placeables.forEach((token) => {
      token?.faction?.updateToken();
    });
  }
  static setupFactionForToken(token) {
    Logger.debug("Setting up faction for token %s", token.name);
    const faction = new TokenFaction(token);
    return faction;
  }
  // START NEW MANAGE
  static _clamp(value, max, min) {
    return Math.min(Math.max(value, min), max);
  }
  static _componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  static _rgbToHex(A) {
    if (A[0] === void 0 || A[1] === void 0 || A[2] === void 0) {
      Logger.error("RGB color invalid");
    }
    return "#" + _TokenFactions._componentToHex(A[0]) + _TokenFactions._componentToHex(A[1]) + _TokenFactions._componentToHex(A[2]);
  }
  static _hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  static _interpolateColor(color1, color2, factor) {
    if (arguments.length < 3) {
      factor = 0.5;
    }
    const result = color1.slice();
    for (let i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
  }
  // My function to interpolate between two colors completely, returning an array
  static _interpolateColors(color1, color2, steps) {
    const stepFactor = 1 / (steps - 1);
    const interpolatedColorArray = [];
    color1 = color1.match(/\d+/g).map(Number);
    color2 = color2.match(/\d+/g).map(Number);
    for (let i = 0; i < steps; i++) {
      interpolatedColorArray.push(_TokenFactions._interpolateColor(color1, color2, stepFactor * i));
    }
    return interpolatedColorArray;
  }
};
__name(_TokenFactions, "TokenFactions");
__publicField(_TokenFactions, "TOKEN_FACTIONS_FRAME_STYLE", {
  FLAT: "flat",
  BELEVELED: "beveled",
  BORDER: "border"
});
__publicField(_TokenFactions, "dispositionKey", (token) => {
  const dispositionValue = parseInt(String(token.document.disposition), 10);
  let disposition;
  if (token.actor && token.actor.hasPlayerOwner && token.actor.type === "character") {
    disposition = "party-member";
  } else if (token.actor && token.actor.hasPlayerOwner) {
    disposition = "party-npc";
  } else if (dispositionValue === 1) {
    disposition = "friendly-npc";
  } else if (dispositionValue === 0) {
    disposition = "neutral-npc";
  } else if (dispositionValue === -1) {
    disposition = "hostile-npc";
  }
  return disposition;
});
__publicField(_TokenFactions, "defaultColors");
__publicField(_TokenFactions, "dispositions");
let TokenFactions = _TokenFactions;
function cleanUpString(stringToCleanUp) {
  const regex = /[^A-Za-z0-9]/g;
  if (stringToCleanUp) {
    return Logger.i18n(stringToCleanUp).replace(regex, "").toLowerCase();
  } else {
    return stringToCleanUp;
  }
}
__name(cleanUpString, "cleanUpString");
function isStringEquals(stringToCheck1, stringToCheck2, startsWith = false) {
  if (stringToCheck1 && stringToCheck2) {
    const s1 = cleanUpString(stringToCheck1) ?? "";
    const s2 = cleanUpString(stringToCheck2) ?? "";
    if (startsWith) {
      return s1.startsWith(s2) || s2.startsWith(s1);
    } else {
      return s1 === s2;
    }
  } else {
    return stringToCheck1 === stringToCheck2;
  }
}
__name(isStringEquals, "isStringEquals");
function isRealNumber(inNumber) {
  return !isNaN(inNumber) && typeof inNumber === "number" && isFinite(inNumber);
}
__name(isRealNumber, "isRealNumber");
function isRealBoolean(inBoolean) {
  return String(inBoolean) === "true" || String(inBoolean) === "false";
}
__name(isRealBoolean, "isRealBoolean");
const API = {
  async disableDrawBorderFactionsFromTokens(tokenIdsOrNames) {
    for (const tokenIdOrName of tokenIdsOrNames) {
      this.disableDrawBorderFactionsFromToken(tokenIdOrName);
    }
  },
  async disableDrawBorderFactionsFromToken(tokenIdOrName) {
    const token = canvas.tokens?.placeables.find((t) => {
      return isStringEquals(t.id, tokenIdOrName) || isStringEquals(t.name, tokenIdOrName);
    });
    if (!token) {
      Logger.warn(`No token is been found with reference '${tokenIdOrName}'`, true);
      return;
    }
    await token.document.setFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE_BORDER, true);
  },
  async enableDrawBorderFactionsFromTokens(tokenIdsOrNames) {
    for (const tokenIdOrName of tokenIdsOrNames) {
      this.enableDrawBorderFactionsFromToken(tokenIdOrName);
    }
  },
  async enableDrawBorderFactionsFromToken(tokenIdOrName) {
    const token = canvas.tokens?.placeables.find((t) => {
      return isStringEquals(t.id, tokenIdOrName) || isStringEquals(t.name, tokenIdOrName);
    });
    if (!token) {
      Logger.warn(`No token is been found with reference '${tokenIdOrName}'`, true);
      return;
    }
    await token.document.setFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE_BORDER, false);
  },
  async retrieveBorderFactionsColorFromToken(tokenIdOrName, ignoreSkipDraw = false) {
    const token = canvas.tokens?.placeables.find((t) => {
      return isStringEquals(t.id, tokenIdOrName) || isStringEquals(t.name, tokenIdOrName);
    });
    const factionGraphicDefaultS = "#000000";
    if (!token) {
      Logger.warn(`No token is been found with reference '${tokenIdOrName}'`, true);
      return factionGraphicDefaultS;
    }
    const borderColor = colorBorderFaction(token);
    if (!borderColor) {
      return factionGraphicDefaultS;
    }
    if (!borderColor.INT || Number.isNaN(borderColor.INT)) {
      return factionGraphicDefaultS;
    }
    switch (game.settings.get(CONSTANTS.MODULE_ID, "removeBorders")) {
      case "0": {
        break;
      }
      case "1": {
        if (!token.isOwner) {
          return factionGraphicDefaultS;
        }
        break;
      }
      case "2": {
        return factionGraphicDefaultS;
      }
    }
    let skipDraw;
    try {
      skipDraw = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE_BORDER);
    } catch (e) {
      await token.document.setFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE_BORDER, false);
      skipDraw = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE_BORDER);
    }
    if (skipDraw && !ignoreSkipDraw) {
      return factionGraphicDefaultS;
    }
    return borderColor.INT_S;
  },
  clearGridFactionArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw Logger.error("clearGridFactionArr | inAttributes must be of type array");
    }
    const [tokenId] = inAttributes;
    this.clearGridFaction(tokenId);
  },
  getDisposition(actorA, actorB) {
    // Delegate to AdvancedFactions
    // Assuming AdvancedFactions is globally available or imported in this scope
    // In module.js lines 1-100 it is imported: import { AdvancedFactions, ... }
    return AdvancedFactions.getDisposition(actorA, actorB);
  }
};
const handleRenderHUD = /* @__PURE__ */ __name((app, html, data) => {
  const colorFrom = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.COLOR_FROM);
  if (colorFrom === "advanced-factions") {
    AdvancedFactions.renderTokenHUD(app, html);
  } else {
    addBorderToggle(app, html, data);
  }
}, "handleRenderHUD");
function addBorderToggle(app, html, data) {
  if (!game.user?.isGM) {
    return;
  }
  if (!game.settings.get(CONSTANTS.MODULE_ID, "hudEnable")) {
    return;
  }
  if (!app?.object?.document) {
    return;
  }
  const factionDisableFlag = app.object.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE_BORDER);
  const borderButton = `
    <div class="control-icon factionBorder ${factionDisableFlag ? "active" : ""}"
      title="Toggle Faction Border"> <i class="fas fa-angry"></i>
    </div>`;
  const settingHudColClass = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HUD_COLUMN) ?? "right";
  const settingHudTopBottomClass = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HUD_TOP_BOTTOM) ?? "bottom";
  const buttonPos = "." + settingHudColClass.toLowerCase();
  const col = html.find(buttonPos);
  if (settingHudTopBottomClass.toLowerCase() === "top") {
    col.prepend(borderButton);
  } else {
    col.append(borderButton);
  }
  html.find(".factionBorder").click(toggleBorder.bind(app));
  html.find(".factionBorder").contextmenu(toggleCustomBorder.bind(app));
}
__name(addBorderToggle, "addBorderToggle");
async function toggleBorder(event) {
  const borderIsDisabled = this.object.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE_BORDER);
  for (const token of canvas.tokens?.controlled) {
    try {
      await token.document.setFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE_BORDER, !borderIsDisabled);
      token.refresh();
    } catch (e) {
      Logger.error(e);
    }
  }
  event.currentTarget.classList.toggle("active", !borderIsDisabled);
}
__name(toggleBorder, "toggleBorder");
async function toggleCustomBorder(event) {
  const tokenTmp = this.object;
  const currentCustomColorTokenInt = tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_INT) || "#000000";
  const currentCustomColorTokenExt = tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_EXT) || "#000000";
  const currentCustomColorTokenFrameOpacity = tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY) || 0.5;
  const currentCustomColorTokenBaseOpacity = tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY) || 0.5;
  const dialogContent = `
    <div class="form-group">
      <label>${Logger.i18n("token-factions.tokeconfig.customColorInt")}</label>
      <input type="color"
        value="${currentCustomColorTokenInt}"
        data-edit="token-factions.currentCustomColorTokenInt"></input>
    </div>
    <div class="form-group">
      <label>${Logger.i18n("token-factions.tokeconfig.customColorExt")}</label>
      <input type="color"
        value="${currentCustomColorTokenExt}"
        data-edit="token-factions.currentCustomColorTokenExt"></input>
    </div>
    <div class="form-group">
      <label>${Logger.i18n("token-factions.tokeconfig.customFrameOpacity")}</label>
      <input type="number"
        min="0" max="1" step="0.1"
        value="${currentCustomColorTokenFrameOpacity}"
        data-edit="token-factions.currentCustomColorTokenFrameOpacity"></input>
    </div>
    <div class="form-group">
      <label>${Logger.i18n("token-factions.tokeconfig.customBaseOpacity")}</label>
      <input type="number"
        min="0" max="1" step="0.1"
        value="${currentCustomColorTokenBaseOpacity}"
        data-edit="token-factions.currentCustomColorTokenBaseOpacity"></input>
    </div>
    `;
  const d = new Dialog({
    title: Logger.i18n("token-factions.label.chooseCustomColorToken"),
    content: dialogContent,
    buttons: {
      yes: {
        label: Logger.i18n("token-factions.label.applyCustomColor"),
        callback: async (html) => {
          const newCurrentCustomColorTokenInt = $(
            html.find(`input[data-edit='token-factions.currentCustomColorTokenInt']`)[0]
          ).val();
          const newCurrentCustomColorTokenExt = $(
            html.find(`input[data-edit='token-factions.currentCustomColorTokenExt']`)[0]
          ).val();
          const newCurrentCustomColorTokenFrameOpacity = $(
            html.find(`input[data-edit='token-factions.currentCustomColorTokenFrameOpacity']`)[0]
          ).val();
          const newCurrentCustomColorTokenBaseOpacity = $(
            html.find(`input[data-edit='token-factions.currentCustomColorTokenBaseOpacity']`)[0]
          ).val();
          for (const token of canvas.tokens?.controlled) {
            token.document.setFlag(
              CONSTANTS.MODULE_ID,
              CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_INT,
              newCurrentCustomColorTokenInt
            );
            token.document.setFlag(
              CONSTANTS.MODULE_ID,
              CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_EXT,
              newCurrentCustomColorTokenExt
            );
            token.document.setFlag(
              CONSTANTS.MODULE_ID,
              CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY,
              newCurrentCustomColorTokenFrameOpacity
            );
            token.document.setFlag(
              CONSTANTS.MODULE_ID,
              CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY,
              newCurrentCustomColorTokenBaseOpacity
            );
          }
        }
      },
      no: {
        label: Logger.i18n("token-factions.label.doNothing"),
        callback: (html) => {
        }
      }
    },
    default: "no"
  });
  d.render(true);
}
__name(toggleCustomBorder, "toggleCustomBorder");
const injectConfig = {
  inject: /* @__PURE__ */ __name(function injectConfig2(app, html, data, object) {
    this._generateTabStruct(app, html, data, object);
    const tabSize = data.tab?.width ?? 100;
    object = object || app.object;
    const moduleId = data.moduleId;
    let injectPoint;
    if (typeof data.inject === "string") {
      injectPoint = html.find(data.inject).first().closest(".form-group");
    } else {
      injectPoint = data.inject;
    }
    injectPoint = injectPoint ? $(injectPoint) : data.tab ? html.find("form > .tab").last() : html.find(".form-group").last();
    let injectHtml = "";
    for (const [k, v] of Object.entries(data)) {
      if (k === "moduleId" || k === "inject" || k === "tab")
        continue;
      const elemData = data[k];
      const flag = "flags." + moduleId + "." + (k || "");
      const flagValue = object?.getFlag(moduleId, k) ?? elemData.default ?? getDefaultFlag(k);
      const notes = v.notes ? `<p class="notes">${v.notes}</p>` : "";
      v.label = v.units ? v.label + `<span class="units"> (${v.units})</span>` : v.label;
      switch (elemData.type) {
        case "text":
          injectHtml += `<div class="form-group">
                        <label for="${k}">${v.label || ""}</label>
                            <input type="text" name="${flag}" ${elemData.dType ? `data-dtype="${elemData.dType}"` : ""} value="${flagValue}" placeholder="${v.placeholder || ""}">${notes}
                    </div>`;
          break;
        case "number":
          injectHtml += `<div class="form-group">
                        <label for="${k}">${v.label || ""}</label>
                            <input type="number" name="${flag}" min="${v.min}" max="${v.max}" step="${v.step ?? 1}" value="${flagValue}" placeholder="${v.placeholder || ""}">${notes}
                    </div>`;
          break;
        case "checkbox":
          injectHtml += `<div class="form-group">
                        <label for="${k}">${v.label || ""}</label>
                            <input type="checkbox" name="${flag}" ${flagValue ? "checked" : ""}>${notes}
                    </div>`;
          break;
        case "select":
          injectHtml += `<div class="form-group">
                        <label for="${k}">${v.label || ""}</label>
                            <select name="${flag}" ${elemData.dType ? `data-dtype="${elemData.dType}"` : ""}>`;
          for (const [i, j] of Object.entries(v.options)) {
            injectHtml += `<option value="${i}" ${flagValue == i ? "selected" : ""}>${j}</option>`;
          }
          injectHtml += `</select>${notes}
                    </div>`;
          break;
        case "range":
          injectHtml += `<div class="form-group">
                        <label for="${k}">${v.label || ""}</label>
                        <div class="form-fields">
                            <input type="range" name="${flag}" value="${flagValue}" min="${v.min}" max="${v.max}" step="${v.step ?? 1}">
                            <span class="range-value">${flagValue}</span>${notes}
                        </div>
                    </div>`;
          break;
        case "color":
          injectHtml += `<div class="form-group">
                        <label for="${k}">${v.label || ""}</label>
                        <div class="form-fields">
                            <input class="color" type="text" name="${flag}" value="${flagValue}">
                            <input type="color" data-edit="${flag}" value="${flagValue}">
                        </div>
                        ${notes}
                    </div>`;
          break;
        case "custom":
          injectHtml += v.html;
          break;
      }
      if (elemData.type?.includes("filepicker")) {
        const fpType = elemData.type.split(".")[1] || "imagevideo";
        injectHtml += `<div class="form-group">
                <label for="${k}">${v.label || ""}</label>
                <div class="form-fields">     
                    <button type="button" class="file-picker" data-extras="${elemData.fpTypes ? elemData.fpTypes.join(",") : ""}" data-type="${fpType}" data-target="${flag}" title="Browse Files" tabindex="-1">
                        <i class="fas fa-file-import fa-fw"></i>
                    </button>
                    <input class="image" type="text" name="${flag}" placeholder="${v.placeholder || ""}" value="${flagValue}">
                </div>${notes}
            </div>`;
      }
    }
    injectHtml = $(injectHtml);
    injectHtml.on("click", ".file-picker", this.fpTypes, _bindFilePicker);
    injectHtml.on("change", `input[type="color"]`, _colorChange);
    if (data.tab) {
      const injectTab = createTab(data.tab.name, data.tab.label, data.tab.icon).append(injectHtml);
      injectPoint.after(injectTab);
      app?.setPosition({
        height: "auto",
        width: data.tab ? app.options.width + tabSize : "auto"
      });
      return injectHtml;
    }
    injectPoint.after(injectHtml);
    if (app)
      app?.setPosition({
        height: "auto",
        width: data.tab ? app.options.width + tabSize : null
      });
    return injectHtml;
    function createTab(name, label, icon) {
      const tabs = html.find(".sheet-tabs").first().find(".item").last();
      const tab = `<a class="item" data-tab="${name}"><i class="${icon}"></i> ${label}</a>`;
      tabs.after(tab);
      const tabContainer = `<div class="tab" data-tab="${name}"></div>`;
      return $(tabContainer);
    }
    __name(createTab, "createTab");
    function getDefaultFlag(inputType) {
      switch (inputType) {
        case "number":
          return 0;
        case "checkbox":
          return false;
      }
      return "";
    }
    __name(getDefaultFlag, "getDefaultFlag");
    function _colorChange(e) {
      const input = $(e.target);
      const edit = input.data("edit");
      const value = input.val();
      injectHtml.find(`input[name="${edit}"]`).val(value);
    }
    __name(_colorChange, "_colorChange");
    function _bindFilePicker(event) {
      event.preventDefault();
      const button = event.currentTarget;
      const input = $(button).closest(".form-fields").find("input") || null;
      const extraExt = button.dataset.extras ? button.dataset.extras.split(",") : [];
      const options = {
        field: input[0],
        type: button.dataset.type,
        current: input.val() || null,
        button
      };
      const fp = new FilePicker(options);
      fp.extensions ? fp.extensions.push(...extraExt) : fp.extensions = extraExt;
      return fp.browse();
    }
    __name(_bindFilePicker, "_bindFilePicker");
  }, "injectConfig"),
  quickInject: /* @__PURE__ */ __name(function quickInject(injectData, data) {
    injectData = Array.isArray(injectData) ? injectData : [injectData];
    for (const doc of injectData) {
      let newData = data;
      if (doc.inject) {
        newData = JSON.parse(JSON.stringify(data));
        data.inject = doc.inject;
      }
      Hooks.on(`render${doc.documentName}Config`, (app, html) => {
        injectConfig.inject(app, html, newData);
      });
    }
  }, "quickInject"),
  _generateTabStruct: /* @__PURE__ */ __name(function _generateTabStruct(app, html, data, object) {
    const isTabs = html.find(".sheet-tabs").length;
    const useTabs = data.tab;
    if (isTabs || !useTabs)
      return;
    const tabSize = data.tab?.width || 100;
    const layer = app?.object?.layer?.options?.name;
    const icon = $(".main-controls").find(`li[data-canvas-layer="${layer}"]`).find("i").attr("class");
    const $tabs = $(`<nav class="sheet-tabs tabs">
        <a class="item active" data-tab="basic"><i class="${icon}"></i> ${game.i18n.localize("LIGHT.HeaderBasic")}</a>
        </nav>
        <div class="tab active" data-tab="basic"></div>`);
    const form = html.find("form").first();
    form.children().each((i, e) => {
      $($tabs[2]).append(e);
    });
    form.append($tabs);
    const submitButton = html.find("button[type='submit']").first();
    form.append(submitButton);
    html.on("click", ".item", (e) => {
      html.find(".item").removeClass("active");
      $(e.currentTarget).addClass("active");
      html.find(".tab").removeClass("active");
      html.find(`[data-tab="${e.currentTarget.dataset.tab}"]`).addClass("active");
      app.setPosition({
        height: "auto",
        width: data.tab ? app.options.width + tabSize : "auto"
      });
    });
  }, "_generateTabStruct")
};
const renderTokenConfig = /* @__PURE__ */ __name(async function (config, html) {
  renderTokenConfigHandler(config, html);
}, "renderTokenConfig");
async function renderTokenConfigHandler(tokenConfig, html) {
  if (!html) {
    return;
  }
  injectConfig.inject(
    tokenConfig,
    html,
    {
      moduleId: CONSTANTS.MODULE_ID,
      tab: {
        name: CONSTANTS.MODULE_ID,
        label: Logger.i18n("token-factions.tokeconfig.factions"),
        icon: "fas fa-user-circle"
      }
    },
    tokenConfig.object
  );
  const posTab = html.find(`.tab[data-tab="${CONSTANTS.MODULE_ID}"]`);
  const tokenFlags = tokenConfig.options.sheetConfig ? tokenConfig.object.flags ? tokenConfig.object.flags[CONSTANTS.MODULE_ID] || {} : {} : tokenConfig.token.flags ? tokenConfig.token.flags[CONSTANTS.MODULE_ID] || {} : {};
  const data = {
    disableBorder: isRealBoolean(tokenFlags[CONSTANTS.FLAGS.FACTION_DISABLE_BORDER]) ? Boolean(tokenFlags[CONSTANTS.FLAGS.FACTION_DISABLE_BORDER]) : false,
    customBorder: isRealBoolean(tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_BORDER]) ? Boolean(tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_BORDER]) : false,
    customColorInt: tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_INT] || game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR),
    customColorExt: tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_EXT] || game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR_EX),
    customFrameOpacity: isRealNumber(tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY]) ? tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY] : game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRAME_OPACITY),
    customBaseOpacity: isRealNumber(tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY]) ? tokenFlags[CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY] : game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BASE_OPACITY),
    team: tokenFlags[CONSTANTS.FLAGS.FACTION_TEAM] || "",
    teams: AdvancedFactions.getTeams()
  };
  const insertHTML = await renderTemplate(`modules/${CONSTANTS.MODULE_ID}/templates/token-config.html`, data);
  posTab.append(insertHTML);
}
__name(renderTokenConfigHandler, "renderTokenConfigHandler");
function handelRenderSettingsConfig(app, el, data) {
  const neutralColor = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR);
  const friendlyColor = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR);
  const hostileColor = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR);
  const controlledColor = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR);
  const partyColor = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR);
  const neutralColorEx = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX);
  const friendlyColorEx = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX);
  const hostileColorEx = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOSTILE_COLOR_EX);
  const controlledColorEx = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CONTROLLED_COLOR_EX);
  const partyColorEx = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.PARTY_COLOR_EX);
  const actorFolderColorEx = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.ACTOR_FOLDER_COLOR_EX);
  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.NEUTRAL_COLOR}"]`).parent().append(
    `<input type="color" value="${neutralColor}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.NEUTRAL_COLOR}">`
  );
  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.FRIENDLY_COLOR}"]`).parent().append(
    `<input type="color" value="${friendlyColor}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.FRIENDLY_COLOR}">`
  );
  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.HOSTILE_COLOR}"]`).parent().append(
    `<input type="color" value="${hostileColor}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.HOSTILE_COLOR}">`
  );
  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.CONTROLLED_COLOR}"]`).parent().append(
    `<input type="color" value="${controlledColor}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.CONTROLLED_COLOR}">`
  );
  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.PARTY_COLOR}"]`).parent().append(
    `<input type="color" value="${partyColor}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.PARTY_COLOR}">`
  );
  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX}"]`).parent().append(
    `<input type="color" value="${neutralColorEx}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX}">`
  );
  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX}"]`).parent().append(
    `<input type="color" value="${friendlyColorEx}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX}">`
  );
  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.HOSTILE_COLOR_EX}"]`).parent().append(
    `<input type="color" value="${hostileColorEx}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.HOSTILE_COLOR_EX}">`
  );
  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.CONTROLLED_COLOR_EX}"]`).parent().append(
    `<input type="color" value="${controlledColorEx}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.CONTROLLED_COLOR_EX}">`
  );
  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.PARTY_COLOR_EX}"]`).parent().append(
    `<input type="color" value="${partyColorEx}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.PARTY_COLOR_EX}">`
  );
  el.find(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.ACTOR_FOLDER_COLOR_EX}"]`).parent().append(
    `<input type="color" value="${actorFolderColorEx}" data-edit="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.ACTOR_FOLDER_COLOR_EX}">`
  );
}
__name(handelRenderSettingsConfig, "handelRenderSettingsConfig");
const initHooks = /* @__PURE__ */ __name(async () => {
  await TokenFactions.onInit();
  AdvancedFactions.init();
  Hooks.on("renderSettingsConfig", handelRenderSettingsConfig);
  Hooks.on("closeSettingsConfig", (token, data) => {
  });
  Hooks.on("updateSetting", (setting) => {
    if (setting.key.startsWith(CONSTANTS.MODULE_ID)) {
      Logger.debug(`Faction settings changed. Key: ${setting.key} to ${setting.value}`);
      TokenFactions.updateAllTokens();
    }
  });
  Hooks.on("renderTokenConfig", renderTokenConfig);
  Hooks.on("canvasReady", (canvas2) => {
    TokenFactions.setupTokens(canvas2);
  });
  Hooks.on("createToken", (tokenDocument) => {
    // Vérifier que le token est rendu avant de configurer la faction
    if (tokenDocument.object) {
      TokenFactions.setupFactionForToken(tokenDocument.object);
    }
  });
  Hooks.on("updateToken", (tokenDocument, changes) => {
    // Vérifier que le token est rendu avant d'accéder à ses propriétés
    if (shouldUpdateToken(changes) && tokenDocument.object && tokenDocument.object.faction) {
      tokenDocument.object.faction.updateToken();
    }
  });
  Hooks.on("destroyToken", (token) => {
    if (token?.faction) {
      token.faction.destroy();
    }
  });
  Hooks.on("updateFolder", (tokenData, changes) => {
    if (changes.color) {
      Logger.debug(`Folder color changed, updating tokens in ${tokenData.name}`);
      TokenFactions.updateTokenFolder(tokenData);
    }
  });
  Hooks.on("renderTokenHUD", handleRenderHUD);
  Hooks.on("refreshToken", (token, options) => {
    if (token.faction) {
      if (options.refreshBorder || options.refreshVisibility) {
        token.faction.updateToken();
      }
    }
  });
  Hooks.on("getActorDirectoryFolderContext", (html, options) => {
    AdvancedFactions.addFolderContextOptions(html, options);
  });
  Hooks.on("renderCombatTracker", (app, html, data) => {
    if (!game.settings.get(CONSTANTS.MODULE_ID, "enableCombatColoring")) return;

    // Iterate over combatants
    html.find(".combatant").each((i, el) => {
      const li = $(el);
      const combatantId = li.data("combatant-id");
      const combatant = app.viewed.combatants.get(combatantId);
      if (!combatant) return;

      const actor = combatant.actor;
      if (!actor) return;

      // Use AdvancedFactions to get Team
      const teamId = AdvancedFactions._getTeam(actor);
      if (!teamId) return;

      const team = AdvancedFactions.getTeams().find(t => t.id === teamId);
      if (team && team.color) {
        // Apply border style
        li.css("border-left", `4px solid ${team.color}`);
        li.css("border-right", `4px solid ${team.color}`);
        li.find(".token-initiative a").css("color", team.color);
      }
    });
  });
}, "initHooks");
const setupHooks = /* @__PURE__ */ __name(async () => {
  game.modules.get(CONSTANTS.MODULE_ID).api = API;
}, "setupHooks");
function shouldUpdateToken(data) {
  return foundry.utils.hasProperty(data, "flags") || foundry.utils.hasProperty(data, "height") || foundry.utils.hasProperty(data, "width");
}
__name(shouldUpdateToken, "shouldUpdateToken");
Hooks.once("init", () => {
  console.log(`${CONSTANTS.MODULE_ID} | Initializing ${CONSTANTS.MODULE_ID}`);
  if (!game.modules.get("lib-wrapper")?.active && game.user?.isGM) {
    let word = "install and activate";
    if (game.modules.get("lib-wrapper"))
      word = "activate";
    throw Logger.error(`Requires the 'libWrapper' module. Please ${word} it.`);
  }
  registerSettings();
  game.settings.register(CONSTANTS.MODULE_ID, "enableCombatColoring", {
    name: "Enable Combat Tracker/Carousel Coloring",
    hint: "If enabled, Token Factions will colorize the Combat Tracker and Combat Carousel with Team Colors.",
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
    onChange: () => window.location.reload()
  });

  initHooks();
});
Hooks.once("setup", function () {
  setupHooks();
});
Hooks.once("ready", () => {
  // Check if coloring is enabled
  if (!game.settings.get(CONSTANTS.MODULE_ID, "enableCombatColoring")) return;

  // Combat Carousel Integration (combat-tracker-dock)
  if (CONFIG.combatTrackerDock && CONFIG.combatTrackerDock.CombatantPortrait) {
    const originalGetBorderColor = CONFIG.combatTrackerDock.CombatantPortrait.prototype.getBorderColor;
    CONFIG.combatTrackerDock.CombatantPortrait.prototype.getBorderColor = function (tokenDocument) {
      const actor = tokenDocument?.actor;
      if (actor) {
        const teamId = AdvancedFactions._getTeam(actor);
        if (teamId) {
          const team = AdvancedFactions.getTeams().find(t => t.id === teamId);
          if (team && team.color) return team.color;
        }
      }
      return originalGetBorderColor.call(this, tokenDocument);
    };

    const originalRenderInner = CONFIG.combatTrackerDock.CombatantPortrait.prototype.renderInner;
    CONFIG.combatTrackerDock.CombatantPortrait.prototype.renderInner = async function () {
      await originalRenderInner.call(this);

      // Thicker Border
      this.element.style.borderBottomWidth = "3px";

      // Match Icon Color
      const borderColor = this.element.style.borderBottomColor;
      if (borderColor) {
        // Color system icons (used for activation status in Lancer)
        const systemIcons = this.element.querySelectorAll(".system-icons .system-icon");
        systemIcons.forEach(icon => {
          icon.style.color = borderColor;
        });

        // Color standard initiative if present
        const initIcon = this.element.querySelector(".portrait-initiative i");
        if (initIcon) initIcon.style.color = borderColor;

        const initText = this.element.querySelector(".portrait-initiative-text");
        if (initText) initText.style.color = borderColor;
      }
    };
  }
});
//# sourceMappingURL=module.js.map
