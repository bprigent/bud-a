import { useState, useEffect, useCallback } from 'react';
import {
  getMembers, createMember, updateMember, deleteMember,
  getAccounts, createAccount, updateAccount, deleteAccount,
  getCategories, createCategory, updateCategory, deleteCategory,
  getMatchingRules, createMatchingRule, updateMatchingRule, deleteMatchingRule,
  getPreferences, updateCurrency, setBackupPassword, changeBackupPassword, exportData,
} from '../api';
import { useData } from '../hooks/useData';
import Button from '../components/Button.jsx';
import Select from '../components/Select.jsx';
import { DEFAULT_CURRENCY, CURRENCIES } from '../config';
import Redacted from '../components/Redacted.jsx';
import SidePanel from '../components/SidePanel.jsx';
import Tabs from '../components/Tabs.jsx';
import SectionCard from '../components/SectionCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PageMain from '../components/PageMain.jsx';
import PageSubHeader from '../components/PageSubHeader.jsx';
import AsyncContent from '../components/AsyncContent.jsx';
import { TableBlock } from '../components/TableBlock';
import EmptyState from '../components/EmptyState.jsx';
import { centsFromDollars, dollarsFromCents } from '../utils/format.js';
import { categorySelectContent } from '../utils/categoryLabels';
import { FiCreditCard, FiTag, FiLink, FiUser } from 'react-icons/fi';
import { MdFamilyRestroom } from 'react-icons/md';
import EmojiPixel from '../components/EmojiPixel';
import { PageRoot } from './PageRoot.styled';

/** CSV stores booleans as "true" or empty. */
function accountIsSavings(a) {
  return a.is_savings === 'true' || a.is_savings === true;
}

const SETTINGS_TAB_ICONS = {
  family: <MdFamilyRestroom size={16} />,
  accounts: <FiCreditCard size={16} />,
  categories: <FiTag size={16} />,
  rules: <FiLink size={16} />,
  account: <FiUser size={16} />,
};

export default function Settings() {
  const { data: members, loading: membersLoading, error: membersError, refetch: refetchMembers } = useData(getMembers, 'members.csv');
  const { data: accounts, loading: accountsLoading, error: accountsError, refetch: refetchAccounts } = useData(getAccounts, 'accounts.csv');
  const { data: categories, loading: catsLoading, error: catsError, refetch: refetchCats } = useData(getCategories, 'categories.csv');
  const { data: matchingRules, loading: rulesLoading, error: rulesError, refetch: refetchRules } = useData(getMatchingRules, 'matching_rules.json');

  const memMap = {};
  (members || []).forEach((m) => { memMap[m.id] = `${m.first_name} ${m.last_name}`; });

  const catMap = {};
  (categories || []).forEach((c) => { catMap[c.id] = c.name; });

  // Panel state: null | 'add-member' | 'edit-member' | 'add-account' | 'edit-account' | 'add-category' | 'edit-category' | 'add-rule' | 'edit-rule'
  const [panel, setPanel] = useState(null);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const closePanel = () => { setPanel(null); setEditId(null); };

  // Member forms
  const [memberForm, setMemberForm] = useState({ first_name: '', last_name: '', color: '#3b82f6' });
  const [memberEditForm, setMemberEditForm] = useState({ first_name: '', last_name: '', color: '#3b82f6' });

  // Account forms
  const emptyAccountForm = {
    bank_name: '', nickname: '', account_number: '', member_id: '',
    currency: DEFAULT_CURRENCY, opening_balance: '', opening_balance_date: '',
    statement_balance: '', statement_date: '', image_url: '',
    is_savings: false,
  };
  const [accountForm, setAccountForm] = useState({ ...emptyAccountForm });
  const [accountEditForm, setAccountEditForm] = useState({ ...emptyAccountForm });

  // Category forms
  const [catForm, setCatForm] = useState({ name: '', emoji: '', description: '' });
  const [catEditForm, setCatEditForm] = useState({ name: '', emoji: '', description: '' });

  // Matching rule forms
  const [ruleForm, setRuleForm] = useState({ category_id: '', pattern: '' });
  const [ruleEditForm, setRuleEditForm] = useState({ category_id: '', pattern: '' });

  // Preferences state
  const [prefs, setPrefs] = useState(null);
  const [prefsLoading, setPrefsLoading] = useState(true);
  const [prefsCurrency, setPrefsCurrency] = useState('');
  const [currencySaving, setCurrencySaving] = useState(false);
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  const loadPrefs = useCallback(async () => {
    setPrefsLoading(true);
    try {
      const data = await getPreferences();
      setPrefs(data);
      setPrefsCurrency(data.default_currency || 'EUR');
    } catch {
      // preferences file may not exist yet
      setPrefs({ default_currency: 'EUR', has_backup_password: false });
      setPrefsCurrency('EUR');
    } finally {
      setPrefsLoading(false);
    }
  }, []);

  useEffect(() => { loadPrefs(); }, [loadPrefs]);

  const handleSaveCurrency = async () => {
    setCurrencySaving(true);
    try {
      await updateCurrency(prefsCurrency);
      await loadPrefs();
    } catch (err) {
      alert('Failed to save currency: ' + err.message);
    } finally {
      setCurrencySaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwError('New passwords do not match.');
      return;
    }
    if (pwForm.new_password.length < 8) {
      setPwError('Password must be at least 8 characters.');
      return;
    }

    setPwSaving(true);
    try {
      if (prefs?.has_backup_password) {
        await changeBackupPassword(pwForm.old_password, pwForm.new_password);
      } else {
        await setBackupPassword(pwForm.new_password);
      }
      setPwForm({ old_password: '', new_password: '', confirm_password: '' });
      setPwSuccess('Backup password saved.');
      await loadPrefs();
    } catch (err) {
      setPwError(err.message || 'Failed to save password.');
    } finally {
      setPwSaving(false);
    }
  };

  // Export
  const [exporting, setExporting] = useState(false);
  const [exportPassword, setExportPassword] = useState('');
  const [exportError, setExportError] = useState('');
  const handleExport = async (e) => {
    e.preventDefault();
    setExportError('');
    setExporting(true);
    try {
      const blob = await exportData(exportPassword);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bud-a-export-${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setExportPassword('');
    } catch (err) {
      setExportError(err.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  // --- Members ---
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberForm.first_name.trim()) return;
    setSubmitting(true);
    try {
      await createMember({ first_name: memberForm.first_name.trim(), last_name: memberForm.last_name.trim(), email: '', phone: '', color: memberForm.color });
      setMemberForm({ first_name: '', last_name: '', color: '#3b82f6' });
      closePanel();
      refetchMembers();
    } catch (err) {
      alert('Failed to add: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEditMember = (m) => {
    setEditId(m.id);
    setMemberEditForm({ first_name: m.first_name, last_name: m.last_name, color: m.color || '#3b82f6' });
    setPanel('edit-member');
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    if (!memberEditForm.first_name.trim()) return;
    setSubmitting(true);
    try {
      await updateMember(editId, { first_name: memberEditForm.first_name.trim(), last_name: memberEditForm.last_name.trim(), color: memberEditForm.color });
      closePanel();
      refetchMembers();
    } catch (err) {
      alert('Failed to update: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async (id) => {
    if (!confirm('Delete this member?')) return;
    try {
      await deleteMember(id);
      closePanel();
      refetchMembers();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  // --- Accounts ---
  const handleAddAccount = async (e) => {
    e.preventDefault();
    if (!accountForm.bank_name.trim() || !accountForm.nickname.trim()) return;
    setSubmitting(true);
    try {
      await createAccount({
        bank_name: accountForm.bank_name.trim(),
        nickname: accountForm.nickname.trim(),
        account_number: accountForm.account_number.trim(),
        member_id: accountForm.member_id,
        type: 'checking',
        currency: accountForm.currency || DEFAULT_CURRENCY,
        opening_balance: accountForm.opening_balance.trim() === '' ? 0 : centsFromDollars(accountForm.opening_balance),
        opening_balance_date: accountForm.opening_balance_date || '',
        statement_balance: null,
        statement_date: '',
        image_url: accountForm.image_url.trim(),
        is_savings: accountForm.is_savings,
      });
      setAccountForm({ ...emptyAccountForm });
      closePanel();
      refetchAccounts();
    } catch (err) {
      alert('Failed to add: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEditAccount = (a) => {
    setEditId(a.id);
    setAccountEditForm({
      bank_name: a.bank_name || '', nickname: a.nickname || '',
      account_number: a.account_number || '', member_id: a.member_id || '',
      currency: a.currency || DEFAULT_CURRENCY,
      opening_balance: a.opening_balance != null && String(a.opening_balance).trim() !== '' ? dollarsFromCents(a.opening_balance) : '',
      opening_balance_date: a.opening_balance_date || '',
      statement_balance: a.statement_balance != null && String(a.statement_balance).trim() !== '' ? dollarsFromCents(a.statement_balance) : '',
      statement_date: a.statement_date || '',
      image_url: a.image_url || '',
      is_savings: accountIsSavings(a),
    });
    setPanel('edit-account');
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    if (!accountEditForm.bank_name.trim() || !accountEditForm.nickname.trim()) return;
    setSubmitting(true);
    try {
      await updateAccount(editId, {
        bank_name: accountEditForm.bank_name.trim(),
        nickname: accountEditForm.nickname.trim(),
        account_number: accountEditForm.account_number.trim(),
        member_id: accountEditForm.member_id,
        currency: accountEditForm.currency || DEFAULT_CURRENCY,
        opening_balance: accountEditForm.opening_balance.trim() === '' ? 0 : centsFromDollars(accountEditForm.opening_balance),
        opening_balance_date: accountEditForm.opening_balance_date || '',
        statement_balance: accountEditForm.statement_balance.trim() === '' ? null : centsFromDollars(accountEditForm.statement_balance),
        statement_date: accountEditForm.statement_date || '',
        image_url: accountEditForm.image_url.trim(),
        is_savings: accountEditForm.is_savings,
      });
      closePanel();
      refetchAccounts();
    } catch (err) {
      alert('Failed to update: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async (id) => {
    if (!confirm('Delete this account?')) return;
    try {
      await deleteAccount(id);
      closePanel();
      refetchAccounts();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  // --- Categories ---
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;
    setSubmitting(true);
    try {
      await createCategory({ name: catForm.name.trim(), emoji: catForm.emoji, description: catForm.description });
      setCatForm({ name: '', emoji: '', description: '' });
      closePanel();
      refetchCats();
    } catch (err) {
      alert('Failed to add: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEditCategory = (c) => {
    setEditId(c.id);
    setCatEditForm({ name: c.name, emoji: c.emoji || '', description: c.description || '' });
    setPanel('edit-category');
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!catEditForm.name.trim()) return;
    setSubmitting(true);
    try {
      await updateCategory(editId, { name: catEditForm.name.trim(), emoji: catEditForm.emoji, description: catEditForm.description });
      closePanel();
      refetchCats();
    } catch (err) {
      alert('Failed to update: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      closePanel();
      refetchCats();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  // --- Matching Rules ---
  const handleAddRule = async (e) => {
    e.preventDefault();
    if (!ruleForm.category_id || !ruleForm.pattern.trim()) return;
    setSubmitting(true);
    try {
      await createMatchingRule({ category_id: ruleForm.category_id, pattern: ruleForm.pattern.trim() });
      setRuleForm({ category_id: '', pattern: '' });
      closePanel();
      refetchRules();
    } catch (err) {
      alert('Failed to add: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRule = async (id) => {
    if (!confirm('Delete this matching rule?')) return;
    try {
      await deleteMatchingRule(id);
      closePanel();
      refetchRules();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const startEditRule = (r) => {
    setEditId(r.id);
    setRuleEditForm({ category_id: r.category_id, pattern: r.pattern });
    setPanel('edit-rule');
  };

  const handleUpdateRule = async (e) => {
    e.preventDefault();
    if (!ruleEditForm.category_id || !ruleEditForm.pattern.trim()) return;
    setSubmitting(true);
    try {
      await updateMatchingRule(editId, {
        category_id: ruleEditForm.category_id,
        pattern: ruleEditForm.pattern.trim(),
      });
      closePanel();
      refetchRules();
    } catch (err) {
      alert('Failed to update: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const [activeTab, setActiveTab] = useState('family');

  return (
    <PageRoot className="page page--full-width page--settings">
      <PageHeader
        title="Settings"
        subtitle="Household members, bank accounts, categories, and rules that help categorize transactions."
        withSubHeader
      />
      <PageSubHeader ariaLabel="Settings sections">
        <Tabs
          variant="small-shrink"
          tabs={[
            { id: 'family', label: 'Family', icon: SETTINGS_TAB_ICONS.family },
            { id: 'accounts', label: 'Bank Accounts', icon: SETTINGS_TAB_ICONS.accounts },
            { id: 'categories', label: 'Categories', icon: SETTINGS_TAB_ICONS.categories },
            { id: 'rules', label: 'Matching Rules', icon: SETTINGS_TAB_ICONS.rules },
            { id: 'account', label: 'Others', icon: SETTINGS_TAB_ICONS.account },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
      </PageSubHeader>

      <PageMain>
      {/* --- Account Section --- */}
      {activeTab === 'account' && (
      <>
        <SectionHeader subtitle="Your preferred currency for new operations and display.">
          Default Currency
        </SectionHeader>
        <SectionCard hideHeader>
          {prefsLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="form-row" style={{ alignItems: 'flex-end', gap: '0.75rem' }}>
              <Select
                label="Currency"
                value={prefsCurrency}
                onChange={(v) => setPrefsCurrency(v)}
                options={CURRENCIES.map((c) => ({ value: c, label: c }))}
              />
              <Button
                variant="primary"
                size="sm"
                disabled={currencySaving || prefsCurrency === prefs?.default_currency}
                onClick={handleSaveCurrency}
              >
                {currencySaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </SectionCard>

        <SectionHeader subtitle="Encrypt your backups with a password. You will need this password to restore a backup.">
          Backup Password
        </SectionHeader>
        <SectionCard hideHeader>
          {prefsLoading ? (
            <p>Loading...</p>
          ) : (
            <form onSubmit={handlePasswordSubmit}>
              {prefs?.has_backup_password && (
                <div className="form-group">
                  <label>Current password</label>
                  <input
                    type="password"
                    value={pwForm.old_password}
                    onChange={(e) => setPwForm({ ...pwForm, old_password: e.target.value })}
                    required
                    autoComplete="off"
                  />
                </div>
              )}
              <div className="form-group">
                <label>{prefs?.has_backup_password ? 'New password' : 'Password'}</label>
                <input
                  type="password"
                  value={pwForm.new_password}
                  onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })}
                  required
                  minLength={8}
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <label>Confirm {prefs?.has_backup_password ? 'new ' : ''}password</label>
                <input
                  type="password"
                  value={pwForm.confirm_password}
                  onChange={(e) => setPwForm({ ...pwForm, confirm_password: e.target.value })}
                  required
                  minLength={8}
                  autoComplete="off"
                />
                <p className="form-hint">Minimum 8 characters. Store this password somewhere safe — it cannot be recovered.</p>
              </div>
              {pwError && <p className="form-error">{pwError}</p>}
              {pwSuccess && <p className="form-success">{pwSuccess}</p>}
              <div className="form-actions">
                <Button type="submit" variant="primary" disabled={pwSaving}>
                  {pwSaving ? 'Saving...' : prefs?.has_backup_password ? 'Change Password' : 'Set Password'}
                </Button>
              </div>
            </form>
          )}
        </SectionCard>

        <SectionHeader subtitle="Download all your data (CSVs, preferences, matching rules) as a ZIP file.">
          Export Data
        </SectionHeader>
        <SectionCard hideHeader>
          {prefs?.has_backup_password ? (
            <form onSubmit={handleExport}>
              <div className="form-group">
                <label>Backup password</label>
                <input
                  type="password"
                  value={exportPassword}
                  onChange={(e) => setExportPassword(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
              {exportError && <p className="form-error">{exportError}</p>}
              <div className="form-actions">
                <Button type="submit" variant="primary" size="sm" disabled={exporting || !exportPassword}>
                  {exporting ? 'Exporting...' : 'Download ZIP'}
                </Button>
              </div>
            </form>
          ) : (
            <p className="form-hint">Set a backup password above before exporting.</p>
          )}
        </SectionCard>
      </>
      )}

      {/* --- Family Section --- */}
      {activeTab === 'family' && (
      <>
      <SectionHeader
        subtitle="People in your household; each has a color for charts and attribution."
        actions={<Button type="button" variant="primary" size="sm" onClick={() => setPanel('add-member')}>+ Add</Button>}
      >
        Family Members
      </SectionHeader>
      <SectionCard hideHeader>
        <AsyncContent loading={membersLoading} error={membersError}>
          {(!members || members.length === 0) ? (
            <EmptyState message="No members yet." />
          ) : (
          <TableBlock>
          <table>
            <thead>
              <tr>
                <th>First name</th>
                <th>Last name</th>
                <th>Color</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const memberColor = m.color || '#3b82f6';
                return (
                <tr
                  key={m.id}
                  className="settings-table-row"
                  onClick={() => startEditMember(m)}
                >
                  <td>{m.first_name}</td>
                  <td>
                    {(m.last_name || '').trim() ? m.last_name : <span className="u-muted">—</span>}
                  </td>
                  <td className="settings-member-color-cell">
                    <span
                      className="member-color-dot member-color-dot--column"
                      style={{ '--dot-color': memberColor }}
                      role="img"
                      aria-label={`Member color ${memberColor}`}
                      title={memberColor}
                    />
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
          </TableBlock>
          )}
        </AsyncContent>
      </SectionCard>
      </>
      )}

      {/* --- Accounts Section --- */}
      {activeTab === 'accounts' && (
      <>
      <SectionHeader
        subtitle="Accounts you track for logging operations and balances."
        actions={<Button type="button" variant="primary" size="sm" onClick={() => setPanel('add-account')}>+ Add</Button>}
      >
        Accounts
      </SectionHeader>
      <SectionCard hideHeader>
        <AsyncContent loading={accountsLoading} error={accountsError}>
          {(!accounts || accounts.length === 0) ? (
            <EmptyState message="No accounts yet." />
          ) : (
          <TableBlock>
          <table>
            <thead>
              <tr>
                <th>Bank</th>
                <th>Account Name</th>
                <th>Account Number</th>
                <th>Image URL</th>
                <th>Owner</th>
                <th>Savings</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr
                  key={a.id}
                  className="settings-table-row"
                  onClick={() => startEditAccount(a)}
                >
                  <td>{a.bank_name}</td>
                  <td>{a.nickname}</td>
                  <td><Redacted>{a.account_number}</Redacted></td>
                  <td className="settings-account-image-url">
                    {(a.image_url || '').trim() ? (
                      <>
                        <img
                          className="settings-account-thumb"
                          src={a.image_url.trim()}
                          alt=""
                          loading="lazy"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <a
                          href={a.image_url.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="settings-account-image-link"
                          title={a.image_url.trim()}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {a.image_url.trim()}
                        </a>
                      </>
                    ) : (
                      <span className="u-muted">—</span>
                    )}
                  </td>
                  <td>{memMap[a.member_id] || a.member_id}</td>
                  <td>
                    {accountIsSavings(a) ? (
                      <span className="settings-account-savings-badge">Savings</span>
                    ) : (
                      <span className="u-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </TableBlock>
          )}
        </AsyncContent>
      </SectionCard>
      </>
      )}

      {/* --- Categories Section --- */}
      {activeTab === 'categories' && (
      <>
      <SectionHeader
        subtitle="Labels for income and expenses; every operation is tied to a category."
        actions={<Button type="button" variant="primary" size="sm" onClick={() => setPanel('add-category')}>+ Add</Button>}
      >
        Categories
      </SectionHeader>
      <SectionCard hideHeader>
        <AsyncContent loading={catsLoading} error={catsError}>
          {(!categories || categories.length === 0) ? (
            <EmptyState message="No categories yet." />
          ) : (
          <TableBlock>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr
                  key={c.id}
                  className="settings-table-row"
                  onClick={() => startEditCategory(c)}
                >
                  <td>{categorySelectContent({ name: c.name, emoji: c.emoji })}</td>
                  <td><span className="u-muted">{c.description || ''}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          </TableBlock>
          )}
        </AsyncContent>
      </SectionCard>
      </>
      )}

      {/* --- Matching Rules Section --- */}
      {activeTab === 'rules' && (
      <>
      <SectionHeader
        subtitle="Patterns used to categorize transactions. The AI agent uses these rules when processing expenses."
        actions={<Button type="button" variant="primary" size="sm" onClick={() => setPanel('add-rule')}>+ Add</Button>}
      >
        Matching Rules
      </SectionHeader>
      <SectionCard hideHeader>
        <AsyncContent loading={rulesLoading} error={rulesError}>
          {(!matchingRules || matchingRules.length === 0) ? (
            <EmptyState message="No matching rules yet." />
          ) : (
          <TableBlock>
          <table>
            <thead>
              <tr>
                <th>Pattern</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {matchingRules.map((r) => (
                <tr
                  key={r.id}
                  className="settings-table-row"
                  onClick={() => startEditRule(r)}
                >
                  <td><code><Redacted>{r.pattern}</Redacted></code></td>
                  <td>{catMap[r.category_id] || r.category_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </TableBlock>
          )}
        </AsyncContent>
      </SectionCard>
      </>
      )}
      </PageMain>

      {/* --- Add Member Panel --- */}
      <SidePanel open={panel === 'add-member'} onClose={closePanel} title="Add Member">
        <form onSubmit={handleAddMember}>
          <div className="form-group">
            <label>First name</label>
            <input type="text" value={memberForm.first_name} onChange={(e) => setMemberForm({ ...memberForm, first_name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Last name</label>
            <input type="text" value={memberForm.last_name} onChange={(e) => setMemberForm({ ...memberForm, last_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Color</label>
            <input type="color" value={memberForm.color} onChange={(e) => setMemberForm({ ...memberForm, color: e.target.value })} />
          </div>
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Adding...' : 'Add Member'}</Button>
            <Button type="button" variant="secondary" onClick={closePanel}>Cancel</Button>
          </div>
        </form>
      </SidePanel>

      {/* --- Edit Member Panel --- */}
      <SidePanel open={panel === 'edit-member'} onClose={closePanel} title="Edit Member">
        <div className="settings-edit-context">
          <span
            className="settings-edit-context__dot"
            style={{ '--dot-color': memberEditForm.color || '#3b82f6' }}
            aria-hidden
          />
          <div>
            <div className="settings-edit-context__title">
              {memberEditForm.first_name} {memberEditForm.last_name}
            </div>
            <p className="settings-edit-context__hint">Update name or color below.</p>
          </div>
        </div>
        <form onSubmit={handleUpdateMember}>
          <div className="form-group">
            <label>First name</label>
            <input type="text" value={memberEditForm.first_name} onChange={(e) => setMemberEditForm({ ...memberEditForm, first_name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Last name</label>
            <input type="text" value={memberEditForm.last_name} onChange={(e) => setMemberEditForm({ ...memberEditForm, last_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Color</label>
            <input type="color" value={memberEditForm.color} onChange={(e) => setMemberEditForm({ ...memberEditForm, color: e.target.value })} />
          </div>
          <div className="form-actions settings-panel-form-actions">
            <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
            <Button type="button" variant="secondary" onClick={closePanel}>Cancel</Button>
            <Button
              type="button"
              variant="danger"
              disabled={submitting}
              onClick={() => handleDeleteMember(editId)}
            >
              Delete member
            </Button>
          </div>
        </form>
      </SidePanel>

      {/* --- Add Account Panel --- */}
      <SidePanel open={panel === 'add-account'} onClose={closePanel} title="Add Account">
        <form onSubmit={handleAddAccount}>
          <div className="form-group">
            <label>Bank name</label>
            <input type="text" value={accountForm.bank_name} onChange={(e) => setAccountForm({ ...accountForm, bank_name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Account name</label>
            <input type="text" value={accountForm.nickname} onChange={(e) => setAccountForm({ ...accountForm, nickname: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Account number</label>
            <input type="text" value={accountForm.account_number} onChange={(e) => setAccountForm({ ...accountForm, account_number: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input type="url" value={accountForm.image_url} onChange={(e) => setAccountForm({ ...accountForm, image_url: e.target.value })} placeholder="https://…" />
          </div>
          <Select
            label="Owner"
            value={accountForm.member_id}
            onChange={(v) => setAccountForm({ ...accountForm, member_id: v })}
            options={(members || []).map((m) => ({ value: m.id, label: `${m.first_name} ${m.last_name}` }))}
            placeholder="Select owner"
            required
          />
          <Select
            label="Currency"
            value={accountForm.currency}
            onChange={(v) => setAccountForm({ ...accountForm, currency: v })}
            options={CURRENCIES.map((c) => ({ value: c, label: c }))}
          />
          <div className="form-group">
            <label>Opening balance (optional)</label>
            <input type="number" min="0" step="0.01" value={accountForm.opening_balance} onChange={(e) => setAccountForm({ ...accountForm, opening_balance: e.target.value })} placeholder="0.00" />
          </div>
          <div className="form-group">
            <label>Opening balance date</label>
            <input type="date" value={accountForm.opening_balance_date} onChange={(e) => setAccountForm({ ...accountForm, opening_balance_date: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                checked={accountForm.is_savings}
                onChange={(e) => setAccountForm({ ...accountForm, is_savings: e.target.checked })}
              />
              <span>Savings account</span>
            </label>
            <p className="form-hint">Mark accounts where you set money aside. Used for total savings tracking.</p>
          </div>
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Adding...' : 'Add Account'}</Button>
            <Button type="button" variant="secondary" onClick={closePanel}>Cancel</Button>
          </div>
        </form>
      </SidePanel>

      {/* --- Edit Account Panel --- */}
      <SidePanel open={panel === 'edit-account'} onClose={closePanel} title="Edit Account">
        <div className="settings-edit-context">
          <div>
            <div className="settings-edit-context__title">{accountEditForm.nickname || 'Account'}</div>
            <div className="settings-edit-context__subtitle">{accountEditForm.bank_name}</div>
            <p className="settings-edit-context__hint">
              {accountEditForm.is_savings
                ? 'Savings account — included in savings totals.'
                : 'Balances and reconciliation apply to this account.'}
            </p>
          </div>
        </div>
        <form onSubmit={handleUpdateAccount}>
          <div className="form-group">
            <label>Bank name</label>
            <input type="text" value={accountEditForm.bank_name} onChange={(e) => setAccountEditForm({ ...accountEditForm, bank_name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Account name</label>
            <input type="text" value={accountEditForm.nickname} onChange={(e) => setAccountEditForm({ ...accountEditForm, nickname: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Account number</label>
            <input type="text" value={accountEditForm.account_number} onChange={(e) => setAccountEditForm({ ...accountEditForm, account_number: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input type="url" value={accountEditForm.image_url} onChange={(e) => setAccountEditForm({ ...accountEditForm, image_url: e.target.value })} placeholder="https://…" />
          </div>
          <Select
            label="Owner"
            value={accountEditForm.member_id}
            onChange={(v) => setAccountEditForm({ ...accountEditForm, member_id: v })}
            options={(members || []).map((m) => ({ value: m.id, label: `${m.first_name} ${m.last_name}` }))}
            placeholder="Select owner"
          />
          <Select
            label="Currency"
            value={accountEditForm.currency}
            onChange={(v) => setAccountEditForm({ ...accountEditForm, currency: v })}
            options={CURRENCIES.map((c) => ({ value: c, label: c }))}
          />
          <div className="form-group">
            <label>Opening balance</label>
            <input type="number" min="0" step="0.01" value={accountEditForm.opening_balance} onChange={(e) => setAccountEditForm({ ...accountEditForm, opening_balance: e.target.value })} placeholder="0.00" />
          </div>
          <div className="form-group">
            <label>Opening balance date</label>
            <input type="date" value={accountEditForm.opening_balance_date} onChange={(e) => setAccountEditForm({ ...accountEditForm, opening_balance_date: e.target.value })} />
            <p className="form-hint">Include transactions on and after this date.</p>
          </div>
          <div className="form-group">
            <label>Statement balance (reconciliation)</label>
            <input type="number" step="0.01" value={accountEditForm.statement_balance} onChange={(e) => setAccountEditForm({ ...accountEditForm, statement_balance: e.target.value })} placeholder="From bank" />
          </div>
          <div className="form-group">
            <label>Statement date</label>
            <input type="date" value={accountEditForm.statement_date} onChange={(e) => setAccountEditForm({ ...accountEditForm, statement_date: e.target.value })} />
            <p className="form-hint">Clear statement fields to remove. Dashboard shows variance vs derived balance.</p>
          </div>
          <div className="form-group">
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                checked={accountEditForm.is_savings}
                onChange={(e) => setAccountEditForm({ ...accountEditForm, is_savings: e.target.checked })}
              />
              <span>Savings account</span>
            </label>
            <p className="form-hint">Mark accounts where you set money aside. Used for total savings tracking.</p>
          </div>
          <div className="form-actions settings-panel-form-actions">
            <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
            <Button type="button" variant="secondary" onClick={closePanel}>Cancel</Button>
            <Button
              type="button"
              variant="danger"
              disabled={submitting}
              onClick={() => handleDeleteAccount(editId)}
            >
              Delete account
            </Button>
          </div>
        </form>
      </SidePanel>

      {/* --- Add Category Panel --- */}
      <SidePanel open={panel === 'add-category'} onClose={closePanel} title="Add Category">
        <form onSubmit={handleAddCategory}>
          <div className="form-row form-row--category-add">
            <div className="form-group form-group--emoji">
              <label>Emoji</label>
              <input type="text" value={catForm.emoji} onChange={(e) => setCatForm({ ...catForm, emoji: e.target.value })} placeholder="😀" className="category-emoji-input" />
            </div>
            <div className="form-group form-group--grow">
              <label>Name</label>
              <input type="text" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input type="text" value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} placeholder="What this category is for" />
          </div>
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Adding...' : 'Add Category'}</Button>
            <Button type="button" variant="secondary" onClick={closePanel}>Cancel</Button>
          </div>
        </form>
      </SidePanel>

      {/* --- Edit Category Panel --- */}
      <SidePanel open={panel === 'edit-category'} onClose={closePanel} title="Edit Category">
        <div className="settings-edit-context settings-edit-context--category">
          <span className="settings-edit-context__emoji" aria-hidden>
            {catEditForm.emoji?.trim() ? (
              <EmojiPixel size="2">{catEditForm.emoji.trim()}</EmojiPixel>
            ) : (
              '·'
            )}
          </span>
          <div>
            <div className="settings-edit-context__title">{catEditForm.name || 'Category'}</div>
            <p className="settings-edit-context__hint">Emoji, name, and description are shown across the app.</p>
          </div>
        </div>
        <form onSubmit={handleUpdateCategory}>
          <div className="form-row form-row--category-add">
            <div className="form-group form-group--emoji">
              <label>Emoji</label>
              <input type="text" value={catEditForm.emoji} onChange={(e) => setCatEditForm({ ...catEditForm, emoji: e.target.value })} placeholder="😀" className="category-emoji-input" />
            </div>
            <div className="form-group form-group--grow">
              <label>Name</label>
              <input type="text" value={catEditForm.name} onChange={(e) => setCatEditForm({ ...catEditForm, name: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input type="text" value={catEditForm.description} onChange={(e) => setCatEditForm({ ...catEditForm, description: e.target.value })} placeholder="What this category is for" />
          </div>
          <div className="form-actions settings-panel-form-actions">
            <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
            <Button type="button" variant="secondary" onClick={closePanel}>Cancel</Button>
            <Button
              type="button"
              variant="danger"
              disabled={submitting}
              onClick={() => handleDeleteCategory(editId)}
            >
              Delete category
            </Button>
          </div>
        </form>
      </SidePanel>

      {/* --- Add Matching Rule Panel --- */}
      <SidePanel open={panel === 'add-rule'} onClose={closePanel} title="Add matching rule">
        <form onSubmit={handleAddRule}>
          <div className="form-group">
            <label>Text pattern</label>
            <input type="text" value={ruleForm.pattern} onChange={(e) => setRuleForm({ ...ruleForm, pattern: e.target.value })} placeholder="e.g. PSC, SWILE, PIGMENT" required />
          </div>
          <Select
            label="Category"
            value={ruleForm.category_id}
            onChange={(v) => setRuleForm({ ...ruleForm, category_id: v })}
            options={(categories || []).map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Select category"
            searchable
            required
          />
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Adding...' : 'Add rule'}</Button>
            <Button type="button" variant="secondary" onClick={closePanel}>Cancel</Button>
          </div>
        </form>
      </SidePanel>

      {/* --- Edit Matching Rule Panel --- */}
      <SidePanel open={panel === 'edit-rule'} onClose={closePanel} title="Edit matching rule">
        <div className="settings-edit-context settings-edit-context--rule">
          <div>
            <code className="settings-edit-context__code">{ruleEditForm.pattern || '—'}</code>
            <div className="settings-edit-context__subtitle">
              {catMap[ruleEditForm.category_id] || 'Select a category below'}
            </div>
            <p className="settings-edit-context__hint">
              Patterns match transaction text (case-insensitive). First match wins.
            </p>
          </div>
        </div>
        <form onSubmit={handleUpdateRule}>
          <div className="form-group">
            <label>Text pattern</label>
            <input
              type="text"
              value={ruleEditForm.pattern}
              onChange={(e) => setRuleEditForm({ ...ruleEditForm, pattern: e.target.value })}
              placeholder="e.g. PSC, SWILE, PIGMENT"
              required
            />
          </div>
          <Select
            label="Category"
            value={ruleEditForm.category_id}
            onChange={(v) => setRuleEditForm({ ...ruleEditForm, category_id: v })}
            options={(categories || []).map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Select category"
            searchable
            required
          />
          <div className="form-actions settings-panel-form-actions">
            <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
            <Button type="button" variant="secondary" onClick={closePanel}>Cancel</Button>
            <Button
              type="button"
              variant="danger"
              disabled={submitting}
              onClick={() => handleDeleteRule(editId)}
            >
              Delete rule
            </Button>
          </div>
        </form>
      </SidePanel>
    </PageRoot>
  );
}
