#!/bin/bash
# ══════════════════════════════════════════════════════════════
#  BattleX — GitHub Actions Secrets Setup Script
#  Run this ONCE from your local battlex project folder.
#  Prerequisites: GitHub CLI (gh) must be installed.
#  Install: https://cli.github.com/
# ══════════════════════════════════════════════════════════════

set -e

REPO="mrasheed-cse/battleX"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   BattleX GitHub Secrets Setup          ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── Step 1: Check gh CLI is installed ─────────────────────────
if ! command -v gh &> /dev/null; then
  echo "❌  GitHub CLI not found."
  echo "    Install it from: https://cli.github.com/"
  echo "    Then run: gh auth login"
  exit 1
fi

echo "✅  GitHub CLI found"

# ── Step 2: Check logged in ────────────────────────────────────
if ! gh auth status &> /dev/null; then
  echo "🔐  Please login to GitHub:"
  gh auth login
fi

echo "✅  GitHub authenticated"
echo ""

# ── Step 3: Get Vercel credentials ────────────────────────────
echo "━━━ VERCEL CREDENTIALS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Go to: https://vercel.com/account/tokens"
echo "2. Click 'Create Token' → name it 'BattleX CI'"
echo "3. Copy the token"
echo ""
read -p "Paste your VERCEL_TOKEN here: " VERCEL_TOKEN
echo ""

echo "Now get your Org ID and Project ID:"
echo "Run this command in a SEPARATE terminal:"
echo "  cat .vercel/project.json"
echo "You'll see: { \"orgId\": \"...\", \"projectId\": \"...\" }"
echo ""
read -p "Paste your VERCEL_ORG_ID here: " VERCEL_ORG_ID
read -p "Paste your VERCEL_PROJECT_ID here: " VERCEL_PROJECT_ID
echo ""

# ── Step 4: Get Supabase credentials ──────────────────────────
echo "━━━ SUPABASE CREDENTIALS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Go to: https://supabase.com → your project → Settings → API"
echo ""
read -p "Paste your SUPABASE_URL (https://xxxx.supabase.co): " SUPABASE_URL
read -p "Paste your SUPABASE_ANON_KEY (eyJh...): " SUPABASE_ANON_KEY
echo ""

# ── Step 5: Set all secrets ────────────────────────────────────
echo "━━━ SETTING SECRETS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

gh secret set VERCEL_TOKEN      --repo "$REPO" --body "$VERCEL_TOKEN"
echo "✅  VERCEL_TOKEN set"

gh secret set VERCEL_ORG_ID     --repo "$REPO" --body "$VERCEL_ORG_ID"
echo "✅  VERCEL_ORG_ID set"

gh secret set VERCEL_PROJECT_ID --repo "$REPO" --body "$VERCEL_PROJECT_ID"
echo "✅  VERCEL_PROJECT_ID set"

gh secret set SUPABASE_URL      --repo "$REPO" --body "$SUPABASE_URL"
echo "✅  SUPABASE_URL set"

gh secret set SUPABASE_ANON_KEY --repo "$REPO" --body "$SUPABASE_ANON_KEY"
echo "✅  SUPABASE_ANON_KEY set"

gh secret set APP_BASE_URL      --repo "$REPO" --body "https://battle-x.vercel.app"
echo "✅  APP_BASE_URL set"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   All secrets set successfully! ✅       ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "Next push to 'main' will trigger the CI/CD pipeline."
echo "Watch it at: https://github.com/$REPO/actions"
echo ""
