class Component extends DCLogic {
  state = {
    role: null, roleMenu: false, planMenu: false, picker: null, transparency: "full", cdaKind: "standard",
    sides: [
      { id: "listing", title: "Listing Side", subline: "Circle Real Estate", groupLead: { id: "gl1", name: "Andy Martin" }, agents: [{ id: "a1", name: "Mark Perez", role: "Primary agent" }] },
      { id: "buyer", title: "Buying Side", subline: "Jeanne Gould", agents: [] },
    ],
    awards: { listing: 50, buyer: 50 }, awardAmounts: { listing: 49500, buyer: 49500 },
    selectedSide: "listing", selectedAgentId: "a1", expandedSideAgent: null,
    appliedPlans: { a1: "p1" }, appliedPostCap: {},
    sideGross: { listing: [{ id: "sg1", name: "Credits", amount: 50 }, { id: "sg2", name: "Referral", amount: 20 }], buyer: [{ id: "sg1", name: "Credits", amount: 50 }, { id: "sg2", name: "Referral", amount: 20 }] },
    preSplit: {}, postSplit: { a1: [
      { id: "d1", name: "File Review Fee", amount: 25, isRadiusFee: true }, { id: "d2", name: "RERM", amount: 124, isRadiusFee: true },
      { id: "d3", name: "SBTC", amount: 400, wireRequired: true }, { id: "d4", name: "E&O", amount: 250, wireRequired: true },
      { id: "d5", name: "TC Fee", amount: 500, isRadiusFee: true, wireRequired: true }, { id: "d6", name: "RM Fee", amount: 300 },
      { id: "d7", name: "Team Admin Fee", amount: 250, payableToType: "team", wireRequired: true, wireMode: "team" },
      { id: "d8", name: "Vendor Referral Fee", amount: 500, payableToType: "agent", wireRequired: true, wireMode: "external" },
    ] },
    openWireId: null, txStatus: "draft", hasReopened: false, cdaState: "generated", rejectionNote: "",
    feed: [
      { id: "ac1", author: "Jessica Hall", role: "radius_auditing", text: "Commission breakdown draft created for " + PROPERTY + ".", timestamp: "May 12, 2026 · 10:08 AM", kind: "activity" },
      { id: "ac2", author: "Jessica Hall", role: "radius_auditing", text: "Commission allocation updated for Listing Side to 1%.", timestamp: "May 12, 2026 · 10:14 AM", kind: "activity" },
      { id: "ac3", author: "Jessica Hall", role: "radius_auditing", text: "Added pre-split deduction Credits on Listing Side at $200.", timestamp: "May 12, 2026 · 10:16 AM", kind: "activity" },
      { id: "ac4", author: "Jessica Hall", role: "radius_auditing", text: "Added pre-split deduction Referrals on Listing Side at $50.", timestamp: "May 12, 2026 · 10:18 AM", kind: "activity" },
      { id: "cm1", author: "Mark Perez", role: "agent", text: "@Jessica Hall can you double-check the E&O amount? Last deal it was $200.", timestamp: "May 12, 2026 · 11:02 AM", kind: "comment" },
      { id: "cm2", author: "Jessica Hall", role: "radius_auditing", text: "Confirmed with compliance — $250 is correct for 2026 closings.", timestamp: "May 12, 2026 · 11:20 AM", kind: "comment" },
    ],
    comment: "", activityView: "comments", sheet: null, dialog: null, toast: null,
    cf: { type: "Credits", amount: "", payableTo: "radius", payableName: "", target: "side", editId: null },
    agentSearch: "", pendingAgent: null, addAgentRole: "Co-agent", addAgentSide: "buyer",
    sendTo: ["escrow@pacifictitle.com"], sendCc: [], sendToInput: "", sendCcInput: "", sendSubject: "CDA — 1284 Willow Creek Dr", sendBody: "Hi,\n\nPlease find the Commission Disbursement Authorization for 1284 Willow Creek Dr attached.\n\nThanks,\nJessica Hall\nRadius Auditing",
    rejectInput: "", pcd: { scope: "agent", feeType: "both", feeAmount: "5", fixedAmount: "495", basis: "gross", behavior: "remaining-balance" }, pcOverrides: {},
    pf: { planName: "", agentSplit: "80", teamSplit: "20", feeAmount: "" }, dealPlans: [], deleteAgentId: null,
  };
  toast(msg) { clearTimeout(this._t); this.setState({ toast: msg }); this._t = setTimeout(() => this.setState({ toast: null }), 2200); }
  log(text) { const role = this.role(); const author = role === "agent" ? "Mark Perez" : role === "team_lead" ? "Andy Martin" : "Jessica Hall"; this.setState(s => ({ feed: [...s.feed, { id: uid(), author, role, text, timestamp: "Just now", kind: "activity" }] })); }
  role() { return this.state.role || this.props.role || "radius_auditing"; }
  componentWillUnmount() { clearTimeout(this._t); }
  renderVals() {
    const s = this.state, role = this.role();
    const isAgent = role === "agent", isTL = role === "team_lead" || role === "group_lead", isAuditor = role === "radius_auditing" || role === "soul_auditor";
    const canEditAll = isAuditor, isLocked = s.txStatus === "processed";
    const set = (p) => this.setState(p), stop = (e) => e.stopPropagation();
    const totalGross = SALE_PRICE * RATE;
    const allPlans = [...PLANS, ...s.dealPlans];
    const awardTotal = Object.values(s.awards).reduce((a, b) => a + b, 0) || 1;
    const sideCalc = {};
    s.sides.forEach(side => {
      const pct = Math.round(s.awards[side.id] / awardTotal * 100);
      const gross = totalGross * pct / 100;
      const grossDed = (s.sideGross[side.id] || []).reduce((a, d) => a + d.amount, 0);
      const after = Math.max(0, gross - grossDed);
      const visibleAgents = side.agents.filter(a => !isAgent || a.id === "a1");
      const agents = side.agents.map(ag => {
        const plan = allPlans.find(p => p.id === s.appliedPlans[ag.id]);
        const pre = (s.preSplit[ag.id] || []).reduce((a, d) => a + d.amount, 0);
        const basis = Math.max(0, after - pre);
        const splitRate = plan ? plan.agentSplit / 100 : 0;
        const split = basis * splitRate;
        const radiusFee = plan ? plan.feeAmount : 0;
        const capAmount = plan ? plan.capAmount : 0, capUsed = CAP_PROGRESS[ag.id] || 0;
        const teamCapReached = capAmount > 0 && capUsed >= capAmount;
        const rUsed = RADIUS_CAP_PROGRESS[ag.id] || 0, radiusCapReached = rUsed >= RADIUS_CAP;
        const picked = s.appliedPostCap[ag.id] || {};
        const agentPc = s.pcOverrides[ag.id + "::agent"] || POSTCAP.find(p => p.id === (picked.agent || "pc-agent-default"));
        const teamPc = s.pcOverrides[ag.id + "::team"] || POSTCAP.find(p => p.id === (picked.team || "pc-team-default"));
        const postCapFee = plan && radiusCapReached ? postCapAmount(agentPc, gross) : 0;
        const teamPostCapFee = plan && teamCapReached ? postCapAmount(teamPc, gross) : 0;
        const postDeds = (s.postSplit[ag.id] || []);
        const showRadiusFee = !(plan && plan.radiusFeePaidBy === "team" && isAgent);
        const postTotal = postDeds.filter(d => showRadiusFee || !d.isRadiusFee).reduce((a, d) => a + d.amount, 0);
        const net = plan ? Math.max(0, split - (showRadiusFee ? radiusFee : 0) - postCapFee - teamPostCapFee - postTotal) : 0;
        const team = plan ? basis - split + teamPostCapFee : 0;
        return { ag, plan, pre, basis, splitRate, split, radiusFee, capAmount, capUsed, teamCapReached, rUsed, radiusCapReached, agentPc, teamPc, postCapFee, teamPostCapFee, postDeds, postTotal, net, team, showRadiusFee };
      });
      const agentsPayout = agents.reduce((a, x) => a + x.net, 0);
      const radiusTotal = agents.reduce((a, x) => a + (x.plan ? x.radiusFee + x.postCapFee : 0), 0) + agents.reduce((a, x) => a + x.postDeds.filter(d => d.isRadiusFee).reduce((b, d) => b + d.amount, 0), 0);
      const teamNet = agents.reduce((a, x) => a + x.team, 0) + agents.reduce((a, x) => a + x.postDeds.filter(d => d.payableToType === "team").reduce((b, d) => b + d.amount, 0), 0);
      sideCalc[side.id] = { pct, gross, grossDed, after, agents, agentsPayout, radiusTotal, teamNet, visibleAgents };
    });
    const selSide = s.sides.find(x => x.id === s.selectedSide) || s.sides[0];
    const selCalc = sideCalc[selSide.id];
    const selAgentCalc = s.selectedAgentId ? selCalc.agents.find(x => x.ag.id === s.selectedAgentId) : null;
    const agentSelected = !!selAgentCalc;
    const sc = selAgentCalc;
    const meta = (r) => ROLE_META[r] || ROLE_META.agent;
    const feedRow = (c) => { const m = meta(c.role); return { ...c, initials: initials(c.author), avBg: m.avBg, avFg: m.avFg, roleLabel: m.label, roleBorder: m.border, roleBg: m.bg, roleFg: m.fg, isActivity: c.kind === "activity" }; };
    const comments = s.feed.filter(c => c.kind === "comment");
    const feedItems = s.activityView === "comments" ? comments : s.activityView === "activity" ? s.feed.filter(c => c.kind === "activity") : s.feed;
    const postComment = () => { const t = s.comment.trim(); if (!t) return; const author = isAgent ? "Mark Perez" : isTL ? "Andy Martin" : "Jessica Hall"; this.setState(st => ({ comment: "", feed: [...st.feed, { id: uid(), author, role, text: t, timestamp: "Just now", kind: "comment" }] })); };
    const st = STATUS[s.txStatus], cs = CDA_STATE[s.cdaState];
    const closeDialog = () => set({ dialog: null, sheet: null, planMenu: false, picker: null, deleteAgentId: null });
    const wireAlert = isAgent ? "Complete your wire instructions in settings before commission breakdown can be finalized." : isTL ? "Complete team wire instructions in settings before commission breakdown can be finalized." : "Wire instructions incomplete for Vendor Referral Fee. PDF download blocked.";
    const wireIncomplete = (d) => d.wireMode === "external";
    const comboLabel = TRANSPARENCY.find(t => t[0] === s.transparency)[1] + " · " + CDA_KINDS.find(k => k[0] === s.cdaKind)[1];
    const d = s.dialog;
    const dialogs = {
      award: { title: "Commission distribution", desc: "Set commission percentage and flat amount per side of the deal.", action: "Save", width: "448px", run: () => { const total = Object.values(s.awards).reduce((a, b) => a + b, 0) || 1; const norm = {}; Object.keys(s.awards).forEach(k => norm[k] = Math.round(s.awards[k] / total * 100)); set({ awards: norm, dialog: null }); this.log("Updated commission allocation."); this.toast("Commission distribution saved"); } },
      credit: { title: s.cf.editId ? "Edit " + (s.cf.type || "Fee") : "Add credit or referral", desc: s.cf.editId ? "Update the fee details below." : "Payable to is set in this flow. Wire instructions come later.", action: s.cf.editId ? "Save changes" : "Add Credit", width: "448px", run: () => {
        const amt = num(s.cf.amount), name = s.cf.type || "Credit", cf = s.cf;
        if (cf.target === "agentPost") { this.setState(x => ({ postSplit: { ...x.postSplit, a1: cf.editId ? (x.postSplit[s.selectedAgentId] || []).map(dd => dd.id === cf.editId ? { ...dd, name, amount: amt } : dd) : [...(x.postSplit[s.selectedAgentId] || []), { id: uid(), name, amount: amt, payableToType: cf.payableTo === "team" ? "team" : cf.payableTo === "external" ? "agent" : undefined, wireRequired: cf.payableTo === "external", wireMode: cf.payableTo === "external" ? "external" : undefined }] }, dialog: null })); }
        else if (cf.target === "agentPre") { this.setState(x => ({ preSplit: { ...x.preSplit, [s.selectedAgentId]: [...(x.preSplit[s.selectedAgentId] || []), { id: uid(), name, amount: amt }] }, dialog: null })); }
        else { this.setState(x => ({ sideGross: { ...x.sideGross, [selSide.id]: cf.editId ? (x.sideGross[selSide.id] || []).map(dd => dd.id === cf.editId ? { ...dd, name, amount: amt } : dd) : [...(x.sideGross[selSide.id] || []), { id: uid(), name, amount: amt }] }, dialog: null })); }
        this.log((cf.editId ? "Updated " : "Added ") + name + " on " + selSide.title + " at " + cur(amt) + "."); this.toast(cf.editId ? "Fee updated" : "Credit/Referral added"); } },
      addAgent: { title: "Add agent", desc: "Search the team roster and add an agent to " + (s.sides.find(x => x.id === s.addAgentSide) || selSide).title + ".", action: "Add agent", width: "448px", run: () => { const c = CONTACTS.find(x => x.id === s.pendingAgent); if (!c) { this.toast("Pick an agent first"); return; } this.setState(x => ({ sides: x.sides.map(sd => sd.id === s.addAgentSide ? { ...sd, agents: [...sd.agents, { id: c.id, name: c.name, role: s.addAgentRole }] } : sd), dialog: null, selectedSide: s.addAgentSide, selectedAgentId: c.id, pendingAgent: null, agentSearch: "" })); this.log("Added " + c.name + " to " + s.addAgentSide + " side."); this.toast(c.name + " added"); } },
      confirm: { title: isAuditor ? "Finalize commission breakdown?" : "Confirm commission breakdown?", desc: isAuditor ? "This locks the breakdown for " + PROPERTY + " and unlocks the CDA for sending." : "You're confirming the splits, fees and payouts shown for " + PROPERTY + ".", action: isAuditor ? "Finalize" : "Confirm", width: "448px", run: () => { const next = isAuditor ? "processed" : isTL ? "team_lead_confirmed" : "agent_confirmed"; set({ txStatus: next, dialog: null, rejectionNote: "" }); const msg = isAuditor ? "Commission breakdown for " + PROPERTY + " finalized" : (isTL ? "Team lead" : "Agent") + " confirmed commission breakdown for " + PROPERTY; this.log(msg); this.toast(isAuditor ? msg : "Breakdown Confirmed"); } },
      reopen: { title: "Reopen for edits?", desc: "The breakdown will go back to draft and need to be re-approved by Agent, Team Lead, and Auditor.", action: "Reopen", width: "448px", run: () => { set({ txStatus: "draft", hasReopened: true, dialog: null }); this.log("Reopened commission breakdown for edits."); this.toast("Reopened for edits"); } },
      reject: { title: "Return for edits", desc: "Send the breakdown back to the team with a note.", action: "Return", width: "448px", destructive: true, run: () => { set({ txStatus: "rejected", rejectionNote: s.rejectInput, dialog: null, rejectInput: "" }); this.log("Returned commission breakdown for edits: " + s.rejectInput); this.toast("Returned for edits"); } },
      sendConfirm: { title: "Send CDA for signature?", desc: "The CDA will be sent using " + comboLabel + ".", action: "Continue", width: "448px", run: () => set({ dialog: "send" }) },
      send: { title: "Send CDA", desc: "", action: "Send", width: "640px", run: () => { if (!s.sendTo.length) return; set({ cdaState: "sent", dialog: null }); this.log("CDA sent to " + s.sendTo.join(", ") + "."); this.toast("CDA sent"); } },
      deleteCda: { title: "Delete CDA draft?", desc: "This removes the generated CDA. You can generate a new one at any time.", action: "Delete", width: "440px", destructive: true, run: () => { set({ cdaState: "none", dialog: null }); this.log("Deleted CDA draft."); this.toast("CDA deleted"); } },
      deleteAgent: { title: "Remove agent from this side?", desc: (sc ? sc.ag.name : "This agent") + " will be removed along with their splits and deductions on this deal.", action: "Remove", width: "440px", destructive: true, run: () => { const id = s.selectedAgentId; this.setState(x => ({ sides: x.sides.map(sd => ({ ...sd, agents: sd.agents.filter(a => a.id !== id) })), selectedAgentId: null, dialog: null })); this.log("Removed agent from " + selSide.title + "."); this.toast("Agent removed"); } },
      gross: { title: "Total gross commission", desc: "How the total is calculated for this deal.", action: null, width: "448px" },
      postcap: { title: (s.pcd.scope === "team" ? "Team" : "Radius") + " post-cap fee", desc: "Override the post-cap fee for this agent on this deal only.", action: "Save", width: "520px", run: () => { const p = s.pcd; this.setState(x => ({ pcOverrides: { ...x.pcOverrides, [s.selectedAgentId + "::" + p.scope]: { label: (p.scope === "team" ? "Team" : "Radius") + " post-cap (deal)", feeType: p.feeType, feeAmount: num(p.feeAmount), fixedAmount: num(p.fixedAmount), basis: p.basis } }, dialog: null })); this.toast("Post-cap fee updated"); } },
      plan: { title: "Create plan for this deal", desc: "Applies to this CDA only. Won't save to settings.", action: "Create & apply", width: "560px", run: () => { const p = s.pf; if (!p.planName.trim()) { this.toast("Plan name is required"); return; } if (num(p.agentSplit) + num(p.teamSplit) !== 100) { this.toast("Splits must total 100%"); return; } const plan = { id: uid(), name: p.planName.trim(), detail: p.agentSplit + "% agent · " + p.teamSplit + "% team", feeAmount: num(p.feeAmount), capAmount: 18000, agentSplit: num(p.agentSplit), teamSplit: num(p.teamSplit), radiusFeePaidBy: "agent", creator: "You", dealScoped: true }; this.setState(x => ({ dealPlans: [...x.dealPlans, plan], appliedPlans: { ...x.appliedPlans, [s.selectedAgentId]: plan.id }, dialog: null })); this.log("Created deal-only plan " + plan.name + "."); this.toast("\"" + plan.name + "\" applied"); } },
    };
    const dlg = d ? dialogs[d] : null;
    const applyPlan = (agentId, plan) => { this.setState(x => ({ appliedPlans: { ...x.appliedPlans, [agentId]: plan.id }, planMenu: false })); this.log("Applied commission plan " + plan.name + " to " + (sc ? sc.ag.name : "agent") + "."); this.toast("\"" + plan.name + "\" applied"); };
    const capCard = (variant, c) => {
      const reached = variant === "radius" ? c.radiusCapReached : c.teamCapReached;
      const capAmount = variant === "radius" ? RADIUS_CAP : c.capAmount, used = variant === "radius" ? c.rUsed : c.capUsed;
      const pc = variant === "radius" ? c.agentPc : c.teamPc;
      const near = !reached && capAmount > 0 && capAmount - used <= 2500;
      return { label: variant === "radius" ? "Radius Cap" : "Team Cap", isRadius: variant === "radius", isTeam: variant === "team", reached, notReached: !reached,
        border: reached ? "rgba(253,230,138,.7)" : near ? "rgba(90,95,242,.2)" : "rgba(90,95,242,.15)", bg: reached ? "linear-gradient(135deg,rgba(255,251,235,.7),#fff 50%,rgba(90,95,242,.04))" : near ? "linear-gradient(135deg,rgba(90,95,242,.06),#fff 50%,rgba(255,251,235,.5))" : "linear-gradient(135deg,rgba(90,95,242,.04),#fff)",
        iconBorder: variant === "radius" ? "rgba(90,95,242,.2)" : "rgba(253,230,138,.7)", iconBg: variant === "radius" ? "rgba(90,95,242,.1)" : "#fffbeb", iconFg: variant === "radius" ? "#5A5FF2" : "#d97706",
        usedLabel: reached ? cur(capAmount) : cur(used), ofLabel: reached ? "reached" : "of " + cur(capAmount), pct: (capAmount > 0 ? Math.min(100, used / capAmount * 100) : 0) + "%",
        feeText: feeText(pc), planName: pc ? pc.label : "", pickPlan: (e) => { e.stopPropagation(); const opts = POSTCAP.filter(p => p.scope === variant); const cur0 = opts.findIndex(p => p.id === pc.id); const nxt = opts[(cur0 + 1) % opts.length]; this.setState(x => ({ appliedPostCap: { ...x.appliedPostCap, [c.ag.id]: { ...(x.appliedPostCap[c.ag.id] || {}), [variant === "radius" ? "agent" : "team"]: nxt.id } } })); this.toast("\"" + nxt.label + "\" applied to " + c.ag.name); } };
    };
    const STAT_ICONS = { up: "M22 7 13.5 15.5 8.5 10.5 2 17M16 7h6v6", dollar: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", building: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18ZM6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" };
    const scopedPayout = isAgent ? (selCalc.agents.find(x => x.ag.id === "a1") || { net: 0 }).net : selCalc.agentsPayout;
    return {
      meInitial: isAgent ? "M" : isTL ? "A" : "J", meName: isAgent ? "Mark Perez" : isTL ? "Andy Martin" : "Jessica Hall", meRole: meta(role).label,
      roleLabel: ROLES.find(r => r[0] === role)[1], roleMenuOpen: s.roleMenu, toggleRoleMenu: (e) => { e.stopPropagation(); set({ roleMenu: !s.roleMenu, planMenu: false, picker: null }); },
      roleOptions: ROLES.map(([id, label]) => ({ label, bg: id === role ? "#F5F5F5" : "transparent", pick: (e) => { e.stopPropagation(); set({ role: id, roleMenu: false }); } })),
      closeMenus: () => { if (s.roleMenu || s.planMenu || s.picker) set({ roleMenu: false, planMenu: false, picker: null }); },
      stop, closeDialog,
      showStatusBadge: !isAgent, statusLabel: st.label, statusBorder: st.border, statusBg: st.bg, statusFg: st.fg,
      openActivity: () => set({ sheet: "activity", activityView: "activity" }), openComments: () => set({ sheet: "activity", activityView: "comments" }),
      showConfirm: (isAgent || role === "team_lead") && !isLocked, confirmDisabled: isAgent ? s.txStatus !== "draft" && s.txStatus !== "rejected" : s.txStatus !== "agent_confirmed", confirmOpacity: (isAgent ? (s.txStatus === "draft" || s.txStatus === "rejected") : s.txStatus === "agent_confirmed") ? 1 : .5, openConfirm: () => set({ dialog: "confirm" }),
      showFinalize: isAuditor && !isLocked, finalizeDisabled: s.txStatus !== "team_lead_confirmed", finalizeOpacity: s.txStatus === "team_lead_confirmed" ? 1 : .5, openProcess: () => set({ dialog: "confirm" }),
      showReturn: isAuditor && s.txStatus === "team_lead_confirmed", openReject: () => set({ dialog: "reject" }),
      isProcessed: isLocked, isAuditor, toastDownload: () => this.toast("Signed CDA downloaded"), openPdf: () => this.toast("CDA PDF preview — Finalized PDF screen next"), openSendConfirm: () => set({ dialog: "sendConfirm" }),
      showWireAlert: (isAgent && !this.props.agentWireComplete) || (isTL && !this.props.teamWireComplete) || (isAuditor && !isLocked && (s.postSplit.a1 || []).some(wireIncomplete)), wireAlertText: wireAlert,
      showFinalizedBanner: isLocked && isAuditor && !s.hasReopened, openReopen: () => set({ dialog: "reopen" }), showReopened: s.hasReopened && !isLocked,
      cdaLabel: cs.label, cdaBorder: cs.border, cdaBg: cs.bg, cdaFg: cs.fg,
      cdaShowGenerate: s.cdaState === "none" && isAuditor, cdaAwaiting: s.cdaState === "none" && !isAuditor, cdaShowSend: s.cdaState === "generated", cdaShowRegen: s.cdaState !== "none" && s.cdaState !== "signed",
      toggleGenPicker: (e) => { e.stopPropagation(); set({ picker: s.picker === "gen" ? null : "gen" }); }, toggleRegenPicker: (e) => { e.stopPropagation(); set({ picker: s.picker === "regen" ? null : "regen" }); },
      pickerOpen: !!s.picker, pickerConfirmLabel: s.picker === "gen" ? "Generate" : "Regenerate",
      transparencyOptions: TRANSPARENCY.map(([id, label, def]) => ({ label, isDefault: def, active: s.transparency === id, pick: (e) => { e.stopPropagation(); set({ transparency: id }); } })),
      cdaKindOptions: CDA_KINDS.map(([id, label, def]) => ({ label, isDefault: def, active: s.cdaKind === id, pick: (e) => { e.stopPropagation(); set({ cdaKind: id }); } })),
      confirmPicker: (e) => { e.stopPropagation(); const gen = s.picker === "gen"; set({ cdaState: "generated", picker: null }); this.log((gen ? "Generated" : "Regenerated") + " CDA (" + comboLabel + ")."); this.toast(gen ? "CDA generated" : "CDA regenerated"); },
      openSend: () => set({ dialog: "send" }), openDeleteCda: () => set({ dialog: "deleteCda" }), openGrossInfo: () => set({ dialog: "gross" }),
      totalGross: cur(totalGross), comboLabel,
      canEditSides: !isAgent && !isLocked, awardCursor: !isAgent && !isLocked ? "pointer" : "default",
      sides: s.sides.map((side, i) => { const c = sideCalc[side.id]; return { ...side, borderTop: i ? "1px solid #E5E5E5" : "none", headBg: s.selectedSide === side.id ? "rgba(90,95,242,.035)" : "transparent", awardPct: c.pct, total: cur(isAgent ? (c.agents.find(x => x.ag.id === "a1") || { net: 0 }).net : c.agentsPayout + c.teamNet), hasGroupLead: !!side.groupLead && c.visibleAgents.length > 0, groupLeadName: side.groupLead ? side.groupLead.name : "",
        openAward: (e) => { e.stopPropagation(); if (!isAgent && !isLocked) set({ dialog: "award" }); }, openAddAgent: (e) => { e.stopPropagation(); set({ dialog: "addAgent", addAgentSide: side.id, agentSearch: "", pendingAgent: null }); },
        select: (e) => { e.stopPropagation(); set({ selectedSide: side.id, selectedAgentId: null }); },
        agents: c.visibleAgents.map(ag => { const ac = c.agents.find(x => x.ag.id === ag.id); const sel = s.selectedAgentId === ag.id; return { ...ag, initials: initials(ag.name), payout: cur(ac ? ac.net : 0), bg: sel ? "#F5F5F5" : "rgba(245,245,245,.5)", shadow: sel ? "0 0 0 1px #E5E5E5,0 1px 3px rgba(0,0,0,.1)" : "none", select: (e) => { e.stopPropagation(); set({ selectedSide: side.id, selectedAgentId: ag.id }); } }; }) }; }),
      agentSelected, sideSelected: !agentSelected,
      selSideTitle: selSide.title, selAgentRole: sc ? sc.ag.role : "", selAgentName: sc ? sc.ag.name : "", selAgentInitials: sc ? initials(sc.ag.name) : "",
      canPickPlan: !isAgent, planMenuOpen: s.planMenu, togglePlanMenu: (e) => { e.stopPropagation(); set({ planMenu: !s.planMenu, roleMenu: false }); },
      planBtnLabel: sc && sc.plan ? sc.plan.name : "No plan selected", planBtnColor: sc && sc.plan ? "#0A0A0A" : "#737373", planIsDealOnly: !!(sc && sc.plan && sc.plan.dealScoped),
      planOptions: allPlans.map(p => ({ name: p.name, meta: [p.creator, p.detail].filter(Boolean).join(" · "), dealScoped: !!p.dealScoped, pick: (e) => { e.stopPropagation(); if (sc) applyPlan(sc.ag.id, p); } })),
      openCreatePlan: (e) => { if (e) e.stopPropagation(); set({ dialog: "plan", planMenu: false, pf: { planName: "", agentSplit: "80", teamSplit: "20", feeAmount: "" } }); },
      openDeleteAgent: () => set({ dialog: "deleteAgent" }),
      noPlan: !!sc && !sc.plan, hasPlan: !!sc && !!sc.plan,
      capCards: sc && sc.plan ? [capCard("radius", sc), capCard("team", sc)] : [],
      basis: sc ? cur(sc.basis) : "", canEditLedger: (isTL || canEditAll) && !isLocked,
      preSplit: sc ? (s.preSplit[sc.ag.id] || []).map(dd => ({ ...dd, amount: cur(dd.amount), remove: () => this.setState(x => ({ preSplit: { ...x.preSplit, [sc.ag.id]: (x.preSplit[sc.ag.id] || []).filter(y => y.id !== dd.id) } })) })) : [],
      openCreditAgentPre: () => set({ dialog: "credit", cf: { type: "Credits", amount: "", payableTo: "radius", payableName: "", target: "agentPre", editId: null } }),
      openCreditAgentPost: () => set({ dialog: "credit", cf: { type: "Credits", amount: "", payableTo: "radius", payableName: "", target: "agentPost", editId: null } }),
      openCreditSide: () => set({ dialog: "credit", cf: { type: "Credits", amount: "", payableTo: "radius", payableName: "", target: "side", editId: null } }),
      splitNote: sc ? (sc.teamCapReached ? "Adjusted by cap logic" : sc.capAmount > 0 && sc.capAmount - sc.capUsed <= 2500 ? "Cap warning: " + cur(sc.capAmount - sc.capUsed) + " left" : Math.round((sc.plan ? sc.plan.teamSplit : 0)) + "% team split") : "", splitAmt: sc ? cur(sc.split) : "",
      teamPostCapApplies: !!(sc && sc.plan && sc.teamCapReached), teamPostCapType: sc ? feeText(sc.teamPc) : "", teamPostCapAmt: sc ? cur(sc.teamPostCapFee) : "",
      openTeamPostCap: () => { const p = sc.teamPc; set({ dialog: "postcap", pcd: { scope: "team", feeType: p.feeType, feeAmount: String(p.feeAmount), fixedAmount: p.fixedAmount != null ? String(p.fixedAmount) : "", basis: p.basis, behavior: "remaining-balance" } }); },
      showRadiusFee: !!(sc && sc.showRadiusFee), planName: sc && sc.plan ? sc.plan.name : "", radiusFeeAmt: sc ? cur(sc.radiusFee) : "",
      postCapApplies: !!(sc && sc.plan && sc.radiusCapReached), postCapPlanName: sc ? sc.agentPc.label : "", postCapType: sc ? feeText(sc.agentPc) : "", postCapAmt: sc ? cur(sc.postCapFee) : "",
      openAgentPostCap: () => { const p = sc.agentPc; set({ dialog: "postcap", pcd: { scope: "agent", feeType: p.feeType, feeAmount: String(p.feeAmount), fixedAmount: p.fixedAmount != null ? String(p.fixedAmount) : "", basis: p.basis, behavior: "remaining-balance" } }); },
      postSplit: sc ? sc.postDeds.filter(dd => sc.showRadiusFee || !dd.isRadiusFee).map(dd => { const bad = wireIncomplete(dd); return { ...dd, amount: cur(dd.amount), wire: !!dd.wireRequired, wireColor: bad ? "#d97706" : "#059669", wireOpen: s.openWireId === dd.id,
        badge: dd.payableToType === "team" ? "Team" : dd.isRadiusFee ? "Radius" : "Post-split", badgeBg: dd.payableToType === "team" ? "#eff6ff" : "#F5F5F5", badgeFg: dd.payableToType === "team" ? "#1d4ed8" : "#737373",
        wireStatus: bad ? "Incomplete" : "Complete", wireBorder: bad ? "#fde68a" : "#a7f3d0", wireBg: bad ? "#fffbeb" : "#ecfdf5", wireFg: bad ? "#b45309" : "#047857",
        wireText: bad ? "Escrow to contact vendor directly for payment instructions." : dd.wireMode === "team" ? "Paid to team wire · Chase · Acct ••••3310 · Routing ••••0021" : "Paid to Radius operating account · Wells Fargo · Acct ••••4821",
        toggleWire: (e) => { e.stopPropagation(); set({ openWireId: s.openWireId === dd.id ? null : dd.id }); },
        edit: () => set({ dialog: "credit", cf: { type: dd.name, amount: String(dd.amount), payableTo: dd.payableToType === "team" ? "team" : dd.wireMode === "external" ? "external" : "radius", payableName: "", target: "agentPost", editId: dd.id } }),
        remove: () => { this.setState(x => ({ postSplit: { ...x.postSplit, [sc.ag.id]: (x.postSplit[sc.ag.id] || []).filter(y => y.id !== dd.id) } })); this.log("Removed " + dd.name + " from " + sc.ag.name + "."); } }; }) : [],
      netAmt: sc ? cur(sc.net) : "", teamAmt: sc ? cur(sc.team) : "", showGroup: isTL || isAuditor, groupAmt: sc ? cur(sc.team * 0.25) : "",
      previewComments: comments.slice(0, 4).map(feedRow), noPreviewComments: comments.length === 0,
      tagPeople: TAG_PEOPLE.map(p => ({ name: p.name, tag: () => set({ comment: s.comment + (s.comment.trim() ? " " : "") + "@" + p.name + " " }) })),
      comment: s.comment, setComment: (e) => set({ comment: e.target.value }), commentKey: (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); postComment(); } },
      activeSideTitle: selSide.title, activeSideSubline: selSide.subline,
      sideStats: [
        { label: "Gross", value: cur(selCalc.gross), icon: STAT_ICONS.up, bg: "linear-gradient(135deg,#c7d2fe,#a5b4fc)", muted: "#6366f1", strong: "#1e1b4b" },
        { label: "After Deductions", value: cur(selCalc.after), icon: STAT_ICONS.dollar, bg: "linear-gradient(135deg,#ddd6fe,#c4b5fd)", muted: "#7c3aed", strong: "#2e1065" },
        { label: "To Agents", value: cur(scopedPayout), icon: STAT_ICONS.user, bg: "linear-gradient(135deg,#bbf7d0,#86efac)", muted: "#16a34a", strong: "#14532d" },
        { label: "To Team", value: cur(selCalc.teamNet), icon: STAT_ICONS.building, bg: "linear-gradient(135deg,#fef3c7,#fde68a)", muted: "#d97706", strong: "#451a03" },
      ],
      sideGross: cur(selCalc.gross), sideAfter: cur(selCalc.after), canEditSideDed: !isLocked,
      sideDeductions: (s.sideGross[selSide.id] || []).map(dd => ({ ...dd, amount: cur(dd.amount), edit: () => set({ dialog: "credit", cf: { type: dd.name, amount: String(dd.amount), payableTo: "radius", payableName: "", target: "side", editId: dd.id } }), remove: () => { this.setState(x => ({ sideGross: { ...x.sideGross, [selSide.id]: (x.sideGross[selSide.id] || []).filter(y => y.id !== dd.id) } })); this.log("Removed " + dd.name + " from " + selSide.title + "."); } })),
      sideAgentRows: selCalc.agents.filter(x => !isAgent || x.ag.id === "a1").map(x => { const ex = s.expandedSideAgent === x.ag.id; return { name: x.ag.name, net: cur(x.net), pre: cur(x.pre), post: cur(x.postTotal), expanded: ex, rot: ex ? "90deg" : "0deg", bg: ex ? "rgba(245,245,245,.3)" : "#fff", shadow: ex ? "0 1px 3px rgba(0,0,0,.1)" : "none", toggle: () => set({ expandedSideAgent: ex ? null : x.ag.id }) }; }),
      sideAgentsTotal: cur(selCalc.agentsPayout), showSideRadius: canEditAll || selCalc.radiusTotal > 0, sideRadius: cur(selCalc.radiusTotal), sideTeam: cur(selCalc.teamNet), sideGroup: cur(selCalc.teamNet * 0.25),
      toastVisible: !!s.toast, toastText: s.toast || "",
      sheetOpen: s.sheet === "activity", activityView: s.activityView, setActivityView: (e) => set({ activityView: e.target.value }), feed: feedItems.map(feedRow), noFeed: feedItems.length === 0,
      dialogOpen: !!dlg, dialogTitle: dlg ? dlg.title : "", dialogDesc: dlg ? dlg.desc : "", dialogHasDesc: !!(dlg && dlg.desc), dialogWidth: dlg ? dlg.width : "448px",
      dialogHasAction: !!(dlg && dlg.action), dialogActionLabel: dlg ? dlg.action || "" : "", dialogActionBg: dlg && dlg.destructive ? "#DC2626" : "#5A5FF2", dialogAction: () => dlg && dlg.run && dlg.run(), dialogCancelLabel: dlg && !dlg.action ? "Close" : "Cancel",
      dlgAward: d === "award", dlgCredit: d === "credit", dlgAddAgent: d === "addAgent", dlgSend: d === "send", dlgReject: d === "reject", dlgPostCap: d === "postcap", dlgPlan: d === "plan", dlgGross: d === "gross",
      awardRows: s.sides.map(side => ({ title: side.title, subline: side.subline, pct: s.awards[side.id], amt: s.awardAmounts[side.id], setPct: (e) => this.setState(x => ({ awards: { ...x.awards, [side.id]: num(e.target.value) } })), setAmt: (e) => this.setState(x => ({ awardAmounts: { ...x.awardAmounts, [side.id]: Math.round(num(e.target.value)) } })) })),
      cf: { ...s.cf, isExternal: s.cf.payableTo === "external", notExternal: s.cf.payableTo !== "external", fixedName: s.cf.payableTo === "radius" ? "Radius" : "Brokerage" },
      setCfType: (e) => this.setState(x => ({ cf: { ...x.cf, type: e.target.value } })), setCfAmount: (e) => this.setState(x => ({ cf: { ...x.cf, amount: e.target.value } })), setCfPayableTo: (e) => this.setState(x => ({ cf: { ...x.cf, payableTo: e.target.value } })), setCfPayableName: (e) => this.setState(x => ({ cf: { ...x.cf, payableName: e.target.value } })),
      agentSearch: s.agentSearch, setAgentSearch: (e) => set({ agentSearch: e.target.value }),
      agentCandidates: CONTACTS.filter(c => !s.sides.some(sd => sd.agents.some(a => a.id === c.id))).filter(c => (c.name + c.email).toLowerCase().includes(s.agentSearch.toLowerCase())).map(c => ({ ...c, initials: initials(c.name), selected: s.pendingAgent === c.id, bg: s.pendingAgent === c.id ? "rgba(90,95,242,.05)" : "transparent", pick: () => set({ pendingAgent: c.id }) })),
      addAgentRole: s.addAgentRole, setAddAgentRole: (e) => set({ addAgentRole: e.target.value }),
      sendTo: s.sendTo.map(email => ({ email, remove: () => set({ sendTo: s.sendTo.filter(x => x !== email) }) })), sendCc: s.sendCc.map(email => ({ email, remove: () => set({ sendCc: s.sendCc.filter(x => x !== email) }) })),
      sendToInput: s.sendToInput, setSendToInput: (e) => set({ sendToInput: e.target.value }), addSendTo: () => { if (s.sendToInput.trim()) set({ sendTo: [...s.sendTo, s.sendToInput.trim()], sendToInput: "" }); }, sendToKey: (e) => { if (e.key === "Enter" && s.sendToInput.trim()) { e.preventDefault(); set({ sendTo: [...s.sendTo, s.sendToInput.trim()], sendToInput: "" }); } },
      sendCcInput: s.sendCcInput, setSendCcInput: (e) => set({ sendCcInput: e.target.value }), addSendCc: () => { if (s.sendCcInput.trim()) set({ sendCc: [...s.sendCc, s.sendCcInput.trim()], sendCcInput: "" }); }, sendCcKey: (e) => { if (e.key === "Enter" && s.sendCcInput.trim()) { e.preventDefault(); set({ sendCc: [...s.sendCc, s.sendCcInput.trim()], sendCcInput: "" }); } },
      sendSubject: s.sendSubject, setSendSubject: (e) => set({ sendSubject: e.target.value }), sendBody: s.sendBody, setSendBody: (e) => set({ sendBody: e.target.value }),
      rejectInput: s.rejectInput, setRejectInput: (e) => set({ rejectInput: e.target.value }),
      pcd: { ...s.pcd, isBoth: s.pcd.feeType === "both", hasPct: s.pcd.feeType !== "fixed", amountLabel: s.pcd.feeType === "fixed" ? "Amount ($)" : "Percentage (%)" },
      setPcdType: (e) => this.setState(x => ({ pcd: { ...x.pcd, feeType: e.target.value } })), setPcdAmount: (e) => this.setState(x => ({ pcd: { ...x.pcd, feeAmount: e.target.value } })), setPcdFixed: (e) => this.setState(x => ({ pcd: { ...x.pcd, fixedAmount: e.target.value } })), setPcdBasis: (e) => this.setState(x => ({ pcd: { ...x.pcd, basis: e.target.value } })), setPcdBehavior: (e) => this.setState(x => ({ pcd: { ...x.pcd, behavior: e.target.value } })),
      pf: { ...s.pf, total: num(s.pf.agentSplit) + num(s.pf.teamSplit) },
      setPfName: (e) => this.setState(x => ({ pf: { ...x.pf, planName: e.target.value } })), setPfFee: (e) => this.setState(x => ({ pf: { ...x.pf, feeAmount: e.target.value } })),
      setPfAgent: (e) => { const v = e.target.value.replace(/[^0-9]/g, ""); this.setState(x => ({ pf: { ...x.pf, agentSplit: v, teamSplit: String(Math.max(0, 100 - num(v))) } })); },
      setPfTeam: (e) => { const v = e.target.value.replace(/[^0-9]/g, ""); this.setState(x => ({ pf: { ...x.pf, teamSplit: v, agentSplit: String(Math.max(0, 100 - num(v))) } })); },
    };
  }
}
