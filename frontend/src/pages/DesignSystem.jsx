import { useState } from 'react';
import { FiPlus, FiGrid, FiList } from 'react-icons/fi';
import PageHeader from '../components/PageHeader';
import PageMain from '../components/PageMain';
import SectionCard from '../components/SectionCard';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import Tabs from '../components/Tabs';
import Select from '../components/Select';
import Modal from '../components/Modal';
import SidePanel from '../components/SidePanel';
import StatCard from '../components/StatCard';
import MiniKpiCard from '../components/MiniKpiCard';
import SummaryStat from '../components/SummaryStat';
import BudgetProgressBar from '../components/BudgetProgressBar';
import TypeBadge from '../components/TypeBadge';
import MemberBadge from '../components/MemberBadge';
import EmptyState from '../components/EmptyState';
import SubHeader from '../components/SubHeader';
import SectionHeader from '../components/SectionHeader';
import FormField from '../components/FormField';
import PanelSectionTitle from '../components/PanelSectionTitle';
import FormRow from '../components/FormRow';
import Toggle from '../components/Toggle';
import ButtonGroup from '../components/ButtonGroup';
import { IconButtonGroup, IconButtonGroupItem } from '../components/IconButtonGroup';
import SortableTh from '../components/SortableTh';
import AsyncContent from '../components/AsyncContent';
import SidebarNavItem from '../components/SidebarNavItem';
import {
  APP_NAV_ITEMS,
  APP_SIDEBAR_DESIGN_SYSTEM_ITEM,
  APP_SIDEBAR_SETTINGS_ITEM,
} from '../components/AppSidebar';
import EmojiPixel, {
  EMOJI_PIXEL_SIZES,
  EMOJI_PIXEL_ACROSS_OPTIONS,
  getEmojiPixelDefaultPixelsAcross,
} from '../components/EmojiPixel';
import {
  DesignSystemRoot,
  DsPage,
  DsLayerIntro,
  DsLayerTabsWrap,
  DsSidebarPreview,
  DsSidebarPreviewAside,
  DsRow,
  DsButtonMatrixWrap,
  DsButtonMatrixTable,
  DsButtonMatrixCornerTh,
  DsTypeScale,
  DsTypeRow,
  DsToken,
  DsTypeWeights,
  DsSwatches,
  DsSwatch,
  DsSwatchColor,
  DsSwatchLabel,
  DsRadiusGrid,
  DsRadiusItem,
  DsRadiusSample,
  DsRadiusToken,
  DsRadiusHint,
  DsEmojiPixelMatrixWrap,
  DsEmojiPixelMatrixTable,
  DsEmojiPixelMatrixCornerTh,
  DsEmojiPixelMatrixGridN,
  DsEmojiPixelMatrixMeta,
  DsEmojiPixelMatrixCell,
  DsEmojiPixelMatrixFit,
  DsEmojiPixelMatrixFitInner,
  DsSelectGrid,
  DsTable,
  DsStatRow,
  DsProgressStack,
  DsMutedP,
  DsTypeSample,
  DsWeightSample,
  DsFormStack,
  DsTitleAddon,
  DsModalBody,
  DsModalFooter,
  DsIconSizeDemo,
  DsFormPanel,
  DsSidePanelMuted,
} from './DesignSystem.styled';
import { SidebarNav } from '../components/shell/AppShell.styled';

/** Design-system demo: display `size` × `pixelsAcross` (N×N block grid on the bitmap). */
const DS_EMOJI_DEMO = '🍕';
const DS_EMOJI_PIXEL_SIZE_KEYS = /** @type {(keyof typeof EMOJI_PIXEL_SIZES)[]} */ (
  Object.keys(EMOJI_PIXEL_SIZES)
);
/** Same as production: 8 … 40 step 4 only. */
const DS_EMOJI_PIXELS_ACROSS_COLUMNS = [...EMOJI_PIXEL_ACROSS_OPTIONS];

/** Fit large rem presets in the matrix without a huge table (visual scale only). */
const DS_EMOJI_MATRIX_BOX_REM = 4;
function dsEmojiMatrixScale(sizeKey) {
  const n = Number(sizeKey);
  if (!Number.isFinite(n) || n <= DS_EMOJI_MATRIX_BOX_REM) return 1;
  return DS_EMOJI_MATRIX_BOX_REM / n;
}

const DEMO_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details' },
  { id: 'history', label: 'History' },
];

/** Atomic design — three layers on one page (Brad Frost). */
const DS_LAYER_TABS = [
  { id: 'atoms', label: 'Atoms' },
  { id: 'molecules', label: 'Molecules' },
  { id: 'organisms', label: 'Organisms' },
];

const DEMO_SELECT_OPTIONS = [
  { value: 'groceries', label: 'Groceries' },
  { value: 'transport', label: 'Transport' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'dining', label: 'Dining out' },
  { value: 'entertainment', label: 'Entertainment' },
];

const DEMO_MEMBERS = [
  { id: 'm1', first_name: 'Alice', last_name: 'Dupont', color: '#3b82f6' },
  { id: 'm2', first_name: 'Alice', last_name: 'Martin', color: '#10b981' },
  { id: 'm3', first_name: 'John', last_name: 'Doe', color: '#f59e0b' },
];

const BUTTON_GROUP_OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

/** Sample rows for SidebarNavItem demo (same icons/routes as the app sidebar) */
const DEMO_SIDEBAR_ITEMS = [
  { ...APP_SIDEBAR_DESIGN_SYSTEM_ITEM, end: true },
  { ...APP_NAV_ITEMS[2] },
  { ...APP_SIDEBAR_SETTINGS_ITEM },
];

const DS_BUTTON_VARIANTS = ['primary', 'secondary', 'danger', 'ghost', 'text'];
const DS_BUTTON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const DS_ICON_SIZES_PX = { xs: 12, sm: 14, md: 16, lg: 18, xl: 22 };

/** Border radius tokens for the design system showcase (order = smallest → largest) */
const DS_RADIUS_TOKENS = [
  { varName: '--radius-none', hint: '0' },
  { varName: '--radius-xs', hint: '3px' },
  { varName: '--radius-sm', hint: '4px' },
  { varName: '--radius-5', hint: '5px' },
  { varName: '--radius-md', hint: '6px' },
  { varName: '--radius-lg', hint: '8px' },
  { varName: '--radius-xl', hint: '12px' },
  { varName: '--radius-2xl', hint: '16px' },
  { varName: '--radius-full', hint: 'pill / circle' },
];

function DemoPlusIcon({ sizeKey }) {
  const n = DS_ICON_SIZES_PX[sizeKey] ?? 16;
  return <FiPlus size={n} aria-hidden />;
}

function DsButtonMatrix({ caption, icon = false }) {
  return (
    <DsButtonMatrixWrap>
      <DsButtonMatrixTable>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <DsButtonMatrixCornerTh scope="col">Variant</DsButtonMatrixCornerTh>
            {DS_BUTTON_SIZES.map((s) => (
              <th key={s} scope="col">
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DS_BUTTON_VARIANTS.map((v) => (
            <tr key={v}>
              <th scope="row">{v}</th>
              {DS_BUTTON_SIZES.map((s) => (
                <td key={s}>
                  {icon ? (
                    <Button
                      variant={v}
                      size={s}
                      icon
                      aria-label={`${v} ${s} add`}
                      title={`${v} · ${s}`}
                    >
                      <DemoPlusIcon sizeKey={s} />
                    </Button>
                  ) : (
                    <Button variant={v} size={s}>
                      Button
                    </Button>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </DsButtonMatrixTable>
    </DsButtonMatrixWrap>
  );
}

export default function DesignSystem() {
  const [tabsLgFull, setTabsLgFull] = useState('overview');
  const [tabsLgShrink, setTabsLgShrink] = useState('overview');
  const [tabsSmFull, setTabsSmFull] = useState('overview');
  const [tabsSmShrink, setTabsSmShrink] = useState('overview');
  const [selectValue, setSelectValue] = useState('');
  const [multiSelectValue, setMultiSelectValue] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [btnGroupValue, setBtnGroupValue] = useState('month');
  const [iconGroupActive, setIconGroupActive] = useState('grid');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [dsBudgetMonthly, setDsBudgetMonthly] = useState(true);
  const [dsBudgetSavings, setDsBudgetSavings] = useState(true);
  const [dsBudgetNon, setDsBudgetNon] = useState(true);
  const [dsCbUnchecked, setDsCbUnchecked] = useState(false);
  const [dsCbChecked, setDsCbChecked] = useState(true);
  const [dsPeriod, setDsPeriod] = useState('monthly');
  const [dsToggleNotifications, setDsToggleNotifications] = useState(true);
  const [dsToggleMarketing, setDsToggleMarketing] = useState(false);
  const [dsLayer, setDsLayer] = useState('atoms');

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  return (
    <DesignSystemRoot className="page page--full-width">
      <PageHeader
        title="Design System"
        subtitle="Tokens, components, and patterns used across the app."
      />

      <DsLayerTabsWrap ariaLabel="Design system layers">
        <Tabs
          tabs={DS_LAYER_TABS}
          active={dsLayer}
          onChange={setDsLayer}
          variant="large-shrink"
        />
      </DsLayerTabsWrap>

      <PageMain>
      <DsPage>
        {dsLayer === 'atoms' && (
        <>
        <DsLayerIntro>
          Atoms are the smallest units: typography, color and radius tokens, buttons, badges, toggles, and primitive form controls.
        </DsLayerIntro>
        {/* ── Typography ── */}
        <SectionCard title="Typography">
          <DsTypeScale>
            <DsTypeRow>
              <DsToken>--font-size-2xs (11px)</DsToken>
              <DsTypeSample $token="--font-size-2xs">The quick brown fox jumps over the lazy dog</DsTypeSample>
            </DsTypeRow>
            <DsTypeRow>
              <DsToken>--font-size-xs (12px)</DsToken>
              <DsTypeSample $token="--font-size-xs">The quick brown fox jumps over the lazy dog</DsTypeSample>
            </DsTypeRow>
            <DsTypeRow>
              <DsToken>--font-size-sm (13px)</DsToken>
              <DsTypeSample $token="--font-size-sm">The quick brown fox jumps over the lazy dog</DsTypeSample>
            </DsTypeRow>
            <DsTypeRow>
              <DsToken>--font-size-base (14px)</DsToken>
              <DsTypeSample $token="--font-size-base">The quick brown fox jumps over the lazy dog</DsTypeSample>
            </DsTypeRow>
            <DsTypeRow>
              <DsToken>--font-size-md (16px)</DsToken>
              <DsTypeSample $token="--font-size-md">The quick brown fox jumps over the lazy dog</DsTypeSample>
            </DsTypeRow>
            <DsTypeRow>
              <DsToken>--font-size-lg (18px)</DsToken>
              <DsTypeSample $token="--font-size-lg">The quick brown fox jumps over the lazy dog</DsTypeSample>
            </DsTypeRow>
            <DsTypeRow>
              <DsToken>--font-size-xl (20px)</DsToken>
              <DsTypeSample $token="--font-size-xl">The quick brown fox jumps over the lazy dog</DsTypeSample>
            </DsTypeRow>
            <DsTypeRow>
              <DsToken>--font-size-2xl (28px)</DsToken>
              <DsTypeSample $token="--font-size-2xl">The quick brown fox</DsTypeSample>
            </DsTypeRow>
          </DsTypeScale>

          <DsTypeWeights>
            <DsWeightSample $token="--font-weight-normal">Normal (400)</DsWeightSample>
            <DsWeightSample $token="--font-weight-medium">Medium (500)</DsWeightSample>
            <DsWeightSample $token="--font-weight-semibold">Semibold (600)</DsWeightSample>
            <DsWeightSample $token="--font-weight-bold">Bold (700)</DsWeightSample>
          </DsTypeWeights>
        </SectionCard>

        {/* ── Colors ── */}
        <SectionCard title="Colors">
          <SubHeader title="Neutrals" />
          <DsSwatches>
            {[0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((n) => (
              <DsSwatch key={n}>
                <DsSwatchColor $bg={`var(--color-neutral-${n})`} />
                <DsSwatchLabel>{n}</DsSwatchLabel>
              </DsSwatch>
            ))}
          </DsSwatches>
          <SubHeader title="Brand & Semantic" />
          <DsSwatches>
            <DsSwatch>
              <DsSwatchColor $bg="var(--color-brand-500)" />
              <DsSwatchLabel>brand</DsSwatchLabel>
            </DsSwatch>
            <DsSwatch>
              <DsSwatchColor $bg="var(--color-success-500)" />
              <DsSwatchLabel>success</DsSwatchLabel>
            </DsSwatch>
            <DsSwatch>
              <DsSwatchColor $bg="var(--color-danger-500)" />
              <DsSwatchLabel>danger</DsSwatchLabel>
            </DsSwatch>
            <DsSwatch>
              <DsSwatchColor $bg="var(--color-warning-500)" />
              <DsSwatchLabel>warning</DsSwatchLabel>
            </DsSwatch>
          </DsSwatches>
        </SectionCard>

        {/* ── Border radius ── */}
        <SectionCard title="Border radius">
          <DsMutedP $mb={3}>
            Use <DsToken $inline>border-radius: var(--radius-*)</DsToken>. Legacy default:{' '}
            <DsToken $inline>--radius</DsToken> → <DsToken $inline>var(--radius-lg)</DsToken>.
          </DsMutedP>
          <DsRadiusGrid>
            {DS_RADIUS_TOKENS.map(({ varName, hint }) => (
              <DsRadiusItem key={varName}>
                <DsRadiusSample
                  $full={varName === '--radius-full'}
                  $radius={varName}
                />
                <DsRadiusToken>{varName}</DsRadiusToken>
                <DsRadiusHint>{hint}</DsRadiusHint>
              </DsRadiusItem>
            ))}
          </DsRadiusGrid>
        </SectionCard>

        {/* ── Pixelated emoji ── */}
        <SectionCard title="Pixelated emoji">
          <DsMutedP $mb={3}>
            <DsToken $inline>
              EmojiPixel
            </DsToken>{' '}
            draws the glyph on a square bitmap, then merges samples into an{' '}
            <strong>N×N</strong> block grid.{' '}
            <DsToken $inline>
              pixelsAcross={'{N}'}
            </DsToken>{' '}
            is the number of blocks per side (e.g.{' '}
            <DsToken $inline>
              8
            </DsToken>{' '}
            → ~8×8). Allowed values only:{' '}
            <DsToken $inline>
              {EMOJI_PIXEL_ACROSS_OPTIONS.join(', ')}
            </DsToken>
            — anything else is snapped to the nearest step. Also capped by bitmap width so N never exceeds device pixels
            per side. Default when omitted:{' '}
            <DsToken $inline>
              snap(round(logical / 8))
            </DsToken>{' '}
            to that set. Display{' '}
            <DsToken $inline>
              size
            </DsToken>{' '}
            presets (rem × logical px):{' '}
            <DsToken $inline>
              1
            </DsToken>
            ,{' '}
            <DsToken $inline>
              2
            </DsToken>
            ,{' '}
            <DsToken $inline>
              4
            </DsToken>
            ,{' '}
            <DsToken $inline>
              8
            </DsToken>
            ,{' '}
            <DsToken $inline>
              16
            </DsToken>
            . Shaded cells match the default <DsToken $inline>pixelsAcross</DsToken> for
            that row's <DsToken $inline>size</DsToken>. Rows{' '}
            <DsToken $inline>
              4
            </DsToken>
            /
            <DsToken $inline>
              8
            </DsToken>
            /
            <DsToken $inline>
              16
            </DsToken>{' '}
            are scaled down inside the cell to fit the table.
          </DsMutedP>
          <DsEmojiPixelMatrixWrap>
            <DsEmojiPixelMatrixTable>
              <caption>
                All <DsToken $inline>size</DsToken> ×{' '}
                <DsToken $inline>
                  pixelsAcross
                </DsToken>{' '}
                (N×N) — example emoji {DS_EMOJI_DEMO}.
              </caption>
              <thead>
                <tr>
                  <DsEmojiPixelMatrixCornerTh scope="col">size \ N</DsEmojiPixelMatrixCornerTh>
                  {DS_EMOJI_PIXELS_ACROSS_COLUMNS.map((n) => (
                    <th key={n} scope="col">
                      <DsEmojiPixelMatrixGridN>{n}</DsEmojiPixelMatrixGridN>
                      <DsEmojiPixelMatrixMeta>
                        {n}×{n}
                      </DsEmojiPixelMatrixMeta>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DS_EMOJI_PIXEL_SIZE_KEYS.map((sz) => {
                  const def = getEmojiPixelDefaultPixelsAcross(sz);
                  const preset = EMOJI_PIXEL_SIZES[sz];
                  const s = dsEmojiMatrixScale(sz);
                  return (
                    <tr key={sz}>
                      <th scope="row">
                        <DsToken $inline>
                          {sz}
                        </DsToken>
                        <DsEmojiPixelMatrixMeta>
                          {preset.style.width} · logical {preset.logical}px
                        </DsEmojiPixelMatrixMeta>
                      </th>
                      {DS_EMOJI_PIXELS_ACROSS_COLUMNS.map((n) => (
                        <DsEmojiPixelMatrixCell key={n} $isDefault={n === def}>
                          {s < 1 ? (
                            <DsEmojiPixelMatrixFit $boxRem={DS_EMOJI_MATRIX_BOX_REM}>
                              <DsEmojiPixelMatrixFitInner $scale={s}>
                                <EmojiPixel size={sz} pixelsAcross={n} aria-hidden title={`${sz} · ${n}×${n}`}>
                                  {DS_EMOJI_DEMO}
                                </EmojiPixel>
                              </DsEmojiPixelMatrixFitInner>
                            </DsEmojiPixelMatrixFit>
                          ) : (
                            <EmojiPixel size={sz} pixelsAcross={n} aria-hidden title={`${sz} · ${n}×${n}`}>
                              {DS_EMOJI_DEMO}
                            </EmojiPixel>
                          )}
                        </DsEmojiPixelMatrixCell>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </DsEmojiPixelMatrixTable>
          </DsEmojiPixelMatrixWrap>
        </SectionCard>

        {/* ── Buttons ── */}
        <SectionCard title="Button">
          <DsMutedP $mb={2}>
            Full matrix: <DsToken>variant</DsToken> (rows) × <DsToken>size</DsToken> (columns).
            Sizes: <DsToken>xs</DsToken>, <DsToken>sm</DsToken>, <DsToken>md</DsToken>,{' '}
            <DsToken>lg</DsToken>, <DsToken>xl</DsToken>. Icon cells use <DsToken>icon</DsToken> with a plus glyph.
          </DsMutedP>
          <SubHeader title="Default — text label" />
          <DsButtonMatrix caption="All button variants and sizes — default, text label" />
          <SubHeader title="Default — icon (icon prop)" />
          <DsButtonMatrix caption="All button variants and sizes — default, icon" icon />
          <SubHeader title="IconButton (ghost · icon-only)" />
          <DsMutedP $mb={3}>
            <DsToken>IconButton</DsToken> is <DsToken>Button</DsToken> with <DsToken>variant=&quot;ghost&quot;</DsToken> and{' '}
            <DsToken>icon</DsToken> — all sizes below.
          </DsMutedP>
          <DsRow $alignCenter $gap={5}>
            {DS_BUTTON_SIZES.map((s) => (
              <DsIconSizeDemo key={s}>
                <IconButton size={s} aria-label={`Ghost icon ${s}`} title={`Ghost · ${s}`}>
                  <DemoPlusIcon sizeKey={s} />
                </IconButton>
                <DsToken $inline $center>
                  {s}
                </DsToken>
              </DsIconSizeDemo>
            ))}
          </DsRow>
        </SectionCard>

        {/* ── Badges ── */}
        <SectionCard title="Badges">
          <SubHeader title="TypeBadge" />
          <DsRow>
            <TypeBadge type="expense" />
            <TypeBadge type="income" />
            <TypeBadge type="money_movement" />
          </DsRow>
          <SubHeader title="MemberBadge" />
          <DsRow>
            {DEMO_MEMBERS.map((m) => (
              <MemberBadge key={m.id} member={m} />
            ))}
          </DsRow>
        </SectionCard>

        {/* ── Checkbox & Radio ── */}
        <SectionCard title="Checkbox & Radio">
          <DsMutedP>
            Use <DsToken>form-checkbox-label</DsToken> + <DsToken>type=&quot;checkbox&quot;</DsToken> and{' '}
            <DsToken>form-radio-label</DsToken> + <DsToken>type=&quot;radio&quot;</DsToken> (same <DsToken>name</DsToken> per group).
            Group headings: <DsToken>PanelSectionTitle</DsToken> (class <DsToken>form-control-group-title</DsToken>). Vertical lists: <DsToken>form-control-stack</DsToken>.
          </DsMutedP>
          <SubHeader title="Checkbox — group" />
          <DsFormPanel>
            <PanelSectionTitle as="p" id="ds-budgets-label">
              Budgets
            </PanelSectionTitle>
            <div className="form-control-stack" role="group" aria-labelledby="ds-budgets-label">
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  checked={dsBudgetMonthly}
                  onChange={(e) => setDsBudgetMonthly(e.target.checked)}
                />
                <span>Monthly budget</span>
              </label>
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  checked={dsBudgetSavings}
                  onChange={(e) => setDsBudgetSavings(e.target.checked)}
                />
                <span>Savings plan</span>
              </label>
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  checked={dsBudgetNon}
                  onChange={(e) => setDsBudgetNon(e.target.checked)}
                />
                <span>Non budgeted</span>
              </label>
            </div>
          </DsFormPanel>
          <SubHeader title="Checkbox — states" />
          <DsFormStack>
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                checked={dsCbUnchecked}
                onChange={(e) => setDsCbUnchecked(e.target.checked)}
              />
              <span>Unchecked</span>
            </label>
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                checked={dsCbChecked}
                onChange={(e) => setDsCbChecked(e.target.checked)}
              />
              <span>Checked</span>
            </label>
            <label className="form-checkbox-label">
              <input type="checkbox" defaultChecked disabled />
              <span>Disabled checked</span>
            </label>
            <label className="form-checkbox-label">
              <input type="checkbox" disabled />
              <span>Disabled unchecked</span>
            </label>
          </DsFormStack>
          <SubHeader title="Radio — group" />
          <DsFormPanel>
            <PanelSectionTitle as="p" id="ds-period-label">
              Period
            </PanelSectionTitle>
            <div className="form-control-stack" role="radiogroup" aria-labelledby="ds-period-label">
              <label className="form-radio-label">
                <input
                  type="radio"
                  name="ds-period"
                  value="monthly"
                  checked={dsPeriod === 'monthly'}
                  onChange={() => setDsPeriod('monthly')}
                />
                <span>Monthly</span>
              </label>
              <label className="form-radio-label">
                <input
                  type="radio"
                  name="ds-period"
                  value="quarterly"
                  checked={dsPeriod === 'quarterly'}
                  onChange={() => setDsPeriod('quarterly')}
                />
                <span>Quarterly</span>
              </label>
              <label className="form-radio-label">
                <input
                  type="radio"
                  name="ds-period"
                  value="yearly"
                  checked={dsPeriod === 'yearly'}
                  onChange={() => setDsPeriod('yearly')}
                />
                <span>Yearly</span>
              </label>
            </div>
          </DsFormPanel>
          <SubHeader title="Radio — states" />
          <DsFormStack>
            <label className="form-radio-label">
              <input type="radio" name="ds-radio-states-a" defaultChecked />
              <span>Selected</span>
            </label>
            <label className="form-radio-label">
              <input type="radio" name="ds-radio-states-a" />
              <span>Unselected</span>
            </label>
            <label className="form-radio-label">
              <input type="radio" name="ds-radio-states-b" defaultChecked disabled />
              <span>Disabled selected</span>
            </label>
            <label className="form-radio-label">
              <input type="radio" name="ds-radio-states-b" disabled />
              <span>Disabled unselected</span>
            </label>
          </DsFormStack>
        </SectionCard>

        {/* ── Toggle (switch) ── */}
        <SectionCard title="Toggle">
          <DsMutedP>
            Binary on/off control for settings. Use the <DsToken>Toggle</DsToken> component or the same markup:{' '}
            <DsToken>form-toggle-label</DsToken>, visually hidden <DsToken>form-toggle-input</DsToken>{' '}
            (<DsToken>type=&quot;checkbox&quot;</DsToken>), <DsToken>form-toggle-track</DsToken> +{' '}
            <DsToken>form-toggle-thumb</DsToken>, optional <DsToken>form-toggle-text</DsToken>.
          </DsMutedP>
          <SubHeader title="Interactive" />
          <DsFormStack>
            <Toggle
              id="ds-toggle-notifications"
              checked={dsToggleNotifications}
              onChange={(e) => setDsToggleNotifications(e.target.checked)}
            >
              Email notifications
            </Toggle>
            <Toggle
              id="ds-toggle-marketing"
              checked={dsToggleMarketing}
              onChange={(e) => setDsToggleMarketing(e.target.checked)}
            >
              Product updates
            </Toggle>
          </DsFormStack>
          <SubHeader title="States" />
          <DsFormStack>
            <Toggle id="ds-toggle-static-on" defaultChecked>
              On
            </Toggle>
            <Toggle id="ds-toggle-static-off">Off</Toggle>
            <Toggle id="ds-toggle-disabled-on" defaultChecked disabled>
              Disabled on
            </Toggle>
            <Toggle id="ds-toggle-disabled-off" disabled>
              Disabled off
            </Toggle>
          </DsFormStack>
        </SectionCard>
        </>
        )}

        {dsLayer === 'molecules' && (
        <>
        <DsLayerIntro>
          Molecules combine atoms into focused controls: toggle groups, tabs, selects, labeled fields, nav rows, sortable headers, section titles, and compact KPI tiles.
        </DsLayerIntro>
        {/* ── ButtonGroup & IconButtonGroup ── */}
        <SectionCard title="ButtonGroup">
          <SubHeader title="Text toggle" />
          <DsRow>
            <ButtonGroup options={BUTTON_GROUP_OPTIONS} value={btnGroupValue} onChange={setBtnGroupValue} />
          </DsRow>
          <SubHeader title="Icon toggle" />
          <DsRow>
            <IconButtonGroup ariaLabel="View mode">
              <IconButtonGroupItem active={iconGroupActive === 'grid'} onClick={() => setIconGroupActive('grid')} ariaLabel="Grid view">
                <FiGrid size={16} />
              </IconButtonGroupItem>
              <IconButtonGroupItem active={iconGroupActive === 'list'} onClick={() => setIconGroupActive('list')} ariaLabel="List view">
                <FiList size={16} />
              </IconButtonGroupItem>
            </IconButtonGroup>
          </DsRow>
        </SectionCard>

        {/* ── SidebarNavItem (app sidebar link row) ── */}
        <SectionCard title="SidebarNavItem">
          <DsMutedP>
            Single route row for the app sidebar: <DsToken>.nav-link</DsToken>, <DsToken>.nav-icon</DsToken>, <DsToken>.nav-label</DsToken> (see <DsToken>AppSidebar.jsx</DsToken>).
          </DsMutedP>
          <SubHeader title="Expanded" />
          <DsSidebarPreview>
            <DsSidebarPreviewAside>
              <SidebarNav aria-label="Sidebar preview expanded">
                {DEMO_SIDEBAR_ITEMS.map((item) => (
                  <SidebarNavItem
                    key={item.to}
                    to={item.to}
                    label={item.label}
                    icon={item.icon}
                    collapsed={false}
                    end={item.end}
                  />
                ))}
              </SidebarNav>
            </DsSidebarPreviewAside>
          </DsSidebarPreview>
          <SubHeader title="Collapsed" />
          <DsSidebarPreview>
            <DsSidebarPreviewAside $previewCollapsed>
              <SidebarNav aria-label="Sidebar preview collapsed">
                {DEMO_SIDEBAR_ITEMS.map((item) => (
                  <SidebarNavItem
                    key={item.to}
                    to={item.to}
                    label={item.label}
                    icon={item.icon}
                    collapsed
                    end={item.end}
                  />
                ))}
              </SidebarNav>
            </DsSidebarPreviewAside>
          </DsSidebarPreview>
        </SectionCard>

        <SectionCard title="Tabs">
          <DsMutedP>
            Segmented tabs use the <DsToken>variant</DsToken> prop on{' '}
            <DsToken>Tabs.jsx</DsToken>. Defaults match app usage:{' '}
            <DsToken>large-full-width</DsToken>.
          </DsMutedP>
          <SubHeader title="Large — full width" />
          <Tabs tabs={DEMO_TABS} active={tabsLgFull} onChange={setTabsLgFull} variant="large-full-width" />
          <SubHeader title="Large — shrink" />
          <Tabs tabs={DEMO_TABS} active={tabsLgShrink} onChange={setTabsLgShrink} variant="large-shrink" />
          <SubHeader title="Small — full width" />
          <Tabs tabs={DEMO_TABS} active={tabsSmFull} onChange={setTabsSmFull} variant="small-full-width" />
          <SubHeader title="Small — shrink" />
          <Tabs tabs={DEMO_TABS} active={tabsSmShrink} onChange={setTabsSmShrink} variant="small-shrink" />
        </SectionCard>

        {/* ── Select ── */}
        <SectionCard title="Select">
          <DsSelectGrid>
            <div>
              <SubHeader title="Single" />
              <Select
                options={DEMO_SELECT_OPTIONS}
                value={selectValue}
                onChange={setSelectValue}
                placeholder="Pick a category..."
              />
            </div>
            <div>
              <SubHeader title="Searchable multi" />
              <Select
                options={DEMO_SELECT_OPTIONS}
                value={multiSelectValue}
                onChange={setMultiSelectValue}
                placeholder="Filter categories..."
                searchable
                multi
              />
            </div>
          </DsSelectGrid>
        </SectionCard>

        {/* ── Form elements ── */}
        <SectionCard title="FormField & FormRow">
          <FormRow>
            <FormField label="First name" htmlFor="ds-fname">
              <input id="ds-fname" type="text" className="form-input" placeholder="Jane" />
            </FormField>
            <FormField label="Last name" htmlFor="ds-lname">
              <input id="ds-lname" type="text" className="form-input" placeholder="Doe" />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Email" htmlFor="ds-email">
              <input id="ds-email" type="email" className="form-input" placeholder="jane@example.com" />
            </FormField>
          </FormRow>
        </SectionCard>

        {/* ── SortableTh ── */}
        <SectionCard title="SortableTh">
          <DsTable>
            <thead>
              <tr>
                <SortableTh field="date" sortField={sortField} sortDir={sortDir} onSort={handleSort}>Date</SortableTh>
                <SortableTh field="description" sortField={sortField} sortDir={sortDir} onSort={handleSort}>Description</SortableTh>
                <SortableTh field="amount" sortField={sortField} sortDir={sortDir} onSort={handleSort} align="right">Amount</SortableTh>
              </tr>
            </thead>
            <tbody>
              <tr><td>2026-04-01</td><td>Groceries</td><td className="u-text-right">-45.00</td></tr>
              <tr><td>2026-04-02</td><td>Salary</td><td className="u-text-right">+3,200.00</td></tr>
            </tbody>
          </DsTable>
        </SectionCard>

        {/* ── SectionHeader ── */}
        <SectionCard title="SectionHeader">
          <DsMutedP>
            Page-level <DsToken>h2</DsToken> inside <DsToken>PageMain</DsToken>. For card toolbars and dense rows, use <DsToken>SubHeader</DsToken>.
          </DsMutedP>
          <SectionHeader>Plain section title</SectionHeader>
          <DsMutedP $mb={5}>
            Body copy or components follow the heading spacing from <DsToken>.page-section-header</DsToken>.
          </DsMutedP>
          <SectionHeader actions={<Button variant="ghost" size="sm">Action</Button>}>
            With trailing actions
          </SectionHeader>
          <DsMutedP $mb={5}>
            Use <DsToken>subtitle</DsToken> for a muted line under the title.
          </DsMutedP>
          <SectionHeader subtitle="Supporting copy appears below the heading in smaller, muted text.">
            Title with subtitle
          </SectionHeader>
          <SectionHeader
            subtitle="Actions stay on the right; the lead column stacks title and subtitle."
            actions={<Button variant="ghost" size="sm">Action</Button>}
          >
            Title, subtitle, and actions
          </SectionHeader>
        </SectionCard>

        {/* ── SubHeader ── */}
        <SectionCard title="SubHeader">
          <SubHeader title="Section title" titleAddon={<DsTitleAddon>12 items</DsTitleAddon>}>
            <Button variant="ghost" size="sm">View all</Button>
          </SubHeader>
        </SectionCard>

        {/* ── Stat cards ── */}
        <SectionCard title="StatCard & MiniKpiCard">
          <SubHeader title="StatCard" />
          <DsStatRow>
            <StatCard label="Total Expenses" amount={245000} variant="expense" />
            <StatCard label="Total Income" amount={520000} variant="income" />
            <StatCard label="Balance" amount={275000} variant="neutral" />
          </DsStatRow>
          <SubHeader title="MiniKpiCard" />
          <DsStatRow>
            <MiniKpiCard label="Transactions" count={42} />
            <MiniKpiCard label="Avg. Spend" amountCents={8500} />
            <MiniKpiCard label="Budget gap" amountCents={-12000} amountTone="bad" />
            <MiniKpiCard label="Savings" amountCents={35000} amountTone="good" />
          </DsStatRow>
          <SubHeader title="SummaryStat" />
          <DsStatRow>
            <SummaryStat label="Categories" value="12" />
            <SummaryStat label="Status" value="On track" variant="income" />
          </DsStatRow>
        </SectionCard>
        </>
        )}

        {dsLayer === 'organisms' && (
        <>
        <DsLayerIntro>
          Organisms combine molecules into distinct regions: budget progress, section shells, empty and loading states, and overlay patterns (modal / side panel).
        </DsLayerIntro>
        {/* ── BudgetProgressBar ── */}
        <SectionCard title="BudgetProgressBar">
          <DsProgressStack>
            <BudgetProgressBar label="Groceries" spent={32000} budgeted={50000} />
            <BudgetProgressBar label="Dining out" spent={28000} budgeted={25000} />
            <BudgetProgressBar label="Emergency fund" spent={180000} budgeted={200000} planKind="savings" />
            <BudgetProgressBar label="Vacation" spent={120000} budgeted={100000} planKind="savings" />
          </DsProgressStack>
        </SectionCard>

        {/* ── SectionCard (self-demo) ── */}
        <SectionCard title="SectionCard" total="$1,234" actions={<Button variant="primary" size="sm">+ Add</Button>}>
          <DsMutedP $mb={0}>
            This component is used as the wrapper for every section on this page. It supports a title, total, actions, and headerExtra.
          </DsMutedP>
        </SectionCard>

        {/* ── EmptyState ── */}
        <SectionCard title="EmptyState">
          <EmptyState message="No transactions found for this period." />
        </SectionCard>

        {/* ── AsyncContent ── */}
        <SectionCard title="AsyncContent">
          <SubHeader title="Loading state" />
          <AsyncContent loading error={null}>
            <p>Content</p>
          </AsyncContent>
          <SubHeader title="Error state" />
          <AsyncContent loading={false} error="Failed to load data">
            <p>Content</p>
          </AsyncContent>
        </SectionCard>

        {/* ── Modal & SidePanel ── */}
        <SectionCard title="Modal & SidePanel">
          <DsRow>
            <Button variant="primary" onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Button variant="secondary" onClick={() => setPanelOpen(true)}>Open SidePanel</Button>
          </DsRow>
        </SectionCard>
        </>
        )}
      </DsPage>
      </PageMain>

      <Modal title="Example Modal" open={modalOpen} onClose={() => setModalOpen(false)}>
        <DsModalBody>
          <p>This is a modal dialog. Press Escape or click outside to close.</p>
          <DsModalFooter>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>Confirm</Button>
          </DsModalFooter>
        </DsModalBody>
      </Modal>

      <SidePanel
        title="Example Panel"
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        footer={
          <div className="side-panel-footer__inner">
            <div className="side-panel-footer__actions">
              <Button variant="ghost" type="button" onClick={() => setPanelOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="button" onClick={() => setPanelOpen(false)}>
                Save
              </Button>
            </div>
          </div>
        }
      >
        <DsSidePanelMuted>Slide-in panel: <DsToken>header</DsToken> (title + close), <DsToken>content</DsToken> (scrollable <DsToken>children</DsToken>), optional <DsToken>footer</DsToken> for CTAs (stays pinned). Escape or outside click closes.</DsSidePanelMuted>
        <FormField label="Name" htmlFor="ds-panel-name">
          <input id="ds-panel-name" type="text" className="form-input" placeholder="Enter name..." />
        </FormField>
      </SidePanel>
    </DesignSystemRoot>
  );
}
