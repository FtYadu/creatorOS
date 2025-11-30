# GitHub Actions Setup Guide

## Self-Hosted Runner Setup

If you want to use your own infrastructure instead of GitHub-hosted runners:

### 1. Add Self-Hosted Runner

**On GitHub:**
1. Go to your repository
2. Navigate to **Settings** → **Actions** → **Runners**
3. Click **New self-hosted runner**
4. Follow the platform-specific instructions

### 2. Update Workflow

In `.github/workflows/ci-cd.yml`, change:

```yaml
runs-on: ubuntu-latest
```

To:

```yaml
runs-on: self-hosted
```

Or use labels for specific runners:

```yaml
runs-on: [self-hosted, linux, x64]
```

### 3. Runner Labels

You can specify multiple labels to target specific runners:

```yaml
runs-on: [self-hosted, production, high-memory]
```

---

## GitHub Secrets Configuration

Add these secrets in **Settings** → **Secrets and variables** → **Actions**:

### Required Secrets:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AI
ANTHROPIC_API_KEY=your-anthropic-key

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.netlify.app

# Netlify (for automatic deployment)
NETLIFY_AUTH_TOKEN=your-netlify-token
NETLIFY_SITE_ID=your-site-id
```

### Getting Netlify Tokens:

1. **NETLIFY_AUTH_TOKEN**:
   ```bash
   # Using Netlify CLI
   netlify login
   netlify --telemetry-disable
   # Then go to https://app.netlify.com/user/applications
   # Create new personal access token
   ```

2. **NETLIFY_SITE_ID**:
   ```bash
   # In your Netlify site settings
   # Site settings → General → Site information → API ID
   ```

---

## Workflow Features

### Current Setup:

1. **Test Job** (runs on every push/PR)
   - ✅ Checkout code
   - ✅ Setup Node.js 18
   - ✅ Install dependencies
   - ✅ Run TypeScript checks
   - ✅ Run tests
   - ✅ Build application
   - ✅ Upload build artifacts

2. **Deploy Job** (runs only on main branch)
   - ✅ Builds for production
   - ✅ Deploys to Netlify automatically
   - ✅ Comments on commits with deploy URL

3. **Lint Job** (runs on every push/PR)
   - ✅ Runs ESLint
   - ✅ Code quality checks

### Branch Strategy:

- **main**: Auto-deploys to production
- **develop**: Runs tests, no deployment
- **Pull Requests**: Runs all checks + preview deployment

---

## Advanced Configuration

### Matrix Builds (test multiple Node versions):

```yaml
strategy:
  matrix:
    node-version: [16.x, 18.x, 20.x]
    os: [ubuntu-latest, windows-latest, macos-latest]
```

### Conditional Jobs:

```yaml
if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```

### Caching for Faster Builds:

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### Parallel Jobs:

```yaml
jobs:
  test:
    needs: []  # Runs immediately
  lint:
    needs: []  # Runs in parallel with test
  deploy:
    needs: [test, lint]  # Waits for both
```

---

## Self-Hosted Runner Benefits

✅ **Faster builds** - Your hardware, your speed
✅ **Cost savings** - No GitHub Actions minutes charges
✅ **Custom environment** - Install any software you need
✅ **Access to private resources** - Connect to private databases
✅ **GPU access** - For AI/ML tasks

---

## Self-Hosted Runner Setup Examples

### Linux (Ubuntu/Debian):

```bash
# Create a folder
mkdir actions-runner && cd actions-runner

# Download the latest runner package
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# Extract the installer
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configure the runner
./config.sh --url https://github.com/YOUR_USERNAME/creatorOS --token YOUR_TOKEN

# Run it
./run.sh

# Or install as a service
sudo ./svc.sh install
sudo ./svc.sh start
```

### Docker:

```dockerfile
FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache bash curl git

# Download and extract runner
WORKDIR /actions-runner
RUN curl -o actions-runner-linux-x64.tar.gz -L \
    https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz \
    && tar xzf ./actions-runner-linux-x64.tar.gz

# Configure runner (using environment variables)
ENTRYPOINT ["./run.sh"]
```

```bash
# Run the Docker runner
docker run -d \
  --name github-runner \
  -e RUNNER_NAME=docker-runner \
  -e GITHUB_TOKEN=your-token \
  -e REPO_URL=https://github.com/YOUR_USERNAME/creatorOS \
  github-runner
```

### macOS:

```bash
# Create a folder
mkdir actions-runner && cd actions-runner

# Download the latest runner package
curl -o actions-runner-osx-x64-2.311.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-osx-x64-2.311.0.tar.gz

# Extract the installer
tar xzf ./actions-runner-osx-x64-2.311.0.tar.gz

# Configure the runner
./config.sh --url https://github.com/YOUR_USERNAME/creatorOS --token YOUR_TOKEN

# Run it
./run.sh
```

---

## Monitoring & Logs

### View Runner Status:
- Go to **Settings** → **Actions** → **Runners**
- See online/offline status
- View runner activity

### View Workflow Logs:
- Go to **Actions** tab in repository
- Click on any workflow run
- Expand job steps to see detailed logs

### Runner Logs:
```bash
# View runner logs
journalctl -u actions.runner.* -f

# Or if running manually
tail -f _diag/Runner_*.log
```

---

## Security Best Practices

1. **Use separate runners for different environments**
   ```yaml
   runs-on: [self-hosted, production]  # For production
   runs-on: [self-hosted, staging]      # For staging
   ```

2. **Limit runner access**
   - Only install runners in private repositories
   - Use organization-level runners for better control

3. **Keep runners updated**
   ```bash
   # Update runner
   cd actions-runner
   ./config.sh remove
   # Download new version
   ./config.sh --url ... --token ...
   ```

4. **Use environment protection rules**
   - Settings → Environments → Add protection rules
   - Require approvals for production deployments

---

## Troubleshooting

### Runner not connecting:
```bash
# Check runner status
./run.sh status

# Test connection
curl -I https://github.com

# Check logs
cat _diag/Runner_*.log
```

### Build fails on self-hosted runner:
```bash
# Ensure Node.js is installed
node --version

# Ensure Git is installed
git --version

# Clean npm cache
npm cache clean --force
```

### Permission issues:
```bash
# Run as service user
sudo useradd -m github-runner
sudo su - github-runner
cd /home/github-runner/actions-runner
./run.sh
```

---

## Cost Comparison

### GitHub-Hosted Runners:
- Free tier: 2,000 minutes/month (private repos)
- Standard: $0.008/minute
- Typical CreatorOS build: ~5 minutes = $0.04/build

### Self-Hosted Runners:
- Free GitHub Actions usage (unlimited minutes)
- Your infrastructure cost only
- Typical CreatorOS build: $0/build (after setup)

---

## Next Steps

1. ✅ Workflow file created (`.github/workflows/ci-cd.yml`)
2. 📝 Add GitHub Secrets
3. 🖥️ (Optional) Set up self-hosted runner
4. 🚀 Push code and watch it deploy!

Your CI/CD pipeline is ready to go!
