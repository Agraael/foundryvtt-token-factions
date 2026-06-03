/* global document, window, setTimeout, game, CONST, foundry, ui, FormApplication */

export class TeamConfig extends FormApplication
{
    static get defaultOptions()
    {
        return foundry.utils.mergeObject(super.defaultOptions, {
            title: "Team Configuration",
            id: "token-factions-team-config",
            template: `modules/token-factions/templates/team-config.html`,
            width: 600,
            height: "auto",
            closeOnSubmit: true
        });
    }

    getData()
    {
        const teams = game.settings.get("token-factions", "team-setup") || [];
        const matrix = game.settings.get("token-factions", "disposition-matrix") || {};

        const DISP_GLYPH = {
            [CONST.TOKEN_DISPOSITIONS.FRIENDLY]: "F",
            [CONST.TOKEN_DISPOSITIONS.NEUTRAL]: "N",
            [CONST.TOKEN_DISPOSITIONS.HOSTILE]: "H",
            [CONST.TOKEN_DISPOSITIONS.SECRET]: "S"
        };

        const matrixRows = teams.map((rowTeam, rowIdx) =>
        {
            const cells = teams.map((colTeam, colIdx) =>
            {
                let value = 0;
                if (rowTeam.id === colTeam.id)
                    value = 1;
                if (matrix[rowTeam.id] && matrix[rowTeam.id][colTeam.id] !== undefined)
                {
                    value = matrix[rowTeam.id][colTeam.id];
                }
                return {
                    rowId: rowTeam.id,
                    colId: colTeam.id,
                    rowIdx,
                    colIdx,
                    value,
                    glyph: DISP_GLYPH[value] ?? "?",
                    isLower: rowIdx > colIdx,
                    isDiagonal: rowIdx === colIdx
                };
            });
            return { team: rowTeam, rowIdx, cells };
        });

        let symmetricView = true;
        try { symmetricView = globalThis.localStorage?.getItem("tf-symmetric-view") !== "0"; }
        catch { /* localStorage unavailable */ }

        return {
            teams,
            matrixRows,
            symmetricView,
            dispositionOptions: {
                [CONST.TOKEN_DISPOSITIONS.FRIENDLY]: "Friendly",
                [CONST.TOKEN_DISPOSITIONS.NEUTRAL]: "Neutral",
                [CONST.TOKEN_DISPOSITIONS.HOSTILE]: "Hostile",
                [CONST.TOKEN_DISPOSITIONS.SECRET]: "Secret"
            }
        };
    }

    async _updateObject(event, formData)
    {
        const expanded = foundry.utils.expandObject(formData);


        const newTeams = Object.values(expanded.teams || []);
        await game.settings.set("token-factions", "team-setup", newTeams);


        await game.settings.set("token-factions", "disposition-matrix", expanded.matrix || {});
    }

    activateListeners(html)
    {
        super.activateListeners(html);
        const root = html[0] ?? html;

        root.querySelectorAll('.add-team').forEach(el => el.addEventListener('click', this._onAddTeam.bind(this)));
        root.querySelectorAll('.remove-team').forEach(el => el.addEventListener('click', this._onRemoveTeam.bind(this)));
        root.querySelectorAll('.disposition-select').forEach(el => el.addEventListener('change', this._onGmDispositionChange.bind(this)));

        // Cycle on left-click, reverse on right-click.
        root.querySelectorAll('.disp-cell').forEach(btn =>
        {
            btn.addEventListener('click', (e) => this._cycleCell(e.currentTarget, +1));
            btn.addEventListener('contextmenu', (e) => { e.preventDefault(); this._cycleCell(e.currentTarget, -1); });
        });

        // Symmetric view toggle (per-client localStorage).
        const symToggle = root.querySelector('.symmetric-toggle');
        const scroll = root.querySelector('.matrix-scroll');
        symToggle?.addEventListener('change', (e) =>
        {
            const on = !!e.currentTarget.checked;
            try
            {
                globalThis.localStorage?.setItem('tf-symmetric-view', on ? '1' : '0');
            }
            catch { /* ignore */ }
            scroll?.classList.toggle('matrix-symmetric', on);
        });

        // Row / column "set all" via header click.
        root.querySelectorAll('.row-header').forEach(th => th.addEventListener('click', (e) => this._openSetAllMenu(e.currentTarget, 'row')));
        root.querySelectorAll('.col-header').forEach(th => th.addEventListener('click', (e) => this._openSetAllMenu(e.currentTarget, 'col')));

        // Hover crosshair.
        const cols = Array.from(root.querySelectorAll('.matrix thead th.col-header'));
        root.querySelectorAll('.matrix-cell').forEach(cell =>
        {
            cell.addEventListener('mouseenter', () => this._setCrosshair(root, cell, cols, true));
            cell.addEventListener('mouseleave', () => this._setCrosshair(root, cell, cols, false));
        });
    }

    _onGmDispositionChange(event)
    {
        event.currentTarget.dataset.value = event.currentTarget.value;
    }

    _cycleCell(btn, direction)
    {
        const ORDER = [1, 0, -1, -2];
        const cur = Number(btn.dataset.value);
        const idx = ORDER.indexOf(cur);
        const step = direction > 0 ? 1 : ORDER.length - 1;
        const next = ORDER[(idx + step) % ORDER.length];
        this._setCellValue(btn, next);
    }

    _setCellValue(btn, value)
    {
        const GLYPH = { 1: 'F', 0: 'N', '-1': 'H', '-2': 'S' };
        const form = btn.form ?? btn.closest('form');
        const rowId = btn.dataset.rowId;
        const colId = btn.dataset.colId;
        const apply = (rId, cId) =>
        {
            const b = form.querySelector(`.disp-cell[data-row-id="${rId}"][data-col-id="${cId}"]`);
            const h = form.querySelector(`input[type="hidden"][name="matrix.${rId}.${cId}"]`);
            if (b)
            {
                b.dataset.value = String(value);
                b.textContent = GLYPH[String(value)] ?? '?';
            }
            if (h)
                h.value = String(value);
        };
        apply(rowId, colId);
        const symmetric = form.querySelector('.symmetric-toggle')?.checked;
        if (symmetric && rowId !== colId)
            apply(colId, rowId);
    }

    _openSetAllMenu(headerEl, axis)
    {
        const root = headerEl.closest('form');
        root.querySelectorAll('.header-setall-menu').forEach(m => m.remove());

        const GLYPH = { 1: 'F', 0: 'N', '-1': 'H', '-2': 'S' };
        const LABEL = { 1: 'Friendly', 0: 'Neutral', '-1': 'Hostile', '-2': 'Secret' };
        const menu = document.createElement('div');
        menu.className = 'header-setall-menu';
        for (const v of [1, 0, -1, -2])
        {
            const b = document.createElement('button');
            b.type = 'button';
            b.dataset.value = String(v);
            b.textContent = GLYPH[String(v)];
            b.title = LABEL[String(v)];
            b.addEventListener('click', (e) =>
            {
                e.stopPropagation();
                const teamId = headerEl.dataset[axis === 'row' ? 'rowId' : 'colId'];
                this._setAll(root, axis, teamId, v);
                menu.remove();
            });
            menu.appendChild(b);
        }
        document.body.appendChild(menu);
        const rect = headerEl.getBoundingClientRect();
        menu.style.left = `${Math.round(rect.left + window.scrollX)}px`;
        menu.style.top = `${Math.round(rect.bottom + window.scrollY + 4)}px`;
        const closeOnOutside = (ev) =>
        {
            if (!menu.contains(ev.target))
            {
                menu.remove();
                document.removeEventListener('mousedown', closeOnOutside, true);
            }
        };
        setTimeout(() => document.addEventListener('mousedown', closeOnOutside, true), 0);
    }

    _setAll(form, axis, teamId, value)
    {
        const selector = axis === 'row'
            ? `.disp-cell[data-row-id="${teamId}"]`
            : `.disp-cell[data-col-id="${teamId}"]`;
        form.querySelectorAll(selector).forEach(btn =>
        {
            // Skip diagonal: a team's view of itself stays Friendly.
            if (btn.dataset.rowId === btn.dataset.colId)
                return;
            this._setCellValue(btn, value);
        });
    }

    _setCrosshair(root, cell, cols, on)
    {
        const rowIdx = cell.dataset.rowIdx;
        const colIdx = cell.dataset.colIdx;
        const tr = root.querySelector(`.matrix tbody tr[data-row-idx="${rowIdx}"]`);
        tr?.classList.toggle('row-hovered', on);
        const colHeader = cols.find(th => th.dataset.colIdx === colIdx);
        colHeader?.classList.toggle('col-hovered', on);
        root.querySelectorAll(`.matrix-cell[data-col-idx="${colIdx}"]`)
            .forEach(td => td.classList.toggle('col-hovered', on));
    }

    async _onAddTeam(event)
    {
        const teams = game.settings.get("token-factions", "team-setup") || [];
        const newId = foundry.utils.randomID();
        teams.push({ id: newId, name: "New Team", color: "#ffffff", colorEx: "#000000", gmDisposition: 0 });
        await game.settings.set("token-factions", "team-setup", teams);
        this.render();
    }

    async _onRemoveTeam(event)
    {
        const idx = event.currentTarget.dataset.index;
        const teams = game.settings.get("token-factions", "team-setup") || [];
        const removed = teams[idx];
        teams.splice(idx, 1);
        await game.settings.set("token-factions", "team-setup", teams);

        if (removed?.id)
        {
            await AdvancedFactions._cleanupTeamReferences(removed.id);
        }
        this.render();
    }
}

export const AdvancedFactions = {
    getTeams: () =>
    {
        return game.settings.get("token-factions", "team-setup") || [];
    },

    getMatrix: () =>
    {
        return game.settings.get("token-factions", "disposition-matrix") || {};
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

        if (game.settings.get("token-factions", "color-from") === "advanced-factions")
        {
            const teamA = AdvancedFactions._getTeam(actorA);
            const teamB = AdvancedFactions._getTeam(actorB);

            if (teamA && teamB)
            {
                if (teamA === teamB)
                    return CONST.TOKEN_DISPOSITIONS.FRIENDLY;

                const matrix = AdvancedFactions.getMatrix();
                if (matrix[teamA] && matrix[teamA][teamB] !== undefined)
                {
                    return parseInt(matrix[teamA][teamB]);
                }

                if (matrix[teamB] && matrix[teamB][teamA] !== undefined)
                {
                    return parseInt(matrix[teamB][teamA]);
                }
            }
            else
            {
                return getDisp(actorB);
            }
        }

        const dispA = getTeamDisp(AdvancedFactions._getTeam(actorA)) ?? getDisp(actorA);
        const dispB = getTeamDisp(AdvancedFactions._getTeam(actorB)) ?? getDisp(actorB);

        const HOSTILE = CONST.TOKEN_DISPOSITIONS.HOSTILE;
        const SECRET = CONST.TOKEN_DISPOSITIONS.SECRET;
        const FRIENDLY = CONST.TOKEN_DISPOSITIONS.FRIENDLY;
        const NEUTRAL = CONST.TOKEN_DISPOSITIONS.NEUTRAL;

        const isBadA = dispA === HOSTILE || dispA === SECRET;
        const isBadB = dispB === HOSTILE || dispB === SECRET;

        const isGoodA = dispA === FRIENDLY || dispA === NEUTRAL;
        const isGoodB = dispB === FRIENDLY || dispB === NEUTRAL;

        // If one is Good and one is Bad -> HOSTILE
        if ((isGoodA && isBadB) || (isBadA && isGoodB))
        {
            return CONST.TOKEN_DISPOSITIONS.HOSTILE;
        }

        // Otherwise (Good+Good or Bad+Bad) -> FRIENDLY
        return CONST.TOKEN_DISPOSITIONS.FRIENDLY;
    },

    _getTeam: (doc) =>
    {

        if (doc && doc.document)
            doc = doc.document;
        if (!doc)
            return null;


        let flag = doc.getFlag ? doc.getFlag("token-factions", "team") : null;
        if (flag)
            return flag;

        if (doc.documentName === "Token" && doc.actor)
        {

            return AdvancedFactions._getTeam(doc.actor);
        }

        if (doc.documentName === "Actor")
        {
            flag = doc.prototypeToken?.flags?.["token-factions"]?.team;
            if (flag)
                return flag;
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
        Token.prototype._getBorderColor = function ()
        {
            if (game.settings.get("token-factions", "color-from") !== "advanced-factions")
            {
                return original.apply(this);
            }

            const colors = CONFIG.Canvas.dispositionColors;
            if (this.controlled || (this.isOwner && !game.user.isGM))
                return colors.CONTROLLED;
            let disposition;
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
                        {
                            disposition = parseInt(team.gmDisposition);
                        }
                        else
                        {
                            disposition = this.document.disposition;
                        }
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

            const D = CONST.TOKEN_DISPOSITIONS;
            switch (disposition)
            {
            case D.SECRET: return colors.SECRET;
            case D.HOSTILE: return colors.HOSTILE;
            case D.NEUTRAL: return colors.NEUTRAL;
            case D.FRIENDLY: return this.actor?.hasPlayerOwner ? colors.PARTY : colors.FRIENDLY;
            default: return original.apply(this);
            }
        };
    },

    renderTokenHUD: (app, htmlOrEl) =>
    {
        const html = htmlOrEl instanceof HTMLElement ? $(htmlOrEl) : htmlOrEl;
        if (!game.user.isGM)
            return;

        const token = app.object;
        const currentTeamId = AdvancedFactions._getTeam(token) || "";
        const teams = AdvancedFactions.getTeams();
        const _factionState = (t) =>
        {
            const v = t.document.getFlag("token-factions", "disableBorder");
            if (v === "on")
                return "on";
            if (v === "combat")
                return "combat";
            if (v === "off" || v === true)
                return "off";
            return "default";
        };
        const borderState = _factionState(token);
        let stateTip;
        if (borderState === "default")
            stateTip = "Default (world setting)";
        else if (borderState === "on")
            stateTip = "Forced On";
        else if (borderState === "combat")
            stateTip = "Only In Combat";
        else
            stateTip = "Forced Off";


        const button = $(`
            <div class="control-icon faction-selector faction-border-${borderState} ${borderState === "off" ? "active" : ""}" title="Left-Click: Team\nRight-Click: Cycle Border (${stateTip})">
                <i class="fas fa-users"></i>
            </div>
        `);


        button.click(async (event) =>
        {
            const template = `
                <div class="form-group" style="padding-bottom: 10px;">
                    <select name="teamId" style="width: 100%; text-align: center; font-size: 1.1em;">
                        <option value="">(None)</option>
                        ${teams.map(t => `<option value="${t.id}" style="color: ${t.color}; font-weight: bold;" ${t.id === currentTeamId ? "selected" : ""}>${t.name}</option>`).join("")}
                    </select>
                </div>
            `;

            const d = new Dialog({
                title: "Switch Team",
                content: template,
                buttons: {},
                render: (html) =>
                {
                    html.find('[name="teamId"]').change(async (e) =>
                    {
                        const newTeamId = e.target.value;


                        const tokens = canvas.tokens.controlled.length > 0 ? canvas.tokens.controlled : [token];

                        for (const t of tokens)
                        {
                            const updateData = {
                                "flags.token-factions.team": newTeamId
                            };


                            const team = teams.find(team => team.id === newTeamId);
                            if (team && team.gmDisposition !== undefined)
                            {

                                updateData.disposition = parseInt(team.gmDisposition);
                            }

                            await t.document.update(updateData);


                            if (t.document.isLinked)
                            {
                                const protoUpdate = {
                                    "prototypeToken.flags.token-factions.team": newTeamId
                                };
                                if (updateData.disposition !== undefined)
                                {
                                    protoUpdate["prototypeToken.disposition"] = updateData.disposition;
                                }
                                await t.actor.update(protoUpdate);
                            }

                            t.refresh();
                        }
                        d.close();
                    });
                }
            });
            d.render(true);
        });


        button.contextmenu(async (event) =>
        {
            const current = _factionState(token);
            const next = current === "default" ? "off" : current === "off" ? "on" : "default";


            const tokens = canvas.tokens.controlled.length > 0 ? canvas.tokens.controlled : [token];

            for (const t of tokens)
            {
                await t.document.setFlag("token-factions", "disableBorder", next);
                t.refresh();
            }


            const btn = event.currentTarget;
            btn.classList.remove("faction-border-default", "faction-border-off", "faction-border-on", "active");
            btn.classList.add(`faction-border-${next}`);
            if (next === "off")
                btn.classList.add("active");
        });


        html.find('.col.right').append(button);
    },

    addFolderContextOptions: (html, options) =>
    {
        options.push({
            name: "Assign Team",
            icon: '<i class="fas fa-users"></i>',
            condition: () => game.user.isGM,
            callback: (header) =>
            {
                const el = header instanceof HTMLElement ? header : header[0];
                const folderEl = el.closest(".directory-item") ?? el.closest("[data-folder-id]");
                const folderId = folderEl?.dataset?.folderId;
                const folder = game.folders.get(folderId);
                const teams = AdvancedFactions.getTeams();

                if (!folder)
                    return;

                const template = `
                    <div class="form-group" style="padding-bottom: 10px;">
                        <p>Assign team to all actors in <strong>${folder.name}</strong> (and subfolders)?</p>
                        <select name="teamId" style="width: 100%; text-align: center; font-size: 1.1em;">
                            <option value="">(None / Clear)</option>
                            ${teams.map(t => `<option value="${t.id}" style="color: ${t.color}; font-weight: bold;">${t.name}</option>`).join("")}
                        </select>
                    </div>
                `;

                const d = new Dialog({
                    title: "Assign Team to Folder",
                    content: template,
                    buttons: {},
                    render: (html) =>
                    {
                        html.find('[name="teamId"]').change(async (e) =>
                        {
                            const newTeamId = e.target.value;
                            d.close();


                            const actorsToUpdate = AdvancedFactions._recursivelyGetActors(folder);

                            if (actorsToUpdate.length === 0)
                            {
                                ui.notifications.warn("No actors found in this folder.");
                                return;
                            }

                            ui.notifications.info(`Updating ${actorsToUpdate.length} actors...`);

                            // Update them
                            const updates = actorsToUpdate.map(a =>
                            {
                                return {
                                    _id: a.id,
                                    "prototypeToken.flags.token-factions.team": newTeamId
                                };
                            });

                            await Actor.updateDocuments(updates);
                            ui.notifications.info(`Successfully assigned team to ${actorsToUpdate.length} actors.`);
                        });
                    }
                });
                d.render(true);
            }
        });
    },

    addEntryContextOptions: (app, options) =>
    {
        options.push({
            name: "Assign Team",
            icon: '<i class="fas fa-users"></i>',
            condition: () => game.user.isGM,
            callback: (li) =>
            {
                const el = li instanceof HTMLElement ? li : li[0];
                const entry = el.closest("[data-entry-id]") ?? el.closest("[data-document-id]");
                const actor = game.actors.get(entry?.dataset?.entryId ?? entry?.dataset?.documentId);
                if (!actor)
                    return;
                const teams = AdvancedFactions.getTeams();
                const current = actor.prototypeToken?.flags?.["token-factions"]?.team ?? "";

                const template = `
                    <div class="form-group" style="padding-bottom: 10px;">
                        <p>Assign team to <strong>${actor.name}</strong>?</p>
                        <select name="teamId" style="width: 100%; text-align: center; font-size: 1.1em;">
                            <option value="">(None / Clear)</option>
                            ${teams.map(t => `<option value="${t.id}" style="color: ${t.color}; font-weight: bold;" ${t.id === current ? "selected" : ""}>${t.name}</option>`).join("")}
                        </select>
                    </div>
                `;

                const d = new Dialog({
                    title: "Assign Team to Actor",
                    content: template,
                    buttons: {},
                    render: (html) =>
                    {
                        html.find('[name="teamId"]').change(async (e) =>
                        {
                            const newTeamId = e.target.value;
                            d.close();
                            await actor.update({ "prototypeToken.flags.token-factions.team": newTeamId });
                            ui.notifications.info(`Assigned team to ${actor.name}.`);
                        });
                    }
                });
                d.render(true);
            }
        });
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
