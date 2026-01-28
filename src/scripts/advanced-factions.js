export class TeamConfig extends FormApplication {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "Team Configuration",
            id: "token-factions-team-config",
            template: `modules/token-factions/templates/team-config.html`,
            width: 600,
            height: "auto",
            closeOnSubmit: true
        });
    }

    getData() {
        const teams = game.settings.get("token-factions", "team-setup") || [];
        const matrix = game.settings.get("token-factions", "disposition-matrix") || {};


        const matrixRows = teams.map(rowTeam => {
            const cells = teams.map(colTeam => {
                let value = 0;
                if (rowTeam.id === colTeam.id) value = 1;
                if (matrix[rowTeam.id] && matrix[rowTeam.id][colTeam.id] !== undefined) {
                    value = matrix[rowTeam.id][colTeam.id];
                }
                return {
                    rowId: rowTeam.id,
                    colId: colTeam.id,
                    value: value
                };
            });
            return { team: rowTeam, cells: cells };
        });

        return {
            teams: teams,
            matrixRows: matrixRows,
            dispositionOptions: {
                [CONST.TOKEN_DISPOSITIONS.FRIENDLY]: "Friendly",
                [CONST.TOKEN_DISPOSITIONS.NEUTRAL]: "Neutral",
                [CONST.TOKEN_DISPOSITIONS.HOSTILE]: "Hostile",
                [CONST.TOKEN_DISPOSITIONS.SECRET]: "Secret"
            }
        };
    }

    async _updateObject(event, formData) {
        const expanded = foundry.utils.expandObject(formData);


        const newTeams = Object.values(expanded.teams || []);
        await game.settings.set("token-factions", "team-setup", newTeams);


        await game.settings.set("token-factions", "disposition-matrix", expanded.matrix || {});
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.add-team').click(this._onAddTeam.bind(this));
        html.find('.remove-team').click(this._onRemoveTeam.bind(this));


        html.find('.disposition-select').change(this._onDispositionChange.bind(this));
    }

    _onDispositionChange(event) {
        const select = event.currentTarget;
        select.dataset.value = select.value;


        const parts = select.name.split(".");
        if (parts.length === 3) {
            const rowId = parts[1];
            const colId = parts[2];


            const symmetricName = `matrix.${colId}.${rowId}`;


            const form = select.form;
            const otherSelect = form.querySelector(`select[name="${symmetricName}"]`);

            if (otherSelect) {
                otherSelect.value = select.value;
                otherSelect.dataset.value = select.value;
            }
        }
    }

    async _onAddTeam(event) {
        const teams = game.settings.get("token-factions", "team-setup") || [];
        const newId = foundry.utils.randomID();
        teams.push({ id: newId, name: "New Team", color: "#ffffff", colorEx: "#000000", gmDisposition: 0 });
        await game.settings.set("token-factions", "team-setup", teams);
        this.render();
    }

    async _onRemoveTeam(event) {
        const idx = event.currentTarget.dataset.index;
        const teams = game.settings.get("token-factions", "team-setup") || [];
        teams.splice(idx, 1);
        await game.settings.set("token-factions", "team-setup", teams);
        this.render();
    }
}

export const AdvancedFactions = {
    getTeams: () => {
        return game.settings.get("token-factions", "team-setup") || [];
    },

    getMatrix: () => {
        return game.settings.get("token-factions", "disposition-matrix") || {};
    },

    /**
     * Get the disposition between two actors based on their teams.
     * @param {Actor} actorA 
     * @param {Actor} actorB 
     * @returns {number} CONST.TOKEN_DISPOSITIONS (FRIENDLY: 1, NEUTRAL: 0, HOSTILE: -1)
     */
    getDisposition: (actorA, actorB) => {
        if (!actorA || !actorB) return CONST.TOKEN_DISPOSITIONS.NEUTRAL;
        if (actorA === actorB) return CONST.TOKEN_DISPOSITIONS.FRIENDLY;

        if (game.settings.get("token-factions", "color-from") === "advanced-factions") {
            const teamA = AdvancedFactions._getTeam(actorA);
            const teamB = AdvancedFactions._getTeam(actorB);

            if (teamA && teamB) {
                if (teamA === teamB) return CONST.TOKEN_DISPOSITIONS.FRIENDLY;

                const matrix = AdvancedFactions.getMatrix();
                if (matrix[teamA] && matrix[teamA][teamB] !== undefined) {
                    return parseInt(matrix[teamA][teamB]);
                }

                if (matrix[teamB] && matrix[teamB][teamA] !== undefined) {
                    return parseInt(matrix[teamB][teamA]);
                }
            }
        }


        const getDisp = (actor) => {
            if (actor.prototypeToken) return actor.prototypeToken.disposition;
            // If it's a token document or has disposition directly
            if (actor.disposition !== undefined) return actor.disposition;
            return CONST.TOKEN_DISPOSITIONS.NEUTRAL;
        };

        const dispA = getDisp(actorA);
        const dispB = getDisp(actorB);

        const HOSTILE = CONST.TOKEN_DISPOSITIONS.HOSTILE;
        const SECRET = CONST.TOKEN_DISPOSITIONS.SECRET;
        const FRIENDLY = CONST.TOKEN_DISPOSITIONS.FRIENDLY;
        const NEUTRAL = CONST.TOKEN_DISPOSITIONS.NEUTRAL;

        const isBadA = dispA === HOSTILE || dispA === SECRET;
        const isBadB = dispB === HOSTILE || dispB === SECRET;

        const isGoodA = dispA === FRIENDLY || dispA === NEUTRAL;
        const isGoodB = dispB === FRIENDLY || dispB === NEUTRAL;

        // If one is Good and one is Bad -> HOSTILE
        if ((isGoodA && isBadB) || (isBadA && isGoodB)) {
            return CONST.TOKEN_DISPOSITIONS.HOSTILE;
        }

        // Otherwise (Good+Good or Bad+Bad) -> FRIENDLY
        return CONST.TOKEN_DISPOSITIONS.FRIENDLY;
    },

    _getTeam: (doc) => {

        if (doc && doc.document) doc = doc.document;
        if (!doc) return null;


        let flag = doc.getFlag ? doc.getFlag("token-factions", "team") : null;
        if (flag) return flag;


        if (doc.documentName === "Token" && doc.actor) {

            return AdvancedFactions._getTeam(doc.actor);
        }


        if (doc.documentName === "Actor") {
            flag = doc.prototypeToken?.flags?.["token-factions"]?.team;
            if (flag) return flag;
        }

        return null;
    },

    getBorderColor: (token) => {

        const teamId = AdvancedFactions._getTeam(token);
        if (teamId) {
            const teams = AdvancedFactions.getTeams();
            const team = teams.find(t => t.id === teamId);
            if (team && team.color) {
                return {
                    INT: Color.fromString(team.color),
                    EX: Color.fromString(team.colorEx || "#000000"),
                    INT_S: String(team.color),
                    EX_S: String(team.colorEx || "#000000")
                };
            }
        }

        const dispositionKey = AdvancedFactions._dispositionKey(token);
        if (dispositionKey) {
            try {

                const color = game.settings.get("token-factions", `custom-${dispositionKey}-color`);
                const exColor = game.settings.get("token-factions", "actorFolderColorEx");

                return {
                    INT: Color.fromString(color),
                    EX: Color.fromString(exColor),
                    INT_S: String(color),
                    EX_S: String(exColor)
                };
            } catch (e) {

            }
        }


        const viewerActor = game.user.character || canvas.tokens.controlled[0]?.actor;
        let disposition = CONST.TOKEN_DISPOSITIONS.NEUTRAL;

        if (game.user.isGM) {

            if (viewerActor) {
                disposition = AdvancedFactions.getDisposition(viewerActor, token.actor);
            } else {

                const teamId = AdvancedFactions._getTeam(token.actor);
                if (teamId) {
                    const teams = AdvancedFactions.getTeams();
                    const team = teams.find(t => t.id === teamId);

                    if (team && team.gmDisposition !== undefined) {
                        disposition = parseInt(team.gmDisposition);
                    } else {
                        disposition = token.document.disposition;
                    }
                } else {
                    disposition = token.document.disposition;
                }
            }
        } else if (viewerActor) {
            disposition = AdvancedFactions.getDisposition(viewerActor, token.actor);
        } else {
            disposition = token.document.disposition;
        }

        const D = CONST.TOKEN_DISPOSITIONS;
        let colorHex, colorExHex;

        if (disposition === D.FRIENDLY) {
            colorHex = game.settings.get("token-factions", "friendlyColor");
            colorExHex = game.settings.get("token-factions", "friendlyColorEx");
        } else if (disposition === D.HOSTILE) {
            colorHex = game.settings.get("token-factions", "hostileColor");
            colorExHex = game.settings.get("token-factions", "hostileColorEx");
        } else {
            colorHex = game.settings.get("token-factions", "neutralColor");
            colorExHex = game.settings.get("token-factions", "neutralColorEx");
        }


        if (!game.user.isGM && token.isOwner) {
            colorHex = game.settings.get("token-factions", "controlledColor");
            colorExHex = game.settings.get("token-factions", "controlledColorEx");
        } else if (token.actor?.hasPlayerOwner) {
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

    _dispositionKey: (token) => {
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
    },

    init: () => {
        AdvancedFactions.patchTokenBorder();
    },

    patchTokenBorder: () => {
        const original = Token.prototype._getBorderColor;
        Token.prototype._getBorderColor = function () {
            if (game.settings.get("token-factions", "color-from") !== "advanced-factions") {
                return original.apply(this);
            }

            const colors = CONFIG.Canvas.dispositionColors;
            if (this.controlled || (this.isOwner && !game.user.isGM)) return colors.CONTROLLED;
            let disposition;
            const viewerActor = game.user.character || canvas.tokens.controlled[0]?.actor;

            if (game.user.isGM) {
                if (viewerActor) {
                    disposition = AdvancedFactions.getDisposition(viewerActor, this);
                } else {

                    const teamId = AdvancedFactions._getTeam(this);
                    if (teamId) {
                        const teams = AdvancedFactions.getTeams();
                        const team = teams.find(t => t.id === teamId);
                        if (team && team.gmDisposition !== undefined) {
                            disposition = parseInt(team.gmDisposition);
                        } else {
                            disposition = this.document.disposition;
                        }
                    } else {
                        disposition = this.document.disposition;
                    }
                }
            } else if (viewerActor) {
                disposition = AdvancedFactions.getDisposition(viewerActor, this);
            } else {

                disposition = this.document.disposition;
            }

            const D = CONST.TOKEN_DISPOSITIONS;
            switch (disposition) {
                case D.SECRET: return colors.SECRET;
                case D.HOSTILE: return colors.HOSTILE;
                case D.NEUTRAL: return colors.NEUTRAL;
                case D.FRIENDLY: return this.actor?.hasPlayerOwner ? colors.PARTY : colors.FRIENDLY;
                default: return original.apply(this);
            }
        }
    },

    renderTokenHUD: (app, html) => {

        if (!game.user.isGM) return;

        const token = app.object;
        const currentTeamId = AdvancedFactions._getTeam(token) || "";
        const teams = AdvancedFactions.getTeams();
        const disableBorder = token.document.getFlag("token-factions", "disableBorder") || false;


        const button = $(`
            <div class="control-icon faction-selector ${disableBorder ? "active" : ""}" title="Left-Click: Team\nRight-Click: Toggle Border">
                <i class="fas fa-users"></i>
            </div>
        `);


        button.click(async (event) => {
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
                render: (html) => {
                    html.find('[name="teamId"]').change(async (e) => {
                        const newTeamId = e.target.value;


                        const tokens = canvas.tokens.controlled.length > 0 ? canvas.tokens.controlled : [token];

                        for (const t of tokens) {
                            const updateData = {
                                "flags.token-factions.team": newTeamId
                            };


                            const team = teams.find(team => team.id === newTeamId);
                            if (team && team.gmDisposition !== undefined) {

                                updateData.disposition = parseInt(team.gmDisposition);
                            }

                            await t.document.update(updateData);


                            if (t.document.isLinked) {
                                const protoUpdate = {
                                    "prototypeToken.flags.token-factions.team": newTeamId
                                };
                                if (updateData.disposition !== undefined) {
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


        button.contextmenu(async (event) => {
            const currentState = token.document.getFlag("token-factions", "disableBorder") || false;
            const newState = !currentState;


            const tokens = canvas.tokens.controlled.length > 0 ? canvas.tokens.controlled : [token];

            for (const t of tokens) {
                await t.document.setFlag("token-factions", "disableBorder", newState);
                t.refresh();
            }


            event.currentTarget.classList.toggle("active", newState);
        });


        html.find('.col.right').append(button);
    },

    addFolderContextOptions: (html, options) => {
        options.push({
            name: "Assign Team",
            icon: '<i class="fas fa-users"></i>',
            condition: (header) => game.user.isGM,
            callback: (header) => {
                const folderId = header.closest(".directory-item")[0].dataset.folderId;
                const folder = game.folders.get(folderId);
                const teams = AdvancedFactions.getTeams();

                if (!folder) return;

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
                    render: (html) => {
                        html.find('[name="teamId"]').change(async (e) => {
                            const newTeamId = e.target.value;
                            d.close();


                            const actorsToUpdate = AdvancedFactions._recursivelyGetActors(folder);

                            if (actorsToUpdate.length === 0) {
                                ui.notifications.warn("No actors found in this folder.");
                                return;
                            }

                            ui.notifications.info(`Updating ${actorsToUpdate.length} actors...`);

                            // Update them
                            const updates = actorsToUpdate.map(a => {
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

    _recursivelyGetActors: (folder) => {
        let actors = folder.contents;


        const subfolders = folder.children.map(c => c.folder);
        for (const sub of subfolders) {
            if (sub) {
                actors = actors.concat(AdvancedFactions._recursivelyGetActors(sub));
            }
        }
        return actors;
    }
}
