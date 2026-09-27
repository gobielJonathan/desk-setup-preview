"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "../components/Icon";
import { WorkspaceScene } from "../components/scene/WorkspaceScene";
import {
  accessories,
  accessoryGroups,
  accessoryById,
  chairById,
  chairs,
  deskById,
  desks,
  type Accessory,
  type Vibe,
} from "../lib/catalog";
import { computeQuote } from "../lib/pricing";
import { useWorkspace, type WorkspaceState } from "../lib/workspace-store";

type BuilderTab = "desk" | "chair" | "extras" | "vibe";

type BuilderStep = {
  id: BuilderTab;
  label: string;
  step: string;
  title: string;
  description: string;
  nextLabel: string;
};

const vibeOptions: {
  id: Vibe;
  label: string;
  note: string;
}[] = [
  { id: "morning", label: "Slow morning", note: "Soft light, fresh start" },
  { id: "sunset", label: "Golden hour", note: "Warm light, big ideas" },
  { id: "night", label: "Night owl", note: "Quiet focus after dark" },
];

const steps: BuilderStep[] = [
  {
    id: "desk",
    label: "Desk",
    step: "01",
    title: "Start with a surface",
    description: "Where the good work happens.",
    nextLabel: "Choose a chair",
  },
  {
    id: "chair",
    label: "Chair",
    step: "02",
    title: "Find your comfort zone",
    description: "The seat makes the session.",
    nextLabel: "Add some extras",
  },
  {
    id: "extras",
    label: "Extras",
    step: "03",
    title: "Add the little things",
    description: "The details make the room.",
    nextLabel: "Set the atmosphere",
  },
  {
    id: "vibe",
    label: "Vibe",
    step: "04",
    title: "Set the atmosphere",
    description: "A mood for the moodboard.",
    nextLabel: "Review setup",
  },
];

export default function Home() {
  const {
    state,
    selectDesk,
    selectChair,
    addAccessory,
    removeAccessory,
    setVibe,
    randomize,
    reset,
    selectedAccessoryCount,
  } = useWorkspace();
  const [activeTab, setActiveTab] = useState<BuilderTab>("desk");
  const monthlyQuote = computeQuote(state, "month");
  const totalItems = 2 + selectedAccessoryCount;
  const activeIndex = steps.findIndex((step) => step.id === activeTab);
  const activeStep = steps[activeIndex];
  const completedSteps = steps.filter((step) => isStepComplete(step.id, state, selectedAccessoryCount)).length;
  const selectionFeedback = getSelectionFeedback(activeTab, state, selectedAccessoryCount);

  function advanceStep() {
    if (activeIndex === steps.length - 1) {
      document.getElementById("build-summary")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    setActiveTab(steps[activeIndex + 1].id);
  }

  return (
    <main className="builder-page">
      <section className="builder-workbench">
        <div className="preview-column">
          <div className="preview-heading">
            <span className="preview-status"><span />Updating live</span>
          </div>
          <div className="scene-frame">
            <WorkspaceScene />
            <div className="scene-caption">
              <span>{totalItems} pieces selected</span>
              <span>Your table is taking shape</span>
            </div>
          </div>
          <div className="preview-note">
            <span className="note-mark"><Icon name="sparkle" size={15} /></span>
            <p><strong>Make it yours.</strong> Everything here is flexible — swap, add, remove. The best workspace is the one that fits your rituals.</p>
          </div>
        </div>

        <div className="picker-column">
          <div className="picker-heading">
            <div>
              <p className="eyebrow">The fun part</p>
              <h2>Design your setup</h2>
            </div>
            <button className="text-button" onClick={randomize} type="button">
              <Icon name="sparkle" size={15} /> Surprise me
            </button>
          </div>
          <BuildSummary
            state={state}
            monthlyPrice={monthlyQuote.monthlySubtotal}
            accessoryCount={selectedAccessoryCount}
            onRemoveAccessory={removeAccessory}
          />
          <BuildProgress
            steps={steps}
            activeTab={activeTab}
            completedSteps={completedSteps}
            onSelect={setActiveTab}
          />
          <nav className="builder-tabs" aria-label="Workspace setup steps">
            {steps.map((tab) => (
              <button
                key={tab.id}
                className={`builder-tab ${activeTab === tab.id ? "is-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                aria-pressed={activeTab === tab.id}
              >
                <span>{tab.step}</span>{tab.label}
                {tab.id === "extras" && selectedAccessoryCount > 0 && (
                  <b>{selectedAccessoryCount}</b>
                )}
              </button>
            ))}
          </nav>

          <div className="picker-content">
            {activeTab === "desk" && (
              <SelectionStep
                title={steps[0].title}
                description={steps[0].description}
                count="Choose one desk"
                selectionNote={selectionFeedback}
              >
                <div className="option-grid">
                  {desks.map((desk) => (
                    <button
                      key={desk.id}
                      className={`product-card ${state.deskId === desk.id ? "is-selected" : ""}`}
                      onClick={() => selectDesk(desk.id)}
                      type="button"
                    >
                      <ProductThumbnail type="desk" item={desk} />
                      <div className="product-card-copy">
                        <span className="product-card-name">{desk.name}</span>
                        <span className="product-card-tagline">{desk.tagline}</span>
                        <span className="product-card-price">${desk.monthlyPrice}<small>/mo</small></span>
                      </div>
                      <span className="selection-indicator">
                        {state.deskId === desk.id && <Icon name="check" size={13} />}
                      </span>
                    </button>
                  ))}
                </div>
                <StepHint icon="box">Free delivery, setup &amp; returns included.</StepHint>
              </SelectionStep>
            )}

            {activeTab === "chair" && (
              <SelectionStep
                title={steps[1].title}
                description={steps[1].description}
                count="Choose one chair"
                selectionNote={selectionFeedback}
              >
                <div className="option-grid">
                  {chairs.map((chair) => (
                    <button
                      key={chair.id}
                      className={`product-card ${state.chairId === chair.id ? "is-selected" : ""}`}
                      onClick={() => selectChair(chair.id)}
                      type="button"
                    >
                      <ProductThumbnail type="chair" item={chair} />
                      <div className="product-card-copy">
                        <span className="product-card-name">{chair.name}</span>
                        <span className="product-card-tagline">{chair.tagline}</span>
                        <span className="product-card-price">${chair.monthlyPrice}<small>/mo</small></span>
                      </div>
                      <span className="selection-indicator">
                        {state.chairId === chair.id && <Icon name="check" size={13} />}
                      </span>
                    </button>
                  ))}
                </div>
                <StepHint icon="clock">Designed for long days and short breaks.</StepHint>
              </SelectionStep>
            )}

            {activeTab === "extras" && (
              <SelectionStep
                title={steps[2].title}
                description={steps[2].description}
                count={`${selectedAccessoryCount} added`}
                selectionNote={selectionFeedback}
              >
                <div className="accessory-groups">
                  {accessoryGroups.map((group) => (
                    <div className="accessory-group" key={group.zone}>
                      <div className="accessory-group-heading">
                        <div><h3>{group.label}</h3><span>{group.note}</span></div>
                        <span>{accessories.filter((item) => item.zone === group.zone).length} options</span>
                      </div>
                      <div className="accessory-list">
                        {accessories.filter((item) => item.zone === group.zone).map((accessory) => (
                          <AccessoryRow
                            key={accessory.id}
                            accessory={accessory}
                            quantity={state.accessories[accessory.id] ?? 0}
                            onAdd={() => addAccessory(accessory.id)}
                            onRemove={() => removeAccessory(accessory.id)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </SelectionStep>
            )}

            {activeTab === "vibe" && (
              <SelectionStep
                title={steps[3].title}
                description={steps[3].description}
                count="Choose a light"
                selectionNote={selectionFeedback}
              >
                <div className="vibe-grid">
                  {vibeOptions.map((vibe) => (
                    <button
                      key={vibe.id}
                      className={`vibe-card ${state.vibe === vibe.id ? "is-selected" : ""}`}
                      onClick={() => setVibe(vibe.id)}
                      type="button"
                    >
                      <span className={`vibe-art vibe-art--${vibe.id}`}>
                        <span className="vibe-sun" />
                        <span className="vibe-horizon" />
                      </span>
                      <span className="vibe-copy"><strong>{vibe.label}</strong><small>{vibe.note}</small></span>
                      <span className="selection-indicator">{state.vibe === vibe.id && <Icon name="check" size={13} />}</span>
                    </button>
                  ))}
                </div>
                <StepHint icon="sparkle">Your vibe changes the light, not the price.</StepHint>
              </SelectionStep>
            )}
          </div>

          <div className="picker-footer">
            <button className="reset-button" onClick={reset} type="button"><Icon name="reset" size={15} /> Start over</button>
            <div className="step-controls">
              {activeIndex > 0 && (
                <button className="round-control" onClick={() => setActiveTab(steps[activeIndex - 1].id)} type="button" aria-label="Previous step"><Icon name="arrow-left" size={16} /></button>
              )}
              <button className="next-button" onClick={advanceStep} type="button">
                {activeStep.nextLabel} <Icon name="arrow-right" size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="builder-bottom shell">
        <div className="bottom-summary">
          <span className="bottom-count">{totalItems}</span>
          <div><strong>Your setup</strong><span>Ready when you are</span></div>
        </div>
        <div className="bottom-price"><span>from</span><strong>${monthlyQuote.monthlySubtotal}<small>/ month</small></strong></div>
        <Link className="rent-button" href="/checkout">Rent this setup <Icon name="arrow-right" size={18} /></Link>
      </section>
    </main>
  );
}

function isStepComplete(
  step: BuilderTab,
  state: WorkspaceState,
  accessoryCount: number,
) {
  if (step === "desk") return Boolean(state.deskId);
  if (step === "chair") return Boolean(state.chairId);
  if (step === "extras") return accessoryCount > 0;
  return Boolean(state.vibe);
}

function getSelectionFeedback(
  step: BuilderTab,
  state: WorkspaceState,
  accessoryCount: number,
) {
  if (step === "desk") return `You picked ${deskById(state.deskId).name}.`;
  if (step === "chair") return `${chairById(state.chairId).name} is in the seat.`;
  if (step === "extras") {
    return accessoryCount > 0
      ? `${accessoryCount} detail${accessoryCount === 1 ? "" : "s"} added to the table.`
      : "Add something that makes the space yours.";
  }
  return `${state.vibe === "morning" ? "Slow morning" : state.vibe === "sunset" ? "Golden hour" : "Night owl"} is on.`;
}

function BuildProgress({
  steps,
  activeTab,
  completedSteps,
  onSelect,
}: {
  steps: BuilderStep[];
  activeTab: BuilderTab;
  completedSteps: number;
  onSelect: (step: BuilderTab) => void;
}) {
  const activeIndex = steps.findIndex((step) => step.id === activeTab);

  return (
    <div className="build-progress" aria-label="Workspace build progress">
      <div className="build-progress-topline">
        <span>Build your table</span>
        <strong>Step {activeIndex + 1} of {steps.length}</strong>
      </div>
      <div className="build-progress-track" aria-hidden="true">
        <span style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }} />
      </div>
      <div className="build-progress-steps">
        {steps.map((step, index) => {
          const complete = index < activeIndex || (index === activeIndex && completedSteps >= index + 1);
          return (
            <button
              className={`build-progress-step ${activeTab === step.id ? "is-active" : ""} ${complete ? "is-complete" : ""}`}
              key={step.id}
              type="button"
              onClick={() => onSelect(step.id)}
            >
              <span>{complete ? <Icon name="check" size={11} /> : step.step}</span>
              {step.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BuildSummary({
  state,
  monthlyPrice,
  accessoryCount,
  onRemoveAccessory,
}: {
  state: WorkspaceState;
  monthlyPrice: number;
  accessoryCount: number;
  onRemoveAccessory: (id: string) => void;
}) {
  const selectedAccessories = Object.entries(state.accessories)
    .map(([id, quantity]) => ({ accessory: accessoryById(id), quantity }))
    .filter((item): item is { accessory: Accessory; quantity: number } => Boolean(item.accessory));

  return (
    <section className="build-summary" id="build-summary" tabIndex={-1} aria-label="Your workspace build">
      <div className="build-summary-heading">
        <div>
          <p className="eyebrow">Your build so far</p>
          <h3>Made for your table</h3>
        </div>
        <strong>${monthlyPrice}<small>/ month</small></strong>
      </div>
      <div className="summary-chips">
        <span className="summary-chip summary-chip--anchor"><span className="chip-dot chip-dot--desk" />{deskById(state.deskId).name}</span>
        <span className="summary-chip summary-chip--anchor"><span className="chip-dot chip-dot--chair" />{chairById(state.chairId).name}</span>
        {selectedAccessories.map(({ accessory, quantity }) => (
          <button
            className="summary-chip"
            key={accessory.id}
            type="button"
            onClick={() => onRemoveAccessory(accessory.id)}
            aria-label={`Remove ${accessory.name}`}
          >
            <span className="chip-dot chip-dot--extra" />{accessory.name}{quantity > 1 ? ` ×${quantity}` : ""}<Icon name="close" size={11} />
          </button>
        ))}
        {accessoryCount === 0 && <span className="summary-empty">Add a lamp, plant, or screen to make it yours.</span>}
      </div>
    </section>
  );
}

function SelectionStep({
  title,
  description,
  count,
  selectionNote,
  children,
}: {
  title: string;
  description: string;
  count: string;
  selectionNote: string;
  children: ReactNode;
}) {
  return (
    <div className="selection-step">
      <div className="step-heading">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
          <span className="selection-note"><Icon name="check" size={11} />{selectionNote}</span>
        </div>
        <span>{count}</span>
      </div>
      {children}
    </div>
  );
}

function StepHint({ icon, children }: { icon: "box" | "clock" | "sparkle"; children: ReactNode }) {
  return <div className="step-hint"><Icon name={icon} size={15} /><span>{children}</span></div>;
}

function ProductThumbnail({
  type,
  item,
}: {
  type: "desk" | "chair";
  item: (typeof desks)[number] | (typeof chairs)[number];
}) {
  return (
    <span className={`product-thumbnail product-thumbnail--${type}`}>
      <svg viewBox="0 0 800 520" aria-hidden="true">
        {type === "desk" ? <DeskMini item={item as (typeof desks)[number]} /> : <ChairMini item={item as (typeof chairs)[number]} />}
      </svg>
    </span>
  );
}

function DeskMini({ item }: { item: (typeof desks)[number] }) {
  return <g transform="translate(0 -168)"><rect width="800" height="520" fill="#F3EBDD" /><path d="M0 385h800v135H0z" fill="#E7D1AE" /><ellipse cx="400" cy="425" rx="290" ry="24" fill="#A88469" opacity=".2" /><rect x="130" y="270" width="540" height="23" rx="8" fill={item.colors.edge} /><rect x="137" y="262" width="526" height="20" rx="7" fill={item.colors.top} /><path d="M163 283h16l-20 121h-14zM621 283h16l20 121h-14z" fill={item.colors.leg} /><path d="M264 295h272v9H264z" fill={item.colors.edge} opacity=".24" /></g>;
}

function ChairMini({ item }: { item: (typeof chairs)[number] }) {
  return <g transform="translate(0 -155)"><rect width="800" height="520" fill="#EDF0E7" /><path d="M0 385h800v135H0z" fill="#D4DCCC" /><ellipse cx="400" cy="442" rx="120" ry="15" fill="#566767" opacity=".15" /><path d="M330 255c0-30 21-51 50-51h41c29 0 50 21 50 51v110H330z" fill={item.colors.back} /><path d="M327 342h146c28 0 47 19 48 44l-2 14H321l-2-14c1-25 20-44 48-44z" fill={item.colors.seat} /><path d="M378 399h44v26h-44zM400 421v22M400 436l-64 15M400 436l64 15" stroke={item.colors.leg} strokeWidth="8" strokeLinecap="round" /></g>;
}

function AccessoryRow({
  accessory,
  quantity,
  onAdd,
  onRemove,
}: {
  accessory: Accessory;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <div className={`accessory-row ${quantity > 0 ? "is-added" : ""}`}>
      <span className="accessory-thumbnail">
        <svg viewBox="0 0 100 80" aria-hidden="true"><AccessoryMini accessory={accessory} /></svg>
      </span>
      <div className="accessory-copy"><strong>{accessory.name}</strong><span>{accessory.tagline}</span></div>
      <span className="accessory-price">${accessory.monthlyPrice}<small>/mo</small></span>
      <div className="quantity-control">
        <button type="button" onClick={onRemove} disabled={quantity === 0} aria-label={`Remove ${accessory.name}`}><Icon name="minus" size={14} /></button>
        <span>{quantity}</span>
        <button type="button" onClick={onAdd} disabled={quantity >= accessory.maxQty} aria-label={`Add ${accessory.name}`}><Icon name="plus" size={14} /></button>
      </div>
    </div>
  );
}

function AccessoryMini({ accessory }: { accessory: Accessory }) {
  const colors = accessory.colors;
  return (
    <g transform="translate(50 66) scale(.33)">
      {accessory.icon.includes("monitor") && <><rect x="-68" y="-61" width="136" height="84" rx="8" fill="#26373D" /><rect x="-59" y="-52" width="118" height="66" rx="4" fill={colors.secondary} /><path d="M-7 23h14v21H-7zM-30 45h60v7h-60z" fill={colors.primary} /></>}
      {accessory.icon === "lamp" && <><path d="M-2 0l24-76" stroke={colors.primary} strokeWidth="8" strokeLinecap="round" /><path d="M22-75h38l-8 17H15z" fill={colors.primary} /><path d="M-22 0h42" stroke={colors.primary} strokeWidth="6" strokeLinecap="round" /></>}
      {accessory.icon === "sprout" && <><path d="M-18 0h36l-5-27h-26z" fill={colors.primary} /><path d="M-4-27c-1-17-13-27-28-27 1 17 11 27 28 27zM4-27c1-21 14-32 31-32-1 20-13 31-31 32z" fill={colors.secondary} /></>}
      {accessory.icon === "keyboard" && <><path d="M-62-16h124l-8 30H-54z" fill={colors.primary} /><path d="M-51-9h102v12H-51z" fill={colors.secondary} /><circle cx="82" cy="0" r="15" fill={colors.primary} /></>}
      {accessory.icon === "stand" && <><path d="M-44-7h88l-12 11h-64zM-27 4h54L16 32H-16z" fill={colors.primary} /><path d="M-33 32h66" stroke={colors.secondary} strokeWidth="6" /></>}
      {accessory.icon === "headphones" && <><path d="M-42 10V-9c0-39 84-39 84 0v19" fill="none" stroke={colors.primary} strokeWidth="10" /><rect x="-54" y="2" width="20" height="35" rx="8" fill={colors.secondary} /><rect x="34" y="2" width="20" height="35" rx="8" fill={colors.secondary} /></>}
      {accessory.icon === "monstera" && <><path d="M-19-24c-9-61 22-110 82-133-2 63-29 110-82 133z" fill={colors.primary} /><path d="M-13-28c-53-29-72-75-62-129 55 17 78 60 62 129z" fill={colors.secondary} /><path d="M-26-1h68l-8 36H-18z" fill={colors.primary} /></>}
      {accessory.icon === "rug" && <><ellipse cx="0" cy="2" rx="142" ry="34" fill={colors.primary} opacity=".4" /><ellipse cx="0" cy="0" rx="136" ry="29" fill={colors.secondary} /></>}
      {accessory.icon === "shelf" && <><path d="M-100 0h200v12H-100z" fill={colors.primary} /><rect x="-69" y="-37" width="27" height="37" rx="2" fill={colors.secondary} /><circle cx="46" cy="-15" r="18" fill="#C5A05C" /></>}
    </g>
  );
}
