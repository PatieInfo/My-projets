# Security Checklist — Read Before Every `git push`

> Stop. Run through this list before pushing anything to GitHub.

---

## Before You Push

- [ ] No API keys or secret tokens in any file
- [ ] No passwords or login credentials
- [ ] No personal email addresses
- [ ] No phone numbers
- [ ] No full names, addresses, or ID numbers
- [ ] No `.env` files committed (check with `git status`)
- [ ] No database connection strings
- [ ] No private keys or certificates

---

## Things That Should NEVER Be on GitHub

| What | Example |
|---|---|
| API keys | `sk_live_abc123...`, `AIzaSy...` |
| Passwords | `password=MySecret123` |
| Personal email | `yourname@gmail.com` inside code |
| Phone number | `+1 555 000 0000` inside code |
| `.env` files | Any file named `.env`, `.env.local` etc. |
| Auth tokens | `Bearer eyJhbGci...` |
| Database URLs | `mongodb+srv://user:pass@cluster...` |

---

## Safe Habits

- Store secrets in a `.env` file and add `.env` to `.gitignore`
- Use environment variable names in code, never the actual values
- If you accidentally pushed a secret — rotate it immediately, then remove it from git history

---

## Quick Commands

```bash
# Check what you are about to commit
git diff --staged

# Check which files are tracked
git status

# Confirm .env is ignored
cat .gitignore | grep .env
```

---

> One leaked API key can compromise your account, your users, and your projects.
> When in doubt, do not commit it.
