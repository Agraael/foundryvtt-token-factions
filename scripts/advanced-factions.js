/* global document, window, setTimeout, game, CONST, foundry, ui, FormApplication */

export const TF_DISPOSITIONS = [
    { value: 1, key: "f", label: "Friendly", short: "F" },
    { value: 0, key: "n", label: "Neutral", short: "N" },
    { value: -1, key: "h", label: "Hostile", short: "H" },
    { value: -2, key: "s", label: "Secret", short: "S" }
];
export const tfDisposition = (value) => TF_DISPOSITIONS.find(entry => entry.value === Number(value)) ?? TF_DISPOSITIONS[1];
export const TF_NO_TEAM = "none";
export const TF_RING_MODES = [
    { value: "default", label: "World default", icon: "fa-globe" },
    { value: "on", label: "Always", icon: "fa-eye" },
    { value: "combat", label: "In combat", icon: "fa-crosshairs" },
    { value: "off", label: "Never", icon: "fa-eye-slash" }
];

let tfHudPaletteToken = null;

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class TeamConfig extends HandlebarsApplicationMixin(ApplicationV2)
{
    static DEFAULT_OPTIONS = {
        id: "token-factions-team-config",
        tag: "form",
        classes: ["tf-team-config"],
        window: { title: "Team Configuration", icon: "fas fa-users-gear", resizable: true },
        position: { width: 820, height: "auto" },
        form: { handler: TeamConfig.#onSubmit, closeOnSubmit: true },
        actions: {
            addTeam: TeamConfig.#onAddTeam,
            selectTeam: TeamConfig.#onSelectTeam,
            setDefault: TeamConfig.#onSetDefault,
            setMembers: TeamConfig.#onSetMembers,
            setAll: TeamConfig.#onSetAll,
            toggleMirror: TeamConfig.#onToggleMirror,
            pickChip: TeamConfig.#onPickChip,
            dropOnLane: TeamConfig.#onDropOnLane,
            deleteTeam: TeamConfig.#onDeleteTeam,
            confirmDelete: TeamConfig.#onConfirmDelete,
            cancelDelete: TeamConfig.#onCancelDelete,
            turnOnTeams: TeamConfig.#onTurnOnTeams
        }
    };

    static PARTS = {
        form: {
            template: "modules/token-factions/templates/team-config.html",
            scrollable: [
                ".tf-team-list",
                ".tf-lane[data-lane='1'] .tf-lane-chips",
                ".tf-lane[data-lane='0'] .tf-lane-chips",
                ".tf-lane[data-lane='-1'] .tf-lane-chips",
                ".tf-lane[data-lane='-2'] .tf-lane-chips"
            ]
        }
    };

    #teams = [];
    #matrix = {};
    #selected = null;
    #pick = null;
    #pendingDelete = null;
    #removed = new Set();
    #mirror = true;
    #focusName = false;
    #dragTeam = null;
    #dragChip = null;

    constructor(options = {})
    {
        super(options);
        this.#teams = foundry.utils.deepClone(AdvancedFactions.getTeams()).map(team => ({
            ...team,
            colorEx: team.colorEx || "#000000",
            gmDisposition: Number(team.gmDisposition ?? 0)
        }));
        this.#matrix = foundry.utils.deepClone(AdvancedFactions.getMatrix()) ?? {};
        const wanted = options.selectedTeam;
        this.#selected = wanted && this.#teams.some(team => team.id === wanted) ? wanted : this.#teams[0]?.id ?? null;
        try
        {
            this.#mirror = globalThis.localStorage?.getItem("tf-mirror-pairs") !== "0";
        }
        catch
        {
            this.#mirror = true;
        }
    }

    #rel(viewerId, targetId)
    {
        return AdvancedFactions.relation(viewerId, targetId, this.#matrix);
    }

    #setRel(viewerId, targetId, value)
    {
        if (viewerId === targetId)
            return;
        this.#matrix[viewerId] ??= {};
        this.#matrix[viewerId][targetId] = value;
        if (this.#mirror)
        {
            this.#matrix[targetId] ??= {};
            this.#matrix[targetId][viewerId] = value;
        }
    }

    #current()
    {
        return this.#teams.find(team => team.id === this.#selected) ?? null;
    }

    async _prepareContext()
    {
        const teams = this.#teams;
        if (!teams.some(team => team.id === this.#selected))
            this.#selected = teams[0]?.id ?? null;
        const selected = this.#current();
        const stance = (id) => TF_DISPOSITIONS
            .map(entry => ({ key: entry.key, count: teams.filter(other => other.id !== id && this.#rel(id, other.id) === entry.value).length }))
            .filter(slice => slice.count > 0);
        const list = teams.map(team => ({
            id: team.id,
            name: team.name,
            color: team.color,
            colorEx: team.colorEx,
            selected: team.id === this.#selected,
            def: tfDisposition(team.gmDisposition),
            stance: stance(team.id)
        }));
        let lanes = [];
        let anyOneWay = false;
        if (selected)
        {
            const others = teams.filter(other => other.id !== selected.id);
            lanes = TF_DISPOSITIONS.map(entry =>
            {
                const chips = others.filter(other => this.#rel(selected.id, other.id) === entry.value).map(other =>
                {
                    const back = this.#rel(other.id, selected.id);
                    if (back !== entry.value)
                        anyOneWay = true;
                    return {
                        id: other.id,
                        name: other.name,
                        color: other.color,
                        colorEx: other.colorEx,
                        picked: other.id === this.#pick,
                        back: back === entry.value ? null : tfDisposition(back)
                    };
                });
                return { ...entry, chips, countLabel: chips.length === 1 ? "1 team" : `${chips.length} teams` };
            });
        }
        return {
            teamsEnabled: AdvancedFactions.teamsEnabled(),
            dispositionColors: AdvancedFactions.dispositionCssVars(),
            list,
            selected: selected ? {
                ...selected,
                defaults: TF_DISPOSITIONS.map(entry => ({ ...entry, on: entry.value === selected.gmDisposition })),
                members: TF_DISPOSITIONS.map(entry => ({ ...entry, on: entry.value === this.#rel(selected.id, selected.id) })),
                pendingDelete: this.#pendingDelete === selected.id
            } : null,
            lanes,
            anyOneWay,
            mirror: this.#mirror,
            picking: !!this.#pick
        };
    }

    async _onFirstRender(context, options)
    {
        await super._onFirstRender(context, options);
        const el = this.element;
        el.addEventListener("input", event => this.#onInput(event));
        el.addEventListener("keydown", event => this.#onKeyDown(event));
        el.addEventListener("mousedown", event => this.#onMouseDown(event));
        el.addEventListener("mouseup", () => this.#clearDraggable());
        el.addEventListener("dragstart", event => this.#onDragStart(event));
        el.addEventListener("dragover", event => this.#onDragOver(event));
        el.addEventListener("drop", event => this.#onDrop(event));
        el.addEventListener("dragend", () => this.#onDragEnd());
    }

    async _onRender(context, options)
    {
        await super._onRender(context, options);
        if (!this.#focusName)
            return;
        this.#focusName = false;
        const input = this.element.querySelector("input[data-team-name]");
        input?.focus();
        input?.select();
    }

    #onInput(event)
    {
        const target = event.target;
        const team = this.#current();
        if (!team)
            return;
        if ("teamName" in target.dataset)
        {
            team.name = target.value;
            for (const node of this.element.querySelectorAll(`[data-name-of="${team.id}"]`))
                node.textContent = team.name;
        }
        else if (target.dataset.teamColor)
        {
            const key = target.dataset.teamColor;
            team[key] = target.value;
            for (const node of this.element.querySelectorAll(`[data-chip-of="${team.id}"]`))
                node.style.setProperty(key === "color" ? "--ci" : "--ce", target.value);
            this.element.querySelector(`[data-preview="${key}"]`)?.setAttribute("stroke", target.value);
        }
    }

    #onKeyDown(event)
    {
        if (event.key === "Enter" && event.target.matches?.("input[type='text']"))
            event.preventDefault();
    }

    #move(id, value)
    {
        if (!this.#selected || !id)
            return;
        this.#setRel(this.#selected, id, value);
        this.#pick = null;
        this.render();
    }

    #onMouseDown(event)
    {
        const item = event.target.closest?.("[data-grip]")?.closest(".tf-team-item");
        if (item)
            item.draggable = true;
    }

    #clearDraggable()
    {
        for (const item of this.element.querySelectorAll(".tf-team-item[draggable='true']"))
            item.draggable = false;
    }

    #onDragStart(event)
    {
        const chip = event.target.closest?.(".tf-team-chip");
        if (chip)
        {
            this.#dragChip = chip.dataset.teamId;
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", this.#dragChip);
            return;
        }
        const item = event.target.closest?.(".tf-team-item");
        if (!item?.draggable)
            return;
        this.#dragTeam = item.dataset.teamId;
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", this.#dragTeam);
        item.classList.add("dragging");
    }

    #onDragOver(event)
    {
        if (this.#dragChip)
        {
            const lane = event.target.closest?.(".tf-lane");
            for (const other of this.element.querySelectorAll(".tf-lane.drop"))
            {
                if (other !== lane)
                    other.classList.remove("drop");
            }
            if (!lane)
                return;
            event.preventDefault();
            lane.classList.add("drop");
            return;
        }
        if (!this.#dragTeam)
            return;
        const item = event.target.closest?.(".tf-team-item");
        if (!item)
            return;
        event.preventDefault();
        const rect = item.getBoundingClientRect();
        const after = event.clientY > rect.top + rect.height / 2;
        for (const node of this.element.querySelectorAll(".drop-before, .drop-after"))
            node.classList.remove("drop-before", "drop-after");
        item.classList.add(after ? "drop-after" : "drop-before");
    }

    #onDrop(event)
    {
        if (this.#dragChip)
        {
            event.preventDefault();
            const lane = event.target.closest?.(".tf-lane");
            const id = this.#dragChip;
            this.#dragChip = null;
            if (lane)
                this.#move(id, Number(lane.dataset.lane));
            else
                this.render();
            return;
        }
        if (!this.#dragTeam)
            return;
        event.preventDefault();
        const item = event.target.closest?.(".tf-team-item");
        const id = this.#dragTeam;
        this.#dragTeam = null;
        if (item && item.dataset.teamId !== id)
            this.#reorder(id, item.dataset.teamId, item.classList.contains("drop-after"));
        this.render();
    }

    #onDragEnd()
    {
        if (!this.#dragChip && !this.#dragTeam)
            return;
        this.#dragChip = null;
        this.#dragTeam = null;
        this.render();
    }

    #reorder(id, targetId, after)
    {
        const from = this.#teams.findIndex(team => team.id === id);
        if (from < 0)
            return;
        const [moved] = this.#teams.splice(from, 1);
        let to = this.#teams.findIndex(team => team.id === targetId);
        if (to < 0)
        {
            this.#teams.splice(from, 0, moved);
            return;
        }
        if (after)
            to++;
        this.#teams.splice(to, 0, moved);
    }

    static #onAddTeam()
    {
        const id = foundry.utils.randomID();
        this.#teams.push({ id, name: "New Team", color: "#ffffff", colorEx: "#000000", gmDisposition: 0 });
        this.#selected = id;
        this.#pick = null;
        this.#pendingDelete = null;
        this.#focusName = true;
        this.render();
    }

    static #onSelectTeam(event, target)
    {
        this.#selected = target.dataset.teamId;
        this.#pick = null;
        this.#pendingDelete = null;
        this.render();
    }

    static #onSetDefault(event, target)
    {
        const team = this.#current();
        if (!team)
            return;
        team.gmDisposition = Number(target.dataset.value);
        this.render();
    }

    static #onSetMembers(event, target)
    {
        const id = this.#selected;
        if (!id)
            return;
        this.#matrix[id] ??= {};
        this.#matrix[id][id] = Number(target.dataset.value);
        this.render();
    }

    static #onSetAll(event, target)
    {
        const id = this.#selected;
        if (!id)
            return;
        const value = Number(target.dataset.value);
        for (const other of this.#teams)
            this.#setRel(id, other.id, value);
        this.#pick = null;
        this.render();
    }

    static #onToggleMirror()
    {
        this.#mirror = !this.#mirror;
        this.render();
        try
        {
            globalThis.localStorage?.setItem("tf-mirror-pairs", this.#mirror ? "1" : "0");
        }
        catch
        {
            return;
        }
    }

    static #onPickChip(event, target)
    {
        const id = target.dataset.teamId;
        this.#pick = this.#pick === id ? null : id;
        this.render();
    }

    static #onDropOnLane(event, target)
    {
        if (this.#pick)
            this.#move(this.#pick, Number(target.dataset.lane));
    }

    static #onDeleteTeam()
    {
        this.#pendingDelete = this.#selected;
        this.render();
    }

    static #onConfirmDelete()
    {
        const id = this.#pendingDelete;
        if (!id)
            return;
        this.#teams = this.#teams.filter(team => team.id !== id);
        delete this.#matrix[id];
        for (const row of Object.values(this.#matrix))
        {
            if (row)
                delete row[id];
        }
        this.#removed.add(id);
        this.#pendingDelete = null;
        this.#pick = null;
        this.#selected = this.#teams[0]?.id ?? null;
        this.render();
    }

    static #onCancelDelete()
    {
        this.#pendingDelete = null;
        this.render();
    }

    static async #onTurnOnTeams()
    {
        await game.settings.set("token-factions", "teams-enabled", true);
        this.render();
    }

    static async #onSubmit()
    {
        const teams = this.#teams.map(team => ({
            id: team.id,
            name: team.name,
            color: team.color,
            colorEx: team.colorEx || "#000000",
            gmDisposition: Number(team.gmDisposition)
        }));
        const matrix = {};
        for (const viewer of teams)
        {
            matrix[viewer.id] = {};
            for (const target of teams)
                matrix[viewer.id][target.id] = this.#rel(viewer.id, target.id);
        }
        await game.settings.set("token-factions", "team-setup", teams);
        await game.settings.set("token-factions", "disposition-matrix", matrix);
        for (const id of this.#removed)
            await AdvancedFactions._cleanupTeamReferences(id);
    }
}

export class TeamPicker extends HandlebarsApplicationMixin(ApplicationV2)
{
    static DEFAULT_OPTIONS = {
        classes: ["tf-team-picker"],
        window: { title: "Assign Team", icon: "fas fa-users" },
        position: { width: 300, height: "auto" },
        actions: {
            pick: TeamPicker.#onPick,
            apply: TeamPicker.#onApply
        }
    };

    static PARTS = {
        body: {
            template: "modules/token-factions/templates/team-picker.html",
            scrollable: [".tf-palette-list"]
        }
    };

    #actors = [];
    #label = "";
    #kind = "actor";
    #selected = null;
    #placed = true;
    #setDisposition = true;

    constructor(options = {})
    {
        super(options);
        this.#actors = options.actors ?? [];
        this.#label = options.label ?? "";
        this.#kind = options.kind ?? "actor";
    }

    static openFor({ actors, label, kind, anchor })
    {
        for (const app of foundry.applications.instances.values())
        {
            if (app instanceof TeamPicker)
                app.close();
        }
        const width = 300;
        const rect = anchor?.getBoundingClientRect?.();
        const position = { width };
        if (rect)
        {
            position.left = Math.max(8, rect.left - width - 12);
            position.top = Math.max(8, Math.min(rect.top - 40, window.innerHeight - 460));
        }
        const title = AdvancedFactions.teamsEnabled() ? "Assign Team" : "Set Disposition";
        return new TeamPicker({ actors, label, kind, position, window: { title } }).render({ force: true });
    }

    #currentValue()
    {
        const teamsOn = AdvancedFactions.teamsEnabled();
        const values = new Set(this.#actors.map(actor => (teamsOn
            ? AdvancedFactions._getTeam(actor) || TF_NO_TEAM
            : String(actor.prototypeToken?.disposition ?? 0))));
        return values.size === 1 ? [...values][0] : null;
    }

    async _prepareContext()
    {
        const teamsOn = AdvancedFactions.teamsEnabled();
        const current = this.#currentValue();
        if (this.#selected === null)
            this.#selected = current ?? (teamsOn ? TF_NO_TEAM : "0");
        const count = this.#actors.length;
        const placed = AdvancedFactions.placedTokensOf(this.#actors).length;
        const placedLabel = placed === 1 ? "1 placed token" : `${placed} placed tokens`;
        const sub = this.#kind === "folder"
            ? `Folder · ${count === 1 ? "1 actor" : `${count} actors`} · ${placedLabel}`
            : `Actor · ${placedLabel}`;
        const target = count === 1 ? this.#actors[0].name : `${count} actors`;
        return {
            teamsOn,
            dispositionColors: AdvancedFactions.dispositionCssVars(),
            icon: this.#kind === "folder" ? "fa-folder-open" : "fa-user",
            label: this.#label,
            sub,
            rows: AdvancedFactions.pickerRows(current).map(row => ({ ...row, selected: row.value === this.#selected })),
            placed: this.#placed,
            setDisposition: this.#setDisposition,
            applyLabel: `${teamsOn ? "Assign to" : "Set for"} ${target}`
        };
    }

    _onRender(context, options)
    {
        super._onRender(context, options);
        for (const input of this.element.querySelectorAll("[data-tf-option]"))
        {
            input.addEventListener("change", () =>
            {
                if (input.dataset.tfOption === "placed")
                    this.#placed = input.checked;
                else
                    this.#setDisposition = input.checked;
            });
        }
    }

    static #onPick(event, target)
    {
        this.#selected = target.dataset.value;
        this.render();
    }

    static async #onApply()
    {
        if (!this.#actors.length || this.#selected === null)
            return;
        if (AdvancedFactions.teamsEnabled())
            await AdvancedFactions.assignTeamToActors(this.#actors, this.#selected, { placed: this.#placed, setDisposition: this.#setDisposition });
        else
            await AdvancedFactions.setDispositionOnActors(this.#actors, Number(this.#selected), { placed: this.#placed });
        this.close();
    }
}

export const AdvancedFactions = {
    teamsEnabled: () =>
    {
        try
        {
            return game.settings.get("token-factions", "teams-enabled") === true;
        }
        catch
        {
            return false;
        }
    },

    getTeams: () =>
    {
        return game.settings.get("token-factions", "team-setup") || [];
    },

    getMatrix: () =>
    {
        return game.settings.get("token-factions", "disposition-matrix") || {};
    },

    relation: (viewerId, targetId, matrix = AdvancedFactions.getMatrix()) =>
    {
        const self = viewerId === targetId;
        const value = self ? matrix[viewerId]?.[viewerId] : matrix[viewerId]?.[targetId] ?? matrix[targetId]?.[viewerId];
        if (value === undefined || value === null || value === "")
            return self ? 1 : 0;
        return Number(value);
    },

    /**
     * Get the disposition between two actors based on their teams.
     * @param {Actor} actorA
     * @param {Actor} actorB
     * @returns {number} CONST.TOKEN_DISPOSITIONS (FRIENDLY: 1, NEUTRAL: 0, HOSTILE: -1)
     */
    getDisposition: (actorA, actorB) =>
    {
        if (!actorA || !actorB)
            return CONST.TOKEN_DISPOSITIONS.NEUTRAL;
        if (actorA === actorB)
            return CONST.TOKEN_DISPOSITIONS.FRIENDLY;

        const getDisp = (doc) =>
        {
            // Token placeable -> use document.disposition
            if (doc.document?.disposition !== undefined)
                return doc.document.disposition;
            // TokenDocument -> use disposition directly
            if (doc.disposition !== undefined)
                return doc.disposition;
            // Actor -> use prototypeToken disposition
            if (doc.prototypeToken)
                return doc.prototypeToken.disposition;
            return CONST.TOKEN_DISPOSITIONS.NEUTRAL;
        };

        const getTeamDisp = (teamId) =>
        {
            const teams = AdvancedFactions.getTeams();
            const team = teams.find(t => t.id === teamId);
            if (team && team.gmDisposition !== undefined)
                return parseInt(team.gmDisposition);
            return null;
        };

        const useTeams = AdvancedFactions.teamsEnabled();
        if (useTeams)
        {
            const teamA = AdvancedFactions._getTeam(actorA);
            const teamB = AdvancedFactions._getTeam(actorB);

            if (teamA && teamB)
            {
                const matrix = AdvancedFactions.getMatrix();
                if (teamA === teamB)
                    return AdvancedFactions.relation(teamA, teamA, matrix);

                if (matrix[teamA] && matrix[teamA][teamB] !== undefined)
                {
                    return parseInt(matrix[teamA][teamB]);
                }

                if (matrix[teamB] && matrix[teamB][teamA] !== undefined)
                {
                    return parseInt(matrix[teamB][teamA]);
                }
            }
        }

        const dispA = (useTeams ? getTeamDisp(AdvancedFactions._getTeam(actorA)) : null) ?? getDisp(actorA);
        const dispB = (useTeams ? getTeamDisp(AdvancedFactions._getTeam(actorB)) : null) ?? getDisp(actorB);

        const HOSTILE = CONST.TOKEN_DISPOSITIONS.HOSTILE;
        const SECRET = CONST.TOKEN_DISPOSITIONS.SECRET;
        const FRIENDLY = CONST.TOKEN_DISPOSITIONS.FRIENDLY;
        const NEUTRAL = CONST.TOKEN_DISPOSITIONS.NEUTRAL;

        // A Friendly or Neutral viewer sees the target's own disposition
        if (dispA !== HOSTILE && dispA !== SECRET)
            return dispB;

        // A Hostile or Secret viewer sees it flipped, Neutral stays Neutral
        if (dispB === FRIENDLY)
            return HOSTILE;
        if (dispB === HOSTILE || dispB === SECRET)
            return FRIENDLY;
        return NEUTRAL;
    },

    _getTeam: (doc) =>
    {

        if (doc && doc.document)
            doc = doc.document;
        if (!doc)
            return null;


        let flag = doc.getFlag ? doc.getFlag("token-factions", "team") : null;
        if (flag)
            return flag === TF_NO_TEAM ? null : flag;

        if (doc.documentName === "Token" && doc.actor)
        {

            return AdvancedFactions._getTeam(doc.actor);
        }

        if (doc.documentName === "Actor")
        {
            flag = doc.prototypeToken?.flags?.["token-factions"]?.team;
            if (flag)
                return flag === TF_NO_TEAM ? null : flag;
        }

        return null;
    },

    getBorderColor: (token) =>
    {

        const teamId = AdvancedFactions._getTeam(token);
        if (teamId)
        {
            const teams = AdvancedFactions.getTeams();
            const team = teams.find(t => t.id === teamId);
            if (team && team.color)
            {
                return {
                    INT: Color.fromString(team.color),
                    EX: Color.fromString(team.colorEx || "#000000"),
                    INT_S: String(team.color),
                    EX_S: String(team.colorEx || "#000000")
                };
            }
        }

        const dispositionKey = AdvancedFactions._dispositionKey(token);
        if (dispositionKey)
        {
            try
            {

                const color = game.settings.get("token-factions", `custom-${dispositionKey}-color`);
                const exColor = game.settings.get("token-factions", "actorFolderColorEx");

                return {
                    INT: Color.fromString(color),
                    EX: Color.fromString(exColor),
                    INT_S: String(color),
                    EX_S: String(exColor)
                };
            }
            catch (e)
            {

            }
        }


        const viewerToken = canvas.tokens.controlled[0];
        const viewerDoc = viewerToken || game.user.character;
        let disposition = CONST.TOKEN_DISPOSITIONS.NEUTRAL;

        if (game.user.isGM)
        {

            if (viewerDoc)
            {
                disposition = AdvancedFactions.getDisposition(viewerDoc, token);
            }
            else
            {

                const teamId = AdvancedFactions._getTeam(token.actor);
                if (teamId)
                {
                    const teams = AdvancedFactions.getTeams();
                    const team = teams.find(t => t.id === teamId);

                    if (team && team.gmDisposition !== undefined)
                    {
                        disposition = parseInt(team.gmDisposition);
                    }
                    else
                    {
                        disposition = token.document.disposition;
                    }
                }
                else
                {
                    disposition = token.document.disposition;
                }
            }
        }
        else if (viewerDoc)
        {
            disposition = AdvancedFactions.getDisposition(viewerDoc, token);
        }
        else
        {
            disposition = token.document.disposition;
        }

        const D = CONST.TOKEN_DISPOSITIONS;
        let colorHex, colorExHex;

        if (disposition === D.FRIENDLY)
        {
            colorHex = game.settings.get("token-factions", "friendlyColor");
            colorExHex = game.settings.get("token-factions", "friendlyColorEx");
        }
        else if (disposition === D.HOSTILE)
        {
            colorHex = game.settings.get("token-factions", "hostileColor");
            colorExHex = game.settings.get("token-factions", "hostileColorEx");
        }
        else
        {
            colorHex = game.settings.get("token-factions", "neutralColor");
            colorExHex = game.settings.get("token-factions", "neutralColorEx");
        }


        if (!game.user.isGM && token.isOwner)
        {
            colorHex = game.settings.get("token-factions", "controlledColor");
            colorExHex = game.settings.get("token-factions", "controlledColorEx");
        }
        else if (token.actor?.hasPlayerOwner)
        {
            colorHex = game.settings.get("token-factions", "partyColor");
            colorExHex = game.settings.get("token-factions", "partyColorEx");
        }

        return {
            INT: Color.fromString(colorHex),
            EX: Color.fromString(colorExHex),
            INT_S: String(colorHex),
            EX_S: String(colorExHex)
        };
    },

    _dispositionKey: (token) =>
    {
        const dispositionValue = parseInt(String(token.document.disposition), 10);
        let disposition;
        if (token.actor && token.actor.hasPlayerOwner && token.actor.type === "character")
        {
            disposition = "party-member";
        }
        else if (token.actor && token.actor.hasPlayerOwner)
        {
            disposition = "party-npc";
        }
        else if (dispositionValue === 1)
        {
            disposition = "friendly-npc";
        }
        else if (dispositionValue === 0)
        {
            disposition = "neutral-npc";
        }
        else if (dispositionValue === -1)
        {
            disposition = "hostile-npc";
        }
        return disposition;
    },

    init: () =>
    {
        AdvancedFactions.patchTokenBorder();
    },

    patchTokenBorder: () =>
    {
        const original = Token.prototype._getBorderColor;
        const _finalize = (token, color) =>
        {
            const helpers = globalThis.__tokenFactionsHelpers;
            const pct = helpers?.hoverBrightnessPct?.() ?? 0;
            if (pct > 0 && token.hover && !token.controlled && helpers?.brightenColor)
                return Number(helpers.brightenColor(color, pct));
            return color;
        };
        const _customColor = (key, fallback) =>
        {
            try
            {
                const v = game.settings.get("token-factions", key);
                if (typeof v === "string" && v.startsWith("#"))
                    return parseInt(v.slice(1), 16);
            }
            catch (e) { /* ignore */ }
            return fallback;
        };
        Token.prototype._getBorderColor = function ()
        {
            const helpers = globalThis.__tokenFactionsHelpers;
            if (!this.controlled && helpers?.isHoverDispositionVisible && !helpers.isHoverDispositionVisible())
            {
                const base = helpers.colorBorderFaction?.(this);
                const baseInt = base?.INT;
                if (baseInt !== undefined && baseInt !== null)
                    return _finalize(this, Number(baseInt));
            }

            const colors = CONFIG.Canvas.dispositionColors;
            if (this.controlled || (this.isOwner && !game.user.isGM))
                return _finalize(this, _customColor("controlledColor", colors.CONTROLLED));

            let disposition;
            if (AdvancedFactions.teamsEnabled())
            {
                const viewerActor = game.user.character || canvas.tokens.controlled[0]?.actor;
                if (game.user.isGM)
                {
                    if (viewerActor)
                    {
                        disposition = AdvancedFactions.getDisposition(viewerActor, this);
                    }
                    else
                    {
                        const teamId = AdvancedFactions._getTeam(this);
                        if (teamId)
                        {
                            const teams = AdvancedFactions.getTeams();
                            const team = teams.find(t => t.id === teamId);
                            if (team && team.gmDisposition !== undefined)
                                disposition = parseInt(team.gmDisposition);
                            else
                                disposition = this.document.disposition;
                        }
                        else
                        {
                            disposition = this.document.disposition;
                        }
                    }
                }
                else if (viewerActor)
                {
                    disposition = AdvancedFactions.getDisposition(viewerActor, this);
                }
                else
                {
                    disposition = this.document.disposition;
                }
            }
            else
            {
                disposition = parseInt(this.document.disposition);
            }

            const D = CONST.TOKEN_DISPOSITIONS;
            switch (disposition)
            {
            case D.SECRET: return _finalize(this, colors.SECRET);
            case D.HOSTILE: return _finalize(this, _customColor("hostileColor", colors.HOSTILE));
            case D.NEUTRAL: return _finalize(this, _customColor("neutralColor", colors.NEUTRAL));
            case D.FRIENDLY: return _finalize(this, this.actor?.hasPlayerOwner ? _customColor("partyColor", colors.PARTY) : _customColor("friendlyColor", colors.FRIENDLY));
            default: return _finalize(this, original.apply(this));
            }
        };
    },

    dispositionColor: (value) =>
    {
        const keys = { "1": ["friendlyColor", "#43dfdf"], "0": ["neutralColor", "#f1d836"], "-1": ["hostileColor", "#e72124"] };
        const entry = keys[String(value)];
        if (entry)
        {
            try
            {
                return game.settings.get("token-factions", entry[0]) || entry[1];
            }
            catch
            {
                return entry[1];
            }
        }
        const secret = CONFIG.Canvas.dispositionColors?.SECRET;
        return secret === undefined || secret === null ? "#a612d3" : Color.from(secret).css;
    },

    dispositionCssVars: () =>
    {
        return TF_DISPOSITIONS.map(entry => `--tf-${entry.key}: ${AdvancedFactions.dispositionColor(entry.value)};`).join(" ");
    },

    ringState: (tokenDoc) =>
    {
        const value = tokenDoc.getFlag("token-factions", "disableBorder");
        if (value === "on" || value === "combat")
            return value;
        if (value === "off" || value === true)
            return "off";
        return "default";
    },

    hudTargets: (token) =>
    {
        const controlled = canvas.tokens.controlled;
        const list = controlled.includes(token) ? controlled : [token];
        return list.map(placeable => placeable.document);
    },

    placedTokensOf: (actors) =>
    {
        const ids = new Set(actors.map(actor => actor.id));
        return game.scenes.contents.flatMap(scene => scene.tokens.contents.filter(tokenDoc => ids.has(tokenDoc.actorId)));
    },

    updateTokens: async (tokenDocs, changes) =>
    {
        const byScene = new Map();
        for (const tokenDoc of tokenDocs)
        {
            const scene = tokenDoc.parent;
            if (!scene)
                continue;
            if (!byScene.has(scene))
                byScene.set(scene, []);
            byScene.get(scene).push({ _id: tokenDoc.id, ...changes });
        }
        for (const [scene, updates] of byScene.entries())
            await scene.updateEmbeddedDocuments("Token", updates);
    },

    _updateLinkedPrototypes: async (tokenDocs, protoChanges) =>
    {
        const actorIds = new Set(tokenDocs.filter(tokenDoc => tokenDoc.actorLink && tokenDoc.actorId).map(tokenDoc => tokenDoc.actorId));
        const updates = [...actorIds].filter(id => game.actors.has(id)).map(id => ({ _id: id, ...protoChanges }));
        if (updates.length)
            await Actor.updateDocuments(updates);
    },

    assignTeamToTokens: async (tokenDocs, teamId) =>
    {
        const team = AdvancedFactions.getTeams().find(entry => entry.id === teamId);
        const changes = { "flags.token-factions.team": teamId };
        if (team)
            changes.disposition = Number(team.gmDisposition);
        await AdvancedFactions.updateTokens(tokenDocs, changes);
    },

    syncLinkedPrototype: (tokenDoc, change, userId) =>
    {
        if (userId !== game.user.id || !tokenDoc.actorLink || !tokenDoc.actor)
            return;
        const team = change.flags?.["token-factions"]?.team;
        if (team === undefined)
            return;
        const protoChanges = { "prototypeToken.flags.token-factions.team": team };
        if (change.disposition !== undefined)
            protoChanges["prototypeToken.disposition"] = change.disposition;
        tokenDoc.actor.update(protoChanges);
    },

    setDispositionOnTokens: async (tokenDocs, disposition) =>
    {
        await AdvancedFactions.updateTokens(tokenDocs, { disposition });
        await AdvancedFactions._updateLinkedPrototypes(tokenDocs, { "prototypeToken.disposition": disposition });
    },

    assignTeamToActors: async (actors, teamId, { placed = true, setDisposition = true } = {}) =>
    {
        const team = AdvancedFactions.getTeams().find(entry => entry.id === teamId);
        const withDisposition = !!team && setDisposition;
        const protoChanges = { "prototypeToken.flags.token-factions.team": teamId };
        if (withDisposition)
            protoChanges["prototypeToken.disposition"] = Number(team.gmDisposition);
        await Actor.updateDocuments(actors.map(actor => ({ _id: actor.id, ...protoChanges })));
        if (!placed)
            return;
        const changes = { "flags.token-factions.team": teamId };
        if (withDisposition)
            changes.disposition = Number(team.gmDisposition);
        await AdvancedFactions.updateTokens(AdvancedFactions.placedTokensOf(actors), changes);
    },

    setDispositionOnActors: async (actors, disposition, { placed = true } = {}) =>
    {
        await Actor.updateDocuments(actors.map(actor => ({ _id: actor.id, "prototypeToken.disposition": disposition })));
        if (placed)
            await AdvancedFactions.updateTokens(AdvancedFactions.placedTokensOf(actors), { disposition });
    },

    setRingMode: async (tokenDocs, mode) =>
    {
        await AdvancedFactions.updateTokens(tokenDocs, { "flags.token-factions.disableBorder": mode });
    },

    pickerRows: (current) =>
    {
        if (!AdvancedFactions.teamsEnabled())
        {
            return TF_DISPOSITIONS.map(entry => ({
                value: String(entry.value),
                name: entry.label,
                color: AdvancedFactions.dispositionColor(entry.value),
                colorEx: "#000000",
                current: current === String(entry.value)
            }));
        }
        const rows = [{ value: TF_NO_TEAM, name: "No team", none: true, current: current === TF_NO_TEAM }];
        for (const team of AdvancedFactions.getTeams())
        {
            const def = tfDisposition(team.gmDisposition);
            rows.push({
                value: team.id,
                name: team.name,
                color: team.color,
                colorEx: team.colorEx || "#000000",
                defKey: def.key,
                defShort: def.short,
                current: current === team.id
            });
        }
        return rows;
    },

    _hudBarColor: (tokenDoc) =>
    {
        if (!AdvancedFactions.teamsEnabled())
            return AdvancedFactions.dispositionColor(tokenDoc.disposition);
        const teamId = AdvancedFactions._getTeam(tokenDoc);
        const team = teamId ? AdvancedFactions.getTeams().find(entry => entry.id === teamId) : null;
        return team?.color ?? "transparent";
    },

    _paletteHtml: (targets) =>
    {
        const escape = foundry.utils.escapeHTML;
        const teamsOn = AdvancedFactions.teamsEnabled();
        const values = new Set(targets.map(tokenDoc => (teamsOn ? AdvancedFactions._getTeam(tokenDoc) || TF_NO_TEAM : String(tokenDoc.disposition))));
        const current = values.size === 1 ? [...values][0] : null;
        const rows = AdvancedFactions.pickerRows(current).map(row =>
        {
            const chip = row.none ? '<span class="tf-chip tf-none"></span>' : `<span class="tf-chip" style="--ci: ${escape(row.color)}; --ce: ${escape(row.colorEx)};"></span>`;
            const mark = row.current ? '<span class="tf-muted">current</span>' : "";
            const pill = row.defKey ? `<span class="tf-pill tf-sm tf-${row.defKey}">${row.defShort}</span>` : "";
            return `<button type="button" class="tf-palette-row${row.current ? " current" : ""}" data-tf-pick="${escape(row.value)}">${chip}<span class="tf-palette-name">${escape(row.name)}</span>${mark}${pill}</button>`;
        }).join("");
        const ring = AdvancedFactions.ringState(targets[0]);
        const ringLabel = TF_RING_MODES.find(mode => mode.value === ring)?.label ?? "";
        const ringButtons = TF_RING_MODES.map(mode => `<button type="button" class="${mode.value === ring ? "on" : ""}" data-tf-ring="${mode.value}" aria-label="Ring: ${mode.label}" aria-pressed="${mode.value === ring}"><i class="fas ${mode.icon}"></i></button>`).join("");
        const count = targets.length === 1 ? "1 token" : `${targets.length} tokens`;
        return `<div class="tf-palette-head"><span>${teamsOn ? "Team" : "Disposition"}</span><span class="tf-muted">${count}</span></div>`
            + `<div class="tf-palette-list">${rows}</div>`
            + `<div class="tf-palette-foot"><span class="tf-muted">Ring: ${ringLabel}</span><div class="tf-ring-modes">${ringButtons}</div></div>`;
    },

    _renderHudPalette: (wrap, token) =>
    {
        wrap.querySelector(".tf-palette")?.remove();
        if (tfHudPaletteToken !== token.id)
            return;
        const targets = AdvancedFactions.hudTargets(token);
        const palette = document.createElement("div");
        palette.className = "tf-palette";
        palette.setAttribute("style", AdvancedFactions.dispositionCssVars());
        palette.innerHTML = AdvancedFactions._paletteHtml(targets);
        wrap.append(palette);
        palette.addEventListener("click", async (event) =>
        {
            event.preventDefault();
            event.stopPropagation();
            const row = event.target.closest("[data-tf-pick]");
            if (row)
            {
                if (AdvancedFactions.teamsEnabled())
                    await AdvancedFactions.assignTeamToTokens(targets, row.dataset.tfPick);
                else
                    await AdvancedFactions.setDispositionOnTokens(targets, Number(row.dataset.tfPick));
                return;
            }
            const ring = event.target.closest("[data-tf-ring]");
            if (ring)
                await AdvancedFactions.setRingMode(targets, ring.dataset.tfRing);
        });
    },

    closeHudPalette: () =>
    {
        tfHudPaletteToken = null;
    },

    renderTokenHUD: (app, htmlOrEl) =>
    {
        const root = htmlOrEl instanceof HTMLElement ? htmlOrEl : htmlOrEl?.[0];
        const token = app.object;
        if (!root || !token?.document || !game.user.isGM)
            return;
        const read = (key, fallback) =>
        {
            try
            {
                return game.settings.get("token-factions", key);
            }
            catch
            {
                return fallback;
            }
        };
        if (!read("hudEnable", true))
            return;
        if (tfHudPaletteToken && tfHudPaletteToken !== token.id)
            tfHudPaletteToken = null;
        const left = String(read("hudColumn", "Right")).toLowerCase() === "left";
        const column = root.querySelector(left ? ".col.left" : ".col.right");
        if (!column)
            return;
        const wrap = document.createElement("div");
        wrap.className = left ? "tf-hud-wrap tf-hud-left" : "tf-hud-wrap";
        const button = document.createElement("button");
        button.type = "button";
        button.className = "control-icon tf-hud-button";
        button.setAttribute("aria-label", AdvancedFactions.teamsEnabled() ? "Team" : "Disposition");
        button.innerHTML = '<i class="fas fa-users"></i>';
        button.style.setProperty("--tf-bar", AdvancedFactions._hudBarColor(token.document));
        button.classList.toggle("active", tfHudPaletteToken === token.id);
        wrap.append(button);
        if (String(read("hudTopBottom", "Bottom")).toLowerCase() === "top")
            column.prepend(wrap);
        else
            column.append(wrap);
        button.addEventListener("click", (event) =>
        {
            event.preventDefault();
            event.stopPropagation();
            tfHudPaletteToken = tfHudPaletteToken === token.id ? null : token.id;
            button.classList.toggle("active", tfHudPaletteToken === token.id);
            AdvancedFactions._renderHudPalette(wrap, token);
        });
        button.addEventListener("contextmenu", (event) =>
        {
            event.preventDefault();
            event.stopPropagation();
            const order = TF_RING_MODES.map(mode => mode.value);
            const next = order[(order.indexOf(AdvancedFactions.ringState(token.document)) + 1) % order.length];
            AdvancedFactions.setRingMode(AdvancedFactions.hudTargets(token), next);
        });
        AdvancedFactions._renderHudPalette(wrap, token);
    },

    addFolderContextOptions: (html, options) =>
    {
        const open = (header) =>
        {
            const el = header instanceof HTMLElement ? header : header[0];
            const folderEl = el.closest(".directory-item") ?? el.closest("[data-folder-id]");
            const folder = game.folders.get(folderEl?.dataset?.folderId);
            if (!folder)
                return;
            const actors = AdvancedFactions._recursivelyGetActors(folder);
            if (!actors.length)
            {
                ui.notifications.warn("No actors found in this folder.");
                return;
            }
            TeamPicker.openFor({ actors, label: folder.name, kind: "folder", anchor: el });
        };
        options.push(
            {
                name: "Assign Team",
                icon: '<i class="fas fa-users"></i>',
                condition: () => game.user.isGM && AdvancedFactions.teamsEnabled(),
                callback: open
            },
            {
                name: "Set Disposition",
                icon: '<i class="fas fa-users"></i>',
                condition: () => game.user.isGM && !AdvancedFactions.teamsEnabled(),
                callback: open
            }
        );
    },

    addEntryContextOptions: (app, options) =>
    {
        const open = (li) =>
        {
            const el = li instanceof HTMLElement ? li : li[0];
            const entry = el.closest("[data-entry-id]") ?? el.closest("[data-document-id]");
            const actor = game.actors.get(entry?.dataset?.entryId ?? entry?.dataset?.documentId);
            if (actor)
                TeamPicker.openFor({ actors: [actor], label: actor.name, kind: "actor", anchor: el });
        };
        options.push(
            {
                name: "Assign Team",
                icon: '<i class="fas fa-users"></i>',
                condition: () => game.user.isGM && AdvancedFactions.teamsEnabled(),
                callback: open
            },
            {
                name: "Set Disposition",
                icon: '<i class="fas fa-users"></i>',
                condition: () => game.user.isGM && !AdvancedFactions.teamsEnabled(),
                callback: open
            }
        );
    },

    _cleanupTeamReferences: async (removedId) =>
    {
        if (!removedId)
            return;

        const matrix = game.settings.get("token-factions", "disposition-matrix") || {};
        if (matrix[removedId])
        {
            delete matrix[removedId];
        }
        for (const k of Object.keys(matrix))
        {
            if (matrix[k]?.[removedId] !== undefined)
            {
                delete matrix[k][removedId];
            }
        }
        await game.settings.set("token-factions", "disposition-matrix", matrix);

        const actorUpdates = [];
        for (const a of game.actors)
        {
            const teamFlag = a.prototypeToken?.flags?.["token-factions"]?.team
                ?? a.getFlag?.("token-factions", "team");
            if (teamFlag === removedId)
            {
                actorUpdates.push({
                    _id: a.id,
                    "prototypeToken.flags.token-factions.team": null,
                    "flags.token-factions.team": null
                });
            }
        }
        if (actorUpdates.length)
        {
            await Actor.updateDocuments(actorUpdates);
        }

        for (const scene of game.scenes)
        {
            const tokenUpdates = [];
            for (const t of scene.tokens)
            {
                if (t.flags?.["token-factions"]?.team === removedId)
                {
                    tokenUpdates.push({ _id: t.id, "flags.token-factions.team": null });
                }
            }
            if (tokenUpdates.length)
            {
                await scene.updateEmbeddedDocuments("Token", tokenUpdates);
            }
        }
    },

    _recursivelyGetActors: (folder) =>
    {
        let actors = folder.contents;


        const subfolders = folder.children.map(c => c.folder);
        for (const sub of subfolders)
        {
            if (sub)
            {
                actors = actors.concat(AdvancedFactions._recursivelyGetActors(sub));
            }
        }
        return actors;
    }
};
