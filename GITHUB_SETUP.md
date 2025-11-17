# GitHub Setup Guide

## Step-by-Step Instructions to Push to GitHub

### Step 1: Initialize Git Repository (Already Done ✅)
```bash
git init
```

### Step 2: Add All Files
```bash
git add .
```

### Step 3: Create Initial Commit
```bash
git commit -m "Initial commit: OrangeHRM Playwright automation framework

- Complete Page Object Model implementation
- E2E and Integration test suites
- Utilities and helpers
- CI/CD workflow for GitHub Actions
- Comprehensive documentation
- Fixed network idle timeout issues
- Configurable timeouts for slow internet"
```

### Step 4: Login to GitHub (If Not Already Logged In)

1. Go to [GitHub.com](https://github.com)
2. Click **"Sign in"** in the top right corner
3. Enter your credentials:
   - **Username or email**: Your GitHub username/email
   - **Password**: Your GitHub password
4. If you don't have a GitHub account:
   - Click **"Sign up"**
   - Follow the registration process
   - Verify your email address

### Step 5: Create GitHub Repository

1. After logging in, click the **"+"** icon in the top right
2. Select **"New repository"**
3. Fill in the details:
   - **Repository name**: `orangehrm-playwright-automation` (or your preferred name)
   - **Description**: "Production-grade Playwright automation framework for OrangeHRM Demo"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

### Step 6: Authenticate Git with GitHub

You'll need to authenticate when pushing. Choose one method:

#### Option A: Personal Access Token (Recommended)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token (classic)"**
3. Give it a name: `OrangeHRM Automation`
4. Select scopes: Check **`repo`** (full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token immediately** (you won't see it again!)
7. When pushing, use the token as your password:
   ```bash
   # Username: your-github-username
   # Password: paste-your-token-
   
   starting the actions
   ```

#### Option B: GitHub CLI (Easier)

```bash
# Install GitHub CLI if not installed
# Windows: winget install GitHub.cli
# Or download from: https://cli.github.com/

# Login to GitHub
gh auth login

# Follow the prompts to authenticate
```

#### Option C: SSH Keys (For Advanced Users)

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "shoaib.latif@ahksolution.com"

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
# Copy public key: cat ~/.ssh/id_ed25519.pub

# Then use SSH URL for remote:
# git remote add origin git@github.com:YOUR_USERNAME/repo-name.git
```

### Step 7: Add Remote and Push

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/orangehrm-playwright-automation.git

# Or if you prefer SSH:
# git remote add origin git@github.com:YOUR_USERNAME/orangehrm-playwright-automation.git

# Rename default branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Alternative: Using GitHub CLI (if installed)

If you have GitHub CLI installed:

```bash
# Create repository and push in one command
gh repo create orangehrm-playwright-automation --public --source=. --remote=origin --push
```

## Quick Commands Summary

```bash
# 1. Add files
git add .

# 2. Commit
git commit -m "Initial commit: OrangeHRM Playwright automation framework"

# 3. Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/orangehrm-playwright-automation.git

# 4. Push (will prompt for GitHub credentials)
git push -u origin main
# Username: your-github-username
# Password: your-personal-access-token (NOT your GitHub password)
```

## Alternative: Use Azure DevOps Instead

If you prefer to use Azure DevOps (since you already have Azure repos):

### Azure DevOps Setup

```bash
# 1. Create repository in Azure DevOps
# Go to: https://dev.azure.com/YOUR_ORG
# Create new repository

# 2. Add remote
git remote add origin https://dev.azure.com/YOUR_ORG/YOUR_PROJECT/_git/orangehrm-automation

# 3. Push
git push -u origin main
```

**Note**: Azure DevOps uses your existing Azure credentials, so no additional authentication needed!

## Verify Your Setup

After pushing, verify:

1. Go to your GitHub repository
2. Check that all files are present
3. Verify `.gitignore` is working (node_modules should not be visible)
4. Check that README.md displays correctly

## Future Updates

For future changes:

```bash
# Stage changes
git add .

# Commit
git commit -m "Your commit message"

# Push
git push
```

## Branch Strategy (Optional)

For better collaboration:

```bash
# Create and switch to develop branch
git checkout -b develop

# Push develop branch
git push -u origin develop
```

## Notes

- Your global git config (name: Shoaib Latif, email: shoaib.latif@ahksolution.com) will be used
- The `.gitignore` file is already configured to exclude:
  - `node_modules/`
  - `test-results/`
  - `.env` files
  - IDE files
  - Build outputs

## Troubleshooting

### If you get authentication error:
- **GitHub no longer accepts passwords** - You MUST use Personal Access Token
- Generate token: GitHub → Settings → Developer settings → Personal access tokens
- Use token as password when pushing

### If you're not logged into GitHub:
- Go to [github.com](https://github.com) and sign in
- Or create a new account if you don't have one

### If remote already exists:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/repo-name.git
```

### To check remote:
```bash
git remote -v
```

### If you prefer Azure DevOps:
Since you already have Azure repos, you can use Azure DevOps instead:
- No need to create GitHub account
- Uses your existing Azure credentials
- Same git commands, just different remote URL

