# Netlify Deployment Guide for CreatorOS AI

## Quick Start

### 1. Prerequisites
- Netlify account
- Supabase project set up
- Anthropic API key
- Git repository connected

### 2. Deploy to Netlify

#### Option A: Using Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

#### Option B: Using Netlify Dashboard
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18`

### 3. Environment Variables

In Netlify Dashboard → Site settings → Environment variables, add:

```bash
# Required Variables
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

### 4. Supabase Configuration

#### Run Migrations
In Supabase SQL Editor, run these in order:

```sql
-- 1. Pre-production tables
\i supabase/migrations/20251114204258_create_pre_production_tables.sql

-- 2. Post-production tables
\i supabase/migrations/20251115182134_create_post_production_tables.sql

-- 3. Marketing tables
\i supabase/migrations/20251116182403_create_marketing_tables.sql

-- 4. User profiles and RLS
\i supabase/migrations/20251117000000_add_user_profiles_and_rls.sql
```

#### Create Storage Buckets
1. Go to Supabase Dashboard → Storage
2. Create these buckets:
   - `mood-boards` (public)
   - `deliverables` (private)
   - `avatars` (public)

#### Update Auth Settings
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Netlify URL to:
   - Site URL: `https://your-site.netlify.app`
   - Redirect URLs: `https://your-site.netlify.app/**`

### 5. Verify Deployment

After deployment, test these features:
- [ ] Registration works
- [ ] Login works
- [ ] Projects can be created
- [ ] File upload works
- [ ] AI features respond (email parsing, caption generation)

## Build Configuration

The `netlify.toml` file configures:
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18
- Next.js plugin for proper routing
- Security headers

## Common Issues & Solutions

### Issue: Build fails with "Cannot find module"
**Solution**: Ensure all dependencies are in `package.json`, not just `devDependencies` for production packages.

### Issue: 404 on page refresh
**Solution**: Already configured in `netlify.toml` with redirects.

### Issue: Environment variables not working
**Solution**:
- Prefix client-side vars with `NEXT_PUBLIC_`
- Rebuild after adding new env vars
- Check spelling and casing

### Issue: Supabase connection fails
**Solution**:
- Verify Supabase URL and anon key
- Check if project is paused (free tier)
- Verify RLS policies allow access

### Issue: AI features not working
**Solution**:
- Verify Anthropic API key is set
- Check API key has credits
- Review browser console for errors

## Performance Optimization

### Enable Caching
Already configured in `netlify.toml` with appropriate headers.

### Image Optimization
Supabase Storage handles image optimization. Consider adding:
```typescript
// In image URLs, add transformations:
const optimizedUrl = `${imageUrl}?width=800&quality=80`;
```

### API Route Optimization
All API routes use `export const dynamic = 'force-dynamic'` to ensure fresh data.

## Security Checklist

- [ ] Environment variables set in Netlify (not in code)
- [ ] Supabase RLS policies enabled
- [ ] Auth redirect URLs configured
- [ ] CORS settings reviewed
- [ ] API keys secured
- [ ] HTTPS enforced (automatic on Netlify)

## Monitoring

### Netlify Analytics
Enable in: Site settings → Analytics

### Supabase Logs
Monitor in: Supabase Dashboard → Logs

### Error Tracking (Optional)
Consider adding Sentry:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## Rollback

If deployment fails:
```bash
# List deployments
netlify deploy --list

# Rollback to previous
netlify rollback
```

## Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS:
   - Add CNAME record: `www` → `your-site.netlify.app`
   - Add A record: `@` → Netlify IP (provided in dashboard)
4. Enable HTTPS (automatic)

## Continuous Deployment

Already configured when you connect Git:
- Push to main branch → Auto deploy
- Pull requests → Deploy previews
- Failed builds → Email notification

## Cost Estimation

### Netlify
- Free tier: 100GB bandwidth/month
- Pro: $19/month (unlimited bandwidth, better performance)

### Supabase
- Free tier: 500MB database, 1GB file storage
- Pro: $25/month (8GB database, 100GB storage)

### Anthropic
- Pay per use
- ~$0.003 per 1K tokens (Claude Sonnet)
- ~$0.001 per 1K tokens (Claude Haiku)

## Support Resources

- Netlify Docs: https://docs.netlify.com
- Next.js on Netlify: https://docs.netlify.com/frameworks/next-js/
- Supabase Docs: https://supabase.com/docs
- Anthropic Docs: https://docs.anthropic.com

## Post-Deployment Tasks

1. **Update README** with live URL
2. **Configure email templates** in Supabase
3. **Set up monitoring/alerts**
4. **Test all user flows** in production
5. **Enable analytics**
6. **Document known issues**

## Success! 🎉

Your CreatorOS platform is now live on Netlify!

Access your app at: `https://your-site.netlify.app`
