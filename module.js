import { AdvancedFactions, TeamConfig, TF_DISPOSITIONS, TF_NO_TEAM, TF_RING_MODES, tfDisposition } from "./scripts/advanced-factions.js";
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
    HOVER_DISPOSITION_VISIBILITY: "always",
    HOVER_BRIGHTNESS: 0,
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
    HOVER_DISPOSITION_VISIBILITY: "hover-disposition-visibility",
    HOVER_BRIGHTNESS: "hover-brightness",
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
    label: `${CONSTANTS.MODULE_ID}.setting.reset.label`,
    hint: `${CONSTANTS.MODULE_ID}.setting.reset.hint`,
    icon: "fas fa-rotate-left",
    type: ResetSettingsDialog,
    restricted: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, "teams-enabled", {
    name: `${CONSTANTS.MODULE_ID}.setting.teams-enabled.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.teams-enabled.hint`,
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: () => {
      _refreshAllTokenBorders();
      ui.combat?.render();
    }
  });
  game.settings.register(CONSTANTS.MODULE_ID, "teams-migrated", {
    scope: "world",
    config: false,
    default: false,
    type: Boolean
  });
  game.settings.register(CONSTANTS.MODULE_ID, "opacity-migrated", {
    scope: "world",
    config: false,
    default: false,
    type: Boolean
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
      "advanced-factions": `${CONSTANTS.MODULE_ID}.setting.color-from.opt.team-color`
    }
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOVER_DISPOSITION_VISIBILITY, {
    name: "Selection outline color",
    hint: "When Foundry's hover and selection outline shows the disposition color. Otherwise it takes the ring color.",
    scope: "world",
    config: true,
    default: CONSTANTS.DEFAULTS.HOVER_DISPOSITION_VISIBILITY,
    type: String,
    choices: {
      "always": "Disposition, always",
      "combat": "Disposition in combat",
      "controlling": "Disposition while controlling a token",
      "combat-controlling": "Disposition in combat while controlling",
      "never": "Ring color, always"
    },
    onChange: () => _refreshAllTokenBorders()
  });
  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOVER_BRIGHTNESS, {
    name: "Brighten on hover",
    hint: "Percent added to the outline and ring of the token under the cursor. 0 is off.",
    scope: "world",
    config: true,
    default: CONSTANTS.DEFAULTS.HOVER_BRIGHTNESS,
    type: Number,
    range: { min: 0, max: 100, step: 5 },
    onChange: () => _refreshAllTokenBorders()
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
      0: "No tokens",
      1: "Tokens you don't own",
      2: "All tokens"
    },
    default: CONSTANTS.DEFAULTS.REMOVE_BORDERS,
    config: true
  });
  game.settings.register(CONSTANTS.MODULE_ID, "factionDefaultDraw", {
    name: "Show rings",
    hint: "For tokens left on World default in their Factions tab.",
    scope: "world",
    type: String,
    choices: {
      on: "Always",
      combat: "Only in combat",
      off: "Never"
    },
    default: "on",
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
    name: "Teams",
    label: "Configure Teams",
    hint: "Team names, colors and relations.",
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
  bevelGradient = await (foundry?.canvas?.loadTexture ?? loadTexture)(`modules/${CONSTANTS.MODULE_ID}/assets/bevel-gradient.jpg`);
  bevelTexture = await (foundry?.canvas?.loadTexture ?? loadTexture)(`modules/${CONSTANTS.MODULE_ID}/assets/bevel-texture.png`);
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
  const borderColor = _maybeBrightenForHover(token, colorBorderFaction(token));
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
function _factionFlagState(token) {
  const v = token?.document?.getFlag?.(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE_BORDER);
  if (v === "on") return "on";
  if (v === "combat") return "combat";
  if (v === "off" || v === true) return "off";
  return "default";
}
__name(_factionFlagState, "_factionFlagState");
function _isAnyCombatActive() {
  if (game.combat) return true;
  const active = game.combats?.active;
  if (active) return true;
  const any = game.combats?.contents?.some?.(c => c.active);
  return !!any;
}
__name(_isAnyCombatActive, "_isAnyCombatActive");
function _factionResolveState(state) {
  if (state === "on") return true;
  if (state === "off") return false;
  if (state === "combat") return _isAnyCombatActive();
  return null;
}
__name(_factionResolveState, "_factionResolveState");
function _factionShouldDraw(token) {
  const s = _factionFlagState(token);
  if (s !== "default") return _factionResolveState(s);
  let worldDefault;
  try { worldDefault = game.settings.get(CONSTANTS.MODULE_ID, "factionDefaultDraw"); }
  catch { worldDefault = "on"; }
  if (worldDefault === true) worldDefault = "on";
  else if (worldDefault === false) worldDefault = "off";
  const resolved = _factionResolveState(worldDefault);
  return resolved === null ? true : resolved;
}
__name(_factionShouldDraw, "_factionShouldDraw");
function _isHoverDispositionVisible() {
  let mode;
  try { mode = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOVER_DISPOSITION_VISIBILITY); }
  catch { return true; }
  if (mode === "always") return true;
  if (mode === "never") return false;
  const inCombat = !!game.combat?.started;
  const hasControlled = (canvas?.tokens?.controlled?.length ?? 0) > 0;
  if (mode === "combat") return inCombat;
  if (mode === "controlling") return hasControlled;
  if (mode === "combat-controlling") return inCombat && hasControlled;
  return true;
}
__name(_isHoverDispositionVisible, "_isHoverDispositionVisible");
function _refreshAllTokenBorders() {
  for (const token of canvas?.tokens?.placeables ?? []) {
    try { token.faction?.updateToken?.(); } catch { /* ignore */ }
    try { token.renderFlags?.set?.({ refreshBorder: true }); } catch { /* ignore */ }
  }
}
__name(_refreshAllTokenBorders, "_refreshAllTokenBorders");
function _hoverBrightnessPct() {
  try { return Number(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOVER_BRIGHTNESS)) || 0; }
  catch { return 0; }
}
__name(_hoverBrightnessPct, "_hoverBrightnessPct");
function _brightenColor(value, pct) {
  const t = Math.max(0, Math.min(100, pct)) / 100;
  if (t === 0) return value;
  const c = Color.from(value);
  const r = c.r + (1 - c.r) * t;
  const g = c.g + (1 - c.g) * t;
  const b = c.b + (1 - c.b) * t;
  return Color.fromRGB([r, g, b]);
}
__name(_brightenColor, "_brightenColor");
function _maybeBrightenForHover(token, borderColor) {
  if (!borderColor || !token?.hover || token.controlled) return borderColor;
  const pct = _hoverBrightnessPct();
  if (pct <= 0) return borderColor;
  return {
    INT: _brightenColor(borderColor.INT, pct),
    EX: _brightenColor(borderColor.EX, pct),
    INT_S: borderColor.INT_S,
    EX_S: borderColor.EX_S
  };
}
__name(_maybeBrightenForHover, "_maybeBrightenForHover");
function _refreshFactionBordersOnCombatChange() {
  let worldDefault;
  try { worldDefault = game.settings.get(CONSTANTS.MODULE_ID, "factionDefaultDraw"); }
  catch { worldDefault = "on"; }
  if (worldDefault === true) worldDefault = "on";
  else if (worldDefault === false) worldDefault = "off";
  const worldUsesCombat = worldDefault === "combat";
  for (const token of canvas?.tokens?.placeables ?? []) {
    const s = _factionFlagState(token);
    if (s === "combat" || (s === "default" && worldUsesCombat)) {
      try { token.faction?.updateToken?.(); } catch (e) { /* ignore */ }
      try { token.renderFlags?.set?.({ refreshBorder: true }); } catch (e) { /* ignore */ }
    }
  }
}
__name(_refreshFactionBordersOnCombatChange, "_refreshFactionBordersOnCombatChange");
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
  return !_factionShouldDraw(token);
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
  if (_isSetValue(customFrameOpacity)) {
    frameOpacity = Number(customFrameOpacity);
  }
  return frameOpacity;
}
__name(getFrameOpacity, "getFrameOpacity");
function getBaseOpacity(token) {
  let baseOpacity = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BASE_OPACITY) || 0.5;
  const customBaseOpacity = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY);
  if (_isSetValue(customBaseOpacity)) {
    baseOpacity = Number(customBaseOpacity);
  }
  return baseOpacity;
}
__name(getBaseOpacity, "getBaseOpacity");
function _isSetValue(value) {
  return value !== undefined && value !== null && value !== "" && !Number.isNaN(Number(value));
}
__name(_isSetValue, "_isSetValue");
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
  const rawColorFrom = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.COLOR_FROM);
  const colorFrom = rawColorFrom === "advanced-factions" && !AdvancedFactions.teamsEnabled() ? "token-disposition" : rawColorFrom;
  const isBorderCustom = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_CUSTOM_BORDER) || false;
  let color;
  if (colorFrom === "token-disposition") {
    const disposition = TokenFactions.dispositionKey(token);
    if (disposition) {
      color = TokenFactions.defaultColors[disposition];
    }
  } else if (colorFrom === "advanced-factions" && !isBorderCustom) {
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
globalThis.__tokenFactionsHelpers = {
  colorBorderFaction,
  isHoverDispositionVisible: _isHoverDispositionVisible,
  hoverBrightnessPct: _hoverBrightnessPct,
  brightenColor: _brightenColor
};
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
    // v13: insert right before detectionFilterMesh so silhouette filter
    // still renders on top, and voidMesh stays put for LOS black-out.
    const c = this.createTokenContainer();
    const dfmIdx = token.children.indexOf(token.detectionFilterMesh);
    this.container = dfmIdx >= 0 ? token.addChildAt(c, dfmIdx) : token.addChild(c);
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
    container.zIndex = -1000;
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
    await token.document.setFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE_BORDER, "off");
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
    await token.document.setFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.FACTION_DISABLE_BORDER, "on");
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
    if (!ignoreSkipDraw && !_factionShouldDraw(token)) {
      return factionGraphicDefaultS;
    }
    return borderColor.INT_S;
  },
  // Pure color lookup, no draw-gate filtering. Honors all `color-from` modes
  // and the per-token custom-border flag.
  getFactionColor(tokenIdOrName) {
    const token = canvas.tokens?.placeables.find((t) => {
      return isStringEquals(t.id, tokenIdOrName) || isStringEquals(t.name, tokenIdOrName);
    });
    if (!token) {
      return null;
    }
    const c = colorBorderFaction(token);
    if (!c) {
      return null;
    }
    return { INT_S: c.INT_S, EX_S: c.EX_S };
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
  },
  teamsEnabled() {
    return AdvancedFactions.teamsEnabled();
  },
  getTeam(tokenOrActor) {
    return AdvancedFactions.teamsEnabled() ? AdvancedFactions._getTeam(tokenOrActor) : null;
  },
  getTeams() {
    return AdvancedFactions.teamsEnabled() ? AdvancedFactions.getTeams() : [];
  }
};
const handleRenderHUD = /* @__PURE__ */ __name((app, htmlOrEl) => {
  AdvancedFactions.renderTokenHUD(app, htmlOrEl);
}, "handleRenderHUD");
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
    const isV13Nav = html.find('a[data-action="tab"]').length > 0;
    injectPoint = injectPoint ? $(injectPoint) : data.tab ? (isV13Nav ? html.find('section.tab[data-group="sheet"]').last() : html.find("form > .tab").last()) : html.find(".form-group").last();
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
      const isV13 = html.find('a[data-action="tab"]').length > 0;
      if (isV13) {
        const isActive = app?.tabGroups?.sheet === name;
        const tabContainer = `<section class="tab${isActive ? ' active' : ''}" data-tab="${name}" data-group="sheet" data-application-part="${name}"></section>`;
        return $(tabContainer);
      }
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
const renderTokenConfig = /* @__PURE__ */ __name(async function (app, htmlOrEl, _context, options) {
  const el = typeof htmlOrEl?.querySelector === "function" ? htmlOrEl : htmlOrEl?.[0];
  if (!el) return;
  const isV13 = !!el.querySelector('a[data-action="tab"]');
  if (isV13) {
    if (!options?.isFirstRender) return;
    if (el.querySelector(`div.tab[data-tab="${CONSTANTS.MODULE_ID}"]`)) return;
    const tokenDocOrProto = app.token ?? app.document ?? app.object ?? {};
    const state = _factionTabState(tokenDocOrProto);
    const body = await foundry.applications.handlebars.renderTemplate(TF_TAB_TEMPLATE, _buildFactionTabData(tokenDocOrProto, state));
    const isActive = app?.tabGroups?.sheet === CONSTANTS.MODULE_ID;
    const section = `<div class="tab${isActive ? ' active' : ''}" data-group="sheet" data-tab="${CONSTANTS.MODULE_ID}">${body}</div>`;
    const lastTab = [...el.querySelectorAll('.tab')].pop();
    if (lastTab) lastTab.insertAdjacentHTML('afterend', section);
    _wireFactionTab(el.querySelector(`div.tab[data-tab="${CONSTANTS.MODULE_ID}"]`), tokenDocOrProto, state);
    return;
  }
  renderTokenConfigHandler(app, $(el));
}, "renderTokenConfig");
const TF_TAB_TEMPLATE = `modules/${CONSTANTS.MODULE_ID}/templates/token-config.html`;
function _factionTabState(tokenDocOrProto) {
  const flags = tokenDocOrProto.flags?.[CONSTANTS.MODULE_ID] || {};
  const raw = flags[CONSTANTS.FLAGS.FACTION_DISABLE_BORDER];
  let border = "default";
  if (raw === "on" || raw === "combat") border = raw;
  else if (raw === "off" || raw === true) border = "off";
  const frame = flags[CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY];
  const base = flags[CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY];
  return {
    team: (tokenDocOrProto.documentName === "Token" ? AdvancedFactions._getTeam(tokenDocOrProto) : null) || flags[CONSTANTS.FLAGS.FACTION_TEAM] || "",
    border,
    custom: String(flags[CONSTANTS.FLAGS.FACTION_CUSTOM_BORDER]) === "true",
    colorIn: flags[CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_INT] || "",
    colorOut: flags[CONSTANTS.FLAGS.FACTION_CUSTOM_COLOR_EXT] || "",
    frameSet: _isSetValue(frame),
    frame: _isSetValue(frame) ? Number(frame) : Number(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.FRAME_OPACITY)),
    baseSet: _isSetValue(base),
    base: _isSetValue(base) ? Number(base) : Number(game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.BASE_OPACITY)),
    chooser: false,
    overrides: false
  };
}
__name(_factionTabState, "_factionTabState");
function _factionTabRing(tokenDocOrProto, state, team) {
  const read = (key) => game.settings.get(CONSTANTS.MODULE_ID, key);
  if (state.custom && state.colorIn) return { inner: state.colorIn, outer: state.colorOut || "#000000" };
  const colorFrom = read(CONSTANTS.SETTINGS.COLOR_FROM);
  if (team && colorFrom === "advanced-factions") return { inner: team.color, outer: team.colorEx || "#000000" };
  if (colorFrom === "actor-folder-color") {
    const actor = tokenDocOrProto.actor ?? tokenDocOrProto.parent;
    return { inner: actor?.folder?.color?.css ?? actor?.folder?.color ?? "#ffffff", outer: read(CONSTANTS.SETTINGS.ACTOR_FOLDER_COLOR_EX) };
  }
  const disposition = Number(tokenDocOrProto.disposition ?? 0);
  if (disposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY) return { inner: read(CONSTANTS.SETTINGS.FRIENDLY_COLOR), outer: read(CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX) };
  if (disposition === CONST.TOKEN_DISPOSITIONS.HOSTILE) return { inner: read(CONSTANTS.SETTINGS.HOSTILE_COLOR), outer: read(CONSTANTS.SETTINGS.HOSTILE_COLOR_EX) };
  if (disposition === CONST.TOKEN_DISPOSITIONS.SECRET) return { inner: Color.from(CONFIG.Canvas.dispositionColors.SECRET).css, outer: "#000000" };
  return { inner: read(CONSTANTS.SETTINGS.NEUTRAL_COLOR), outer: read(CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX) };
}
__name(_factionTabRing, "_factionTabRing");
function _buildFactionTabData(tokenDocOrProto, state) {
  const teamsEnabled = AdvancedFactions.teamsEnabled();
  const teams = AdvancedFactions.getTeams();
  const found = teamsEnabled ? teams.find(entry => entry.id === state.team) ?? null : null;
  const matrix = AdvancedFactions.getMatrix();
  const others = found ? teams.filter(other => other.id !== found.id) : [];
  const inLane = (value) => others.filter(other => AdvancedFactions.relation(found.id, other.id, matrix) === value);
  const team = found ? {
    id: found.id,
    name: found.name,
    color: found.color,
    colorEx: found.colorEx || "#000000",
    def: tfDisposition(found.gmDisposition),
    stance: TF_DISPOSITIONS.map(entry => ({ key: entry.key, count: inLane(entry.value).length })).filter(slice => slice.count > 0)
  } : null;
  const relations = found ? TF_DISPOSITIONS.map(entry => ({
    ...entry,
    teams: inLane(entry.value).map(other => ({ name: other.name, color: other.color, colorEx: other.colorEx || "#000000" }))
  })).filter(lane => lane.teams.length > 0) : [];
  const chooser = teamsEnabled && state.chooser ? [
    { id: TF_NO_TEAM, name: "No team", none: true, on: !found },
    ...teams.map(entry => ({ id: entry.id, name: entry.name, color: entry.color, colorEx: entry.colorEx || "#000000", on: entry.id === state.team }))
  ] : null;
  const overrides = (state.custom ? 1 : 0) + (state.frameSet ? 1 : 0) + (state.baseSet ? 1 : 0);
  const circle = !!game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.CIRCLE_BORDERS);
  const hex = !circle && !!canvas?.grid?.isHexagonal;
  return {
    teamsEnabled,
    state,
    team,
    chooser,
    relations,
    ringModes: TF_RING_MODES.map(mode => ({ value: mode.value, label: mode.label, on: mode.value === state.border })),
    image: tokenDocOrProto.texture?.src || "icons/svg/mystery-man.svg",
    ring: _factionTabRing(tokenDocOrProto, state, found),
    shapeCircle: circle,
    shapeHex: hex,
    shapeSquare: !circle && !hex,
    overridesLabel: overrides ? `${overrides} set` : "None set",
    frameLabel: Number(state.frame).toFixed(2),
    baseLabel: Number(state.base).toFixed(2),
    dispositionColors: AdvancedFactions.dispositionCssVars()
  };
}
__name(_buildFactionTabData, "_buildFactionTabData");
function _wireFactionTab(section, tokenDocOrProto, state) {
  if (!section) return;
  const rerender = async () => {
    section.innerHTML = await foundry.applications.handlebars.renderTemplate(TF_TAB_TEMPLATE, _buildFactionTabData(tokenDocOrProto, state));
  };
  section.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tf-action]");
    if (!button) return;
    const action = button.dataset.tfAction;
    if (action === "editRelations") {
      new TeamConfig({ selectedTeam: state.team }).render(true);
      return;
    }
    if (action === "chooser") {
      state.chooser = !state.chooser;
    } else if (action === "team") {
      state.team = button.dataset.teamId;
      state.chooser = false;
      const team = AdvancedFactions.getTeams().find(entry => entry.id === state.team);
      const field = section.closest("form")?.elements?.namedItem("disposition");
      if (team && field) {
        field.value = String(Number(team.gmDisposition));
        field.dispatchEvent(new Event("change", { bubbles: true }));
      }
    } else if (action === "border") {
      state.border = button.dataset.value;
    } else {
      return;
    }
    rerender();
  });
  section.addEventListener("change", (event) => {
    const field = event.target.dataset?.tfField;
    if (!field) return;
    if (field === "frame" || field === "base") {
      state[field] = Number(event.target.value);
      return;
    }
    if (field === "custom") {
      state.custom = event.target.checked;
      if (state.custom && !state.colorIn) {
        const team = AdvancedFactions.teamsEnabled() ? AdvancedFactions.getTeams().find(entry => entry.id === state.team) : null;
        const ring = _factionTabRing(tokenDocOrProto, { ...state, custom: false }, team);
        state.colorIn = ring.inner;
        state.colorOut = ring.outer;
      }
    } else if (field === "frameSet" || field === "baseSet") {
      state[field] = event.target.checked;
    } else if (field === "colorIn" || field === "colorOut") {
      state[field] = event.target.value;
    }
    rerender();
  });
  section.addEventListener("input", (event) => {
    const field = event.target.dataset?.tfField;
    if (field !== "frame" && field !== "base") return;
    state[field] = Number(event.target.value);
    const label = section.querySelector(`[data-tf-label="${field}"]`);
    if (label) label.textContent = state[field].toFixed(2);
  });
  section.addEventListener("toggle", (event) => {
    if (event.target.matches?.("details.tf-overrides")) state.overrides = event.target.open;
  }, true);
}
__name(_wireFactionTab, "_wireFactionTab");
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
  const tokenDocOrProto = tokenConfig.object ?? tokenConfig.token ?? tokenConfig.document ?? {};
  const state = _factionTabState(tokenDocOrProto);
  const insertHTML = await foundry.applications.handlebars.renderTemplate(TF_TAB_TEMPLATE, _buildFactionTabData(tokenDocOrProto, state));
  posTab.append(insertHTML);
  _wireFactionTab(posTab[0], tokenDocOrProto, state);
}
__name(renderTokenConfigHandler, "renderTokenConfigHandler");
function handelRenderSettingsConfig(app, htmlOrEl, data) {
  const el = htmlOrEl instanceof HTMLElement ? $(htmlOrEl) : htmlOrEl;
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
  el.on("input change", `input[type="color"][data-edit]`, (ev) => {
    const key = ev.currentTarget.dataset.edit;
    const text = el.find(`input[name="${key}"]`);
    if (text.length) text.val(ev.currentTarget.value).trigger("change");
  });
  el.on("input change", `input[type="text"][name^="${CONSTANTS.MODULE_ID}."]`, (ev) => {
    const v = ev.currentTarget.value;
    if (!/^#[0-9a-f]{6}$/i.test(v)) return;
    const key = ev.currentTarget.name;
    const picker = el.find(`input[type="color"][data-edit="${key}"]`);
    if (picker.length) picker.val(v);
  });
  _groupModuleSettings(el[0]);
}
__name(handelRenderSettingsConfig, "handelRenderSettingsConfig");
const SETTINGS_LAYOUT = [
  ["teams", ["teams-enabled", "menu:team-config", "enableCombatColoring"]],
  ["ring", [CONSTANTS.SETTINGS.COLOR_FROM, "factionDefaultDraw", CONSTANTS.SETTINGS.REMOVE_BORDERS]],
  ["ringColors", [CONSTANTS.SETTINGS.FRIENDLY_COLOR, CONSTANTS.SETTINGS.NEUTRAL_COLOR, CONSTANTS.SETTINGS.HOSTILE_COLOR, CONSTANTS.SETTINGS.PARTY_COLOR, CONSTANTS.SETTINGS.CONTROLLED_COLOR, CONSTANTS.SETTINGS.ACTOR_FOLDER_COLOR_EX]],
  ["ringLook", [CONSTANTS.SETTINGS.FRAME_STYLE, CONSTANTS.SETTINGS.FRAME_OPACITY, CONSTANTS.SETTINGS.BORDER_WIDTH, CONSTANTS.SETTINGS.PERMANENT_BORDER, CONSTANTS.SETTINGS.BORDER_OFFSET, CONSTANTS.SETTINGS.BORDER_GRID_SCALE, CONSTANTS.SETTINGS.SCALE_BORDER, CONSTANTS.SETTINGS.CIRCLE_BORDERS, CONSTANTS.SETTINGS.FILL_TEXTURE, CONSTANTS.SETTINGS.BASE_OPACITY, "borderUnderSpriteOnHover"]],
  ["outline", [CONSTANTS.SETTINGS.HOVER_DISPOSITION_VISIBILITY, CONSTANTS.SETTINGS.HOVER_BRIGHTNESS]],
  ["hud", [CONSTANTS.SETTINGS.HUD_ENABLE, CONSTANTS.SETTINGS.HUD_COLUMN, CONSTANTS.SETTINGS.HUD_TOP_BOTTOM]],
  ["other", [`menu:${CONSTANTS.SETTINGS.RESET}`, CONSTANTS.SETTINGS.DEBUG]]
];
const SETTINGS_COLOR_PAIRS = [
  [CONSTANTS.SETTINGS.FRIENDLY_COLOR, CONSTANTS.SETTINGS.FRIENDLY_COLOR_EX],
  [CONSTANTS.SETTINGS.NEUTRAL_COLOR, CONSTANTS.SETTINGS.NEUTRAL_COLOR_EX],
  [CONSTANTS.SETTINGS.HOSTILE_COLOR, CONSTANTS.SETTINGS.HOSTILE_COLOR_EX],
  [CONSTANTS.SETTINGS.PARTY_COLOR, CONSTANTS.SETTINGS.PARTY_COLOR_EX],
  [CONSTANTS.SETTINGS.CONTROLLED_COLOR, CONSTANTS.SETTINGS.CONTROLLED_COLOR_EX]
];
function _groupModuleSettings(root) {
  const section = root?.querySelector?.(`section[data-category="${CONSTANTS.MODULE_ID}"]`);
  if (!section || section.dataset.tfGrouped) return;
  section.dataset.tfGrouped = "1";
  const groupOf = (key) => {
    const el = key.startsWith("menu:")
      ? section.querySelector(`button[data-key="${CONSTANTS.MODULE_ID}.${key.slice(5)}"]`)
      : section.querySelector(`[name="${CONSTANTS.MODULE_ID}.${key}"]`);
    return el?.closest(".form-group") ?? null;
  };
  for (const [inKey, exKey] of SETTINGS_COLOR_PAIRS) {
    const inGroup = groupOf(inKey);
    const exGroup = groupOf(exKey);
    const inFields = inGroup?.querySelector(".form-fields");
    const exFields = exGroup?.querySelector(".form-fields");
    if (!inFields || !exFields) continue;
    const side = (fields, labelKey) => {
      const wrap = document.createElement("label");
      wrap.className = "tf-swatch";
      wrap.append(...fields.childNodes);
      const span = document.createElement("span");
      span.textContent = game.i18n.localize(`${CONSTANTS.MODULE_ID}.setting.${labelKey}`);
      wrap.append(span);
      return wrap;
    };
    const inner = side(inFields, "inner");
    const outer = side(exFields, "outer");
    inFields.replaceChildren(inner, outer);
    inFields.classList.add("tf-pair");
    exGroup.remove();
  }
  const placed = new Set();
  const frag = document.createDocumentFragment();
  for (const [id, keys] of SETTINGS_LAYOUT) {
    const head = document.createElement("h4");
    head.className = "tf-settings-group";
    head.textContent = game.i18n.localize(`${CONSTANTS.MODULE_ID}.setting.group.${id}`);
    const hintKey = `${CONSTANTS.MODULE_ID}.setting.group.${id}Hint`;
    if (game.i18n.has(hintKey)) {
      const hint = document.createElement("span");
      hint.className = "tf-settings-group-hint";
      hint.textContent = game.i18n.localize(hintKey);
      head.append(hint);
    }
    frag.append(head);
    for (const key of keys) {
      const group = groupOf(key);
      if (!group || placed.has(group)) continue;
      placed.add(group);
      frag.append(group);
    }
  }
  for (const group of section.querySelectorAll(":scope > .form-group")) frag.append(group);
  section.append(frag);
  const teamRows = [groupOf("menu:team-config"), groupOf("enableCombatColoring")].filter(Boolean);
  const toggle = section.querySelector(`[name="${CONSTANTS.MODULE_ID}.teams-enabled"]`);
  const colorSelect = section.querySelector(`[name="${CONSTANTS.MODULE_ID}.${CONSTANTS.SETTINGS.COLOR_FROM}"]`);
  const sync = () => {
    const on = !!toggle?.checked;
    for (const row of teamRows) row.classList.toggle("tf-team-off", !on);
    const teamOption = colorSelect?.querySelector('option[value="advanced-factions"]');
    if (!teamOption) return;
    teamOption.disabled = !on;
    teamOption.hidden = !on;
    if (!on && colorSelect.value === "advanced-factions") colorSelect.value = "token-disposition";
  };
  toggle?.addEventListener("change", sync);
  sync();
}
__name(_groupModuleSettings, "_groupModuleSettings");
const initHooks = /* @__PURE__ */ __name(async () => {
  await TokenFactions.onInit();
  AdvancedFactions.init();
  const tabEntry = { id: CONSTANTS.MODULE_ID, label: Logger.i18n("token-factions.tokeconfig.factions"), icon: "fas fa-user-circle" };
  for (const c of [foundry.applications?.sheets?.TokenConfig, foundry.applications?.sheets?.PrototypeTokenConfig]) {
    if (c?.TABS?.sheet?.tabs && !c.TABS.sheet.tabs.some(t => t.id === tabEntry.id)) c.TABS.sheet.tabs.push(tabEntry);
  }
  Hooks.on("renderSettingsConfig", handelRenderSettingsConfig);
  Hooks.on("closeSettingsConfig", (token, data) => {
  });
  Hooks.on("updateSetting", (setting) => {
    if (setting.key.startsWith(CONSTANTS.MODULE_ID)) {
      Logger.debug(`Faction settings changed. Key: ${setting.key} to ${setting.value}`);
      _refreshAllTokenBorders();
    }
  });
  Hooks.on("renderTokenConfig", renderTokenConfig);
  Hooks.on("renderPrototypeTokenConfig", renderTokenConfig);
  Hooks.on("canvasReady", (canvas2) => {
    TokenFactions.setupTokens(canvas2);
  });
  Hooks.on("drawToken", (token) => {
    if (token && !token.faction) {
      TokenFactions.setupFactionForToken(token);
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
  Hooks.on("closeTokenHUD", () => AdvancedFactions.closeHudPalette());
  Hooks.on("updateToken", (tokenDoc, change, options, userId) => AdvancedFactions.syncLinkedPrototype(tokenDoc, change, userId));
  Hooks.on("createCombat", _refreshFactionBordersOnCombatChange);
  Hooks.on("deleteCombat", _refreshFactionBordersOnCombatChange);
  Hooks.on("combatStart", _refreshFactionBordersOnCombatChange);
  Hooks.on("updateCombat", _refreshFactionBordersOnCombatChange);
  Hooks.on("createCombatant", _refreshFactionBordersOnCombatChange);
  Hooks.on("deleteCombatant", _refreshFactionBordersOnCombatChange);
  Hooks.on("canvasReady", _refreshFactionBordersOnCombatChange);
  const _hoverVisRefresh = () => {
    const mode = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.HOVER_DISPOSITION_VISIBILITY);
    if (mode !== "always" && mode !== "never") _refreshAllTokenBorders();
  };
  Hooks.on("controlToken", _hoverVisRefresh);
  Hooks.on("createCombat", _hoverVisRefresh);
  Hooks.on("deleteCombat", _hoverVisRefresh);
  Hooks.on("combatStart", _hoverVisRefresh);
  Hooks.on("hoverToken", (token) => {
    if (_hoverBrightnessPct() <= 0) return;
    try { token.faction?.updateToken?.(); } catch { /* ignore */ }
    try { token.renderFlags?.set?.({ refreshBorder: true }); } catch { /* ignore */ }
  });
  Hooks.on("refreshToken", (token, options) => {
    if (token.faction) {
      if (options.refreshBorder || options.refreshVisibility) {
        token.faction.updateToken();
      }
    }
  });
  // v13 renamed the per-directory folder hook to a shared getFolderContextOptions, so filter to actors.
  Hooks.on("getFolderContextOptions", (app, options) => {
    if (app?.documentName !== "Actor") return;
    AdvancedFactions.addFolderContextOptions(app, options);
  });
  Hooks.on("getActorContextOptions", (app, options) => {
    AdvancedFactions.addEntryContextOptions(app, options);
  });
  Hooks.on("renderCombatTracker", (app, htmlOrEl, data) => {
    if (!game.settings.get(CONSTANTS.MODULE_ID, "enableCombatColoring") || !AdvancedFactions.teamsEnabled()) return;
    const html = htmlOrEl instanceof HTMLElement ? $(htmlOrEl) : htmlOrEl;

    // Iterate over combatants
    html.find(".combatant").each((i, el) => {
      const li = $(el);
      const combatantId = li.data("combatant-id");
      const combatant = app.viewed.combatants.get(combatantId);
      if (!combatant) return;

      // Prefer the placed token (combatant.token) over the actor
      // combatant.token is the TokenDocument. We need to check if we can get the object or just use the doc.
      // AdvancedFactions._getTeam handles documents.
      const target = combatant.token || combatant.actor;
      if (!target) return;

      // Use AdvancedFactions to get Team
      const teamId = AdvancedFactions._getTeam(target);
      if (!teamId) return;

      const team = AdvancedFactions.getTeams().find(t => t.id === teamId);
      if (team && team.color) {
        // Apply border style
        li.css("border-left", `6px solid ${team.color}`);
        li.css("border-right", `2px solid ${team.color}`);
        li.find(".token-initiative a").css("color", team.color);
      }
    });
  });

  // Unique hook to update combat tracker when team changes
  Hooks.on("updateToken", (tokenDoc, change, options, userId) => {
    if (!tokenDoc.inCombat) return;
    if (change.flags?.["token-factions"]?.team !== undefined) {
      ui.combat.render();
    }
  });

  Hooks.on("updateActor", (actor, change, options, userId) => {
    if (change.flags?.["token-factions"]?.team !== undefined) {
      ui.combat.render();
    }
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
    name: "Team colors in the combat tracker",
    hint: "Colors the combat tracker and carousel by team.",
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
    onChange: () => window.location.reload()
  });
  game.settings.register(CONSTANTS.MODULE_ID, "borderUnderSpriteOnHover", {
    name: "Keep ring under the art on hover",
    hint: "Foundry lifts it above the art on hover by default.",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    requiresReload: true
  });

  initHooks();

  // v13: native _refreshState sets border.zIndex = Infinity on hover, so the border
  // sorts AFTER voidMesh's ERASE and ends up drawn over the sprite. Override the
  // zIndex back below voidMesh so the border (and our faction overlay) stay behind.
  if (game.settings.get(CONSTANTS.MODULE_ID, "borderUnderSpriteOnHover")
      && game.modules.get("lib-wrapper")?.active && typeof libWrapper !== "undefined") {
    libWrapper.register(CONSTANTS.MODULE_ID, "Token.prototype._refreshState", function (wrapped, ...args) {
      const result = wrapped(...args);
      if (this.border) this.border.zIndex = -1;
      return result;
    }, "WRAPPER");
  }
});
Hooks.once("setup", function () {
  setupHooks();
});
Hooks.once("ready", async () => {
  if (!game.user?.isGM || game.settings.get(CONSTANTS.MODULE_ID, "opacity-migrated")) return;
  const keys = [CONSTANTS.FLAGS.FACTION_CUSTOM_FRAME_OPACITY, CONSTANTS.FLAGS.FACTION_CUSTOM_BASE_OPACITY];
  const legacyUnset = (value) => value !== undefined && (!value || Number(value) === 0.5);
  const clearUpdate = (flags, prefix) => {
    const update = {};
    for (const key of keys) {
      if (legacyUnset(flags?.[key])) update[`${prefix}flags.${CONSTANTS.MODULE_ID}.-=${key}`] = null;
    }
    return update;
  };
  const actorUpdates = [];
  for (const actor of game.actors) {
    const update = clearUpdate(actor.prototypeToken?.flags?.[CONSTANTS.MODULE_ID], "prototypeToken.");
    if (Object.keys(update).length) actorUpdates.push({ _id: actor.id, ...update });
  }
  if (actorUpdates.length) await Actor.updateDocuments(actorUpdates);
  for (const scene of game.scenes) {
    const tokenUpdates = [];
    for (const tokenDoc of scene.tokens) {
      const update = clearUpdate(tokenDoc.flags?.[CONSTANTS.MODULE_ID], "");
      if (Object.keys(update).length) tokenUpdates.push({ _id: tokenDoc.id, ...update });
    }
    if (tokenUpdates.length) await scene.updateEmbeddedDocuments("Token", tokenUpdates);
  }
  await game.settings.set(CONSTANTS.MODULE_ID, "opacity-migrated", true);
});
Hooks.once("ready", async () => {
  if (!game.user?.isGM || game.settings.get(CONSTANTS.MODULE_ID, "teams-migrated")) return;
  if (game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.COLOR_FROM) === "advanced-factions") {
    await game.settings.set(CONSTANTS.MODULE_ID, "teams-enabled", true);
  }
  await game.settings.set(CONSTANTS.MODULE_ID, "teams-migrated", true);
});
Hooks.once("ready", () => {
  // Check if coloring is enabled
  if (!game.settings.get(CONSTANTS.MODULE_ID, "enableCombatColoring")) return;

  // Combat Carousel Integration (combat-tracker-dock)
  if (CONFIG.combatTrackerDock && CONFIG.combatTrackerDock.CombatantPortrait) {
    const originalGetBorderColor = CONFIG.combatTrackerDock.CombatantPortrait.prototype.getBorderColor;
    CONFIG.combatTrackerDock.CombatantPortrait.prototype.getBorderColor = function (tokenDocument) {
      if (tokenDocument && AdvancedFactions.teamsEnabled()) {
        const teamId = AdvancedFactions._getTeam(tokenDocument);
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

